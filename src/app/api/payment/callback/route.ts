export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifySignature, generateResponseSignature } from '@/lib/wayforpay';
import { createClient } from '@supabase/supabase-js';

const getAdminClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
};

export async function GET() {
    const admin = getAdminClient();
    return NextResponse.json({ status: admin ? 'ALIVE' : 'ERROR' });
}

export async function POST(req: Request) {
    try {
        console.log("🔔 Callback Hit!"); 

        // 👇 Читаємо дані універсально (JSON або Form Data)
        const text = await req.text();
        let data;

        try {
            // Пробуємо як JSON
            data = JSON.parse(text);
        } catch (e) {
            // Якщо не вийшло - пробуємо як Form Data (url-encoded)
            console.log("Not JSON, trying Form Data...");
            const params = new URLSearchParams(text);
            data = Object.fromEntries(params.entries());
        }

        if (!data || !data.orderReference) {
            console.error("❌ Failed to parse data");
            return NextResponse.json({ error: 'No data' }, { status: 400 });
        }

        console.log(`📦 Order: ${data.orderReference}, Status: ${data.transactionStatus}`);

        // Перевірка підпису
        // WayForPay іноді шле підпис як "merchantSignature", а іноді без нього в тілі
        // Тому якщо ми самі формуємо об'єкт з форми, підпис там вже є
        const signature = data.merchantSignature;
        const isValid = verifySignature(data, signature);

        if (!isValid) {
            console.error("❌ Invalid Signature");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        if (data.transactionStatus === 'Approved') {
            const supabaseAdmin = getAdminClient();
            if (supabaseAdmin) {
                const { error } = await supabaseAdmin
                    .from('bookings')
                    .update({ status: 'paid' })
                    .eq('id', data.orderReference);
                
                if (!error) console.log('✅ DB Updated: PAID');
                else console.error('❌ DB Error:', error);
            }
        }

        const time = Date.now();
        const responseSignature = generateResponseSignature(data.orderReference, 'accept', time);

        return NextResponse.json({
            orderReference: data.orderReference,
            status: 'accept',
            time,
            signature: responseSignature
        });

    } catch (error) {
        console.error('💥 Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}