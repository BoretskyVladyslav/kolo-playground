import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

        const { orderReference, transactionStatus } = body;

        if (transactionStatus === 'Approved') {
            await supabase
                .from('bookings')
                .update({ status: 'paid' })
                .eq('id', orderReference);
        }

        return NextResponse.json({
            orderReference,
            status: 'accept',
            time: Date.now(),
            signature: ''
        });

    } catch (error) {
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}