import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Твій секретний ключ (Service Role)
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbGZvaWt0amJuaGV2ZnV4bnV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkwNjUxOSwiZXhwIjoyMDc1NDgyNTE5fQ.yfC_eq-YL8BGWw7cxcCn7hqJvGOaUtTsgmftf6z069M';

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

        const { orderReference, transactionStatus } = body;
        
        console.log(`📥 Отримано Callback. ID: ${orderReference}, Статус: ${transactionStatus}`);

        if (transactionStatus === 'Approved') {
            
            // 👇 МАГІЯ ТУТ: Видаляємо всі букви, залишаємо тільки цифри
            // Якщо прийшло "BOOKING_249" -> стане "249"
            // Якщо прийшло "ORDER_123" -> стане "123"
            const cleanId = orderReference.replace(/\D/g, ''); 
            
            console.log(`🔍 Шукаємо в базі ID: ${cleanId}`);

            const { error } = await supabase
                .from('bookings')
                .update({ status: 'paid' })
                .eq('id', cleanId); // Шукаємо по чистому числу

            if (error) {
                console.error('❌ Помилка Supabase:', error);
            } else {
                console.log('✅ УСПІХ! Статус змінено на PAID для ID:', cleanId);
            }
        }

        return NextResponse.json({
            orderReference,
            status: 'accept',
            time: Date.now(),
            signature: ''
        });

    } catch (error) {
        console.error('🔥 Критична помилка сервера:', error);
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}