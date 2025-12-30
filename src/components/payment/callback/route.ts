import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 👇 Твій ключ (hardcoded)
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbGZvaWt0amJuaGV2ZnV4bnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDY1MTksImV4cCI6MjA3NTQ4MjUxOX0.NCo4q-cGu-kkqELosPGZv6WEJU_iwOArJRG4sz_Jt_c';

// Створюємо клієнта з цим ключем
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_KEY
);

export async function POST(req: Request) {
    try {
        const text = await req.text();
        let body;

        try {
            body = JSON.parse(text);
        } catch {
            const params = new URLSearchParams(text);
            body = Object.fromEntries(params);
        }

        console.log('Callback Hit:', body.orderReference, body.transactionStatus);

        const { orderReference, transactionStatus } = body;

        if (transactionStatus === 'Approved') {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'paid' })
                .eq('id', orderReference);

            if (error) {
                console.error('Supabase Update Error:', error);
            } else {
                console.log('Successfully updated to PAID:', orderReference);
            }
        }

        return NextResponse.json({
            orderReference,
            status: 'accept',
            time: Date.now(),
            signature: ''
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}