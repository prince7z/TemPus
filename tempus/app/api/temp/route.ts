import Mailjs from "@cemalgnlts/mailjs";
import { NextResponse } from "next/server";
import { Accounts,Mails } from "../MDB/DB";


const mail = new Mailjs();

// Generate a temporary email
export async function PUT(request: Request) {
    try {
        const { email, action } = await request.json();
        if (action === 'buy') {
            const ownResult = await Accounts.findOne({ email });
            if (!ownResult) {
                return NextResponse.json({ error: "Email not found" }, { status: 404 });
            }
            return NextResponse.json({ ownResult,success: true });
        }

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function GET() {
    try {
        // Create a new account
        const account = await mail.createOneAccount();
        if (!account.status) {
            return NextResponse.json({ error: "Failed to create email account" }, { status: 500 });
        }

        // Login to get the auth token
        const loginResult = await mail.login(account.data.username, account.data.password);
  
        if (!loginResult.status) {
            return NextResponse.json({ error: "Failed to login to email account" }, { status: 500 });
        }
        const acc =new Accounts({
            email: account.data.username,
            password: account.data.password,
            token: loginResult.data.token,
            id: loginResult.data.id
        });
       
        await acc.save();
        return NextResponse.json({
            id: loginResult.data.id,
            token: loginResult.data.token,
            email: account.data.username
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "Missing email ID" }, { status: 400 });
        }
        const deleteResult:any = await mail.deleteAccount(id);
        if (!deleteResult.status) {
            return NextResponse.json({ error: "Failed to delete email account" }, { status: 500 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
        const authResult = await mail.loginWithToken(token);
        if (!authResult.status) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        // Get messages
        const messages = await mail.getMessages();
        if (!messages.status) {
            return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
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
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}