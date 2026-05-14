import Mailjs from "@cemalgnlts/mailjs";
import { NextResponse } from "next/server";
import { Accounts,Mails } from "../MDB/DB";


const mail = new Mailjs();

const TRANSIENT_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomHex = (length: number) => {
    const bytes = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').slice(0, length);
};

const createAccountWithFallback = async () => {
    // First try helper path from the SDK.
    const helperAccount = await withTimeout(mail.createOneAccount(), 30000);
    if (helperAccount?.status) {
        return {
            account: helperAccount,
            loginResult: await withTimeout(mail.login(helperAccount.data.username, helperAccount.data.password), 15000)
        };
    }

    // If helper path fails (often transient in shared serverless egress), fallback to explicit flow with retries.
    const domainResult = await withTimeout(mail.getDomains(), 15000);
    if (!domainResult.status || !Array.isArray(domainResult.data) || domainResult.data.length === 0) {
        return {
            account: helperAccount,
            loginResult: { status: false, message: 'Failed to fetch available domains', statusCode: domainResult?.statusCode || 500, data: '' }
        };
    }

    const preferredDomain = process.env.MAILTM_DOMAIN;
    const chosenDomain = preferredDomain && domainResult.data.some((d: any) => d?.domain === preferredDomain)
        ? preferredDomain
        : domainResult.data[0].domain;

    let lastRegisterResult: any = helperAccount;
    let lastLoginResult: any = null;

    for (let attempt = 1; attempt <= 4; attempt++) {
        const username = `${randomHex(12)}@${chosenDomain}`;
        const password = randomHex(16);

        const registerResult = await withTimeout(mail.register(username, password), 15000);
        lastRegisterResult = registerResult;

        if (!registerResult.status) {
            if (TRANSIENT_STATUS_CODES.has(registerResult?.statusCode)) {
                await sleep(250 * Math.pow(2, attempt));
                continue;
            }
            continue;
        }

        const loginResult = await withTimeout(mail.login(username, password), 15000);
        lastLoginResult = loginResult;

        if (loginResult.status) {
            return {
                account: {
                    status: true,
                    message: 'ok',
                    statusCode: registerResult.statusCode,
                    data: { username, password }
                },
                loginResult
            };
        }

        if (TRANSIENT_STATUS_CODES.has(loginResult?.statusCode)) {
            await sleep(250 * Math.pow(2, attempt));
        }
    }

    return {
        account: lastRegisterResult,
        loginResult: lastLoginResult || { status: false, message: 'Failed to login after registration retries', statusCode: 500, data: '' }
    };
};

