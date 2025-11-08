import { NextResponse } from 'next/server';
import { Contacts } from '../MDB/DB';

export async function POST(request: Request) {
  try {
    const { email, name, message, subject } = await request.json();

    const contact = new Contacts({
      email,
      name,
      message,
      subject
    });

    await contact.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json({ success: false, error: "Failed to save contact" });
  }
}
