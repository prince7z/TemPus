import mongoose from "mongoose";

const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/Blackmail";

mongoose.connect(DB_URI,
).then(() => {
    console.log("MongoDB connected");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

const accountsSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now} ,
    mails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mails' }]
});
const mailsSchema = new mongoose.Schema({
    msgid: { type: String, required: true,  },
    from : { type: String, required: true },
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'Accounts', required: true },
    subject : { type: String, required: true },
    body : { type: String, required: true },
    date : { type: Date, default: Date.now }  
});

const contactSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    message: { type: String, required: true },  
    subject: { type: String },
    createdAt: { type: Date, default: Date.now} 
});
const Contacts = mongoose.models.Contacts || mongoose.model("Contacts", contactSchema);
const Accounts = mongoose.models.Accounts || mongoose.model("Accounts", accountsSchema);
const Mails = mongoose.models.Mails || mongoose.model("Mails", mailsSchema);

export { Accounts, Mails, Contacts };