// Helper function to add timeout to promises
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout: Operation exceeded ${timeoutMs}ms`)), timeoutMs)
        )
    ]);
};

// Generate a temporary email
export async function PUT(request: Request) {
    try {
        const { email, action } = await request.json();
        if (action === 'buy') {
            const ownResult = await Accounts.findOne({ email });
            if (!ownResult) {
                console.error('PUT /api/temp: Email not found for', email);
                return NextResponse.json({ error: "Email not found" }, { status: 404 });
            }
            return NextResponse.json({ ownResult,success: true });
        }

    } catch (error) {
        console.error('PUT /api/temp error:', error);
        return NextResponse.json({ 
            error: "Internal server error",
            message: (error as any)?.message || String(error)
        }, { status: 500 });
    }
}


export async function GET( request: Request) {
    try {
        // Create a new account with retries and fallback flow for serverless environments.
        const { account, loginResult } = await createAccountWithFallback();
        if (!account.status) {
            console.error('GET /api/temp: createOneAccount failed', JSON.stringify(account));
            return NextResponse.json({ 
                error: "Failed to create email account",
                details: account.message || account
            }, { status: 500 });
        }

        if (!loginResult.status) {
            console.error('GET /api/temp: login failed', JSON.stringify(loginResult));
            return NextResponse.json({ 
                error: "Failed to login to email account",
                details: loginResult.message || loginResult
            }, { status: 500 });
        }
        const acc =new Accounts({
            email: account.data.username,
            password: account.data.password,
            token: loginResult.data.token,
            id: loginResult.data.id,
            forIP: request.headers.get('x-forwarded-for') || 'unknown'
        });
       
        await acc.save();
        return NextResponse.json({
            id: loginResult.data.id,
            token: loginResult.data.token,
            email: account.data.username
        });
    } catch (error) {
        console.error('GET /api/temp error:', error);
        return NextResponse.json({ 
            error: "Internal server error",
            message: (error as any)?.message || String(error)
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "Missing email ID" }, { status: 400 });
        }
        const deleteResult:any = await withTimeout(mail.deleteAccount(id), 15000);
        if (!deleteResult.status) {
            console.error('DELETE /api/temp: deleteAccount failed', JSON.stringify(deleteResult));
            return NextResponse.json({ 
                error: "Failed to delete email account",
                details: deleteResult.message || deleteResult
            }, { status: 500 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/temp error:', error);
        return NextResponse.json({ 
            error: "Internal server error",
            message: (error as any)?.message || String(error)
        }, { status: 500 });
    }
}

// Fetch messages for an email
export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: "Missing auth token" }, { status: 400 });
        }

        // Login with the token to get messages
        const authResult = await withTimeout(mail.loginWithToken(token), 15000);
        if (!authResult.status) {
            console.error('POST /api/temp: loginWithToken failed', JSON.stringify(authResult));
            return NextResponse.json({ 
                error: "Invalid or expired token",
                details: authResult.message || authResult
            }, { status: 401 });
        }

        // Get messages with timeout
        const messages = await withTimeout(mail.getMessages(), 15000);
        if (!messages.status) {
            console.error('POST /api/temp: getMessages failed', JSON.stringify(messages));
            return NextResponse.json({ 
                error: "Failed to fetch messages",
                details: messages.message || messages
            }, { status: 500 });
        }

        // Fetch full message content for each message
        const messagesWithFullContent = await Promise.all(
            messages.data.map(async (msg) => {
                try {
                    const fullMessage = await mail.getMessage(msg.id);
                    // Prefer HTML content, fallback to text, then intro
                    let body = msg.intro || 'No content';
                    if (fullMessage.status && fullMessage.data) {
                        if (fullMessage.data.html && fullMessage.data.html.length > 0) {
                            body = fullMessage.data.html[0]; // HTML content with formatting and buttons
                        } else if (fullMessage.data.text) {
                            body = fullMessage.data.text; // Plain text content
                        }
                    }
                    
                    return {
                        id: msg.id,
                        avatar: msg.from?.address ? `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.from.address)}` : undefined,
                        from: msg.from?.address || 'Unknown',
                        subject: msg.subject || 'No Subject',
                        date: new Date(msg.createdAt || Date.now()).toLocaleString(),
                        body: body
                    };
                } catch (error) {
                    // If fetching full message fails, fallback to intro
                    return {
                        id: msg.id,
                        avatar: msg.from?.address ? `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.from.address)}` : undefined,
                        from: msg.from?.address || 'Unknown',
                        subject: msg.subject || 'No Subject',
                        date: new Date(msg.createdAt || Date.now()).toLocaleString(),
                        body: msg.intro || 'No content'
                    };
                }
            })
        );

        
        const dblist=await Mails.find({to:authResult.data.id});
        const acc=await Accounts.findOne({id:authResult.data.id});
        const msglist=messages.data;
        if (dblist.length<msglist.length){
            const newmsgs=msglist.slice(0,msglist.length-dblist.length);
            for (const msg of newmsgs){
                // Fetch full message for database storage
                let fullBody = msg.intro || 'No content';
                try {
                    const fullMessage = await mail.getMessage(msg.id);
                    if (fullMessage.status && fullMessage.data) {
                        // Prefer HTML content for rich formatting
                        if (fullMessage.data.html && fullMessage.data.html.length > 0) {
                            fullBody = fullMessage.data.html[0];
                        } else if (fullMessage.data.text) {
                            fullBody = fullMessage.data.text;
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch full message for storage:', error);
                }
                
                const newmail=new Mails({
                    msgid:msg.id,
                    from:msg.from?.address || 'Unknown',
                    to:acc?._id || null,
                    subject:msg.subject ||'No Subject',
                    body: fullBody,
                    date: msg.createdAt || Date.now()
                });
                await newmail.save();
                if (acc){
                    acc.mails.push(newmail._id);
                    await acc.save();
                }
            }
        }
      
        return NextResponse.json(messagesWithFullContent);
    } catch (error) {
        console.error('POST /api/temp error:', error);
        return NextResponse.json({ 
            error: "Internal server error",
            message: (error as any)?.message || String(error)
        }, { status: 500 });
    }
}