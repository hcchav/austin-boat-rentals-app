import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL!;

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, bookingTime } = body;

  if (!name || !email || !phone || !bookingTime) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const { error } = await supabase.from('bookings').insert([
    {
      name,
      email,
      phone,
      booking_time: bookingTime,
    },
  ]);

  if (error) {
    return NextResponse.json({ message: 'Database error', error }, { status: 500 });
  }
  function formatPhone(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
  
    // If it starts with '1' and is 11 digits, just add +
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
  
    // If it's a 10-digit US number, prepend +1
    if (digits.length === 10) {
      return `+1${digits}`;
    }
  
    // Otherwise, return as-is or throw/log
    return phone;
  }
  

     // 👉 Send to Zapier webhook
    const formattedPhone = formatPhone(phone);

    await fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email , phone: formattedPhone, booking_time: bookingTime }),
    });
  

  return NextResponse.json({ message: 'Success' }, { status: 200 });
}
