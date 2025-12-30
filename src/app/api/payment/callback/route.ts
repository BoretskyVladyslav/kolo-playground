import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 👇 Твій СЕКРЕТНИЙ SERVICE_ROLE ключ (має повні права на запис)
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbGZvaWt0amJuaGV2ZnV4bnV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkwNjUxOSwiZXhwIjoyMDc1NDgyNTE5fQ.yfC_eq-YL8BGWw7cxcCn7hqJvGOaUtTsgmftf6z069M';

// Ініціалізуємо Supabase з правами Адміністратора
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SERVICE_ROLE_KEY
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

        console.log('WayForPay Callback:', body.orderReference, body.transactionStatus);

        const { orderReference, transactionStatus } = body;

        // Якщо оплата успішна -> міняємо статус в базі
        if (transactionStatus === 'Approved') {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'paid' })
                .eq('id', orderReference);

            if (error) {
                console.error('CRITICAL DB ERROR:', error);
            } else {
                console.log('SUCCESS: Order updated to PAID:', orderReference);
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