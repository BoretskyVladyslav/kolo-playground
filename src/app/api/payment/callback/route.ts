import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const SECRET_KEY = process.env.WAYFORPAY_SECRET_KEY!;

export async function POST(req: Request) {
    try {
        const text = await req.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            const params = new URLSearchParams(text);
            data = Object.fromEntries(params);
        }

        if (data.transactionStatus !== 'Approved') {
            return NextResponse.json({ save: true, message: 'Status not approved' });
        }

        const bookingId = data.orderReference.split('_')[1];

        if (bookingId) {
            const { error } = await supabase
                .from('bookings')
                .update({ 
                    status: 'paid',
                    payment_id: String(data.orderReference)
                })
                .eq('id', bookingId);

            if (!error) {
                const { data: booking } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('id', bookingId)
                    .single();

                if (booking?.customer_email) {
                    await resend.emails.send({
                        from: 'Kolo Playground <info@koloplayground.com>',
                        to: [booking.customer_email],
                        subject: '✅ Оплату отримано! Бронювання підтверджено',
                        html: `
                            <div style="font-family: Arial, sans-serif; color: #333;">
                                <h2 style="color: #4CAF50;">Оплата успішна!</h2>
                                <p>Дякуємо, <strong>${booking.customer_name}</strong>.</p>
                                <p>Ми отримали ${data.amount} грн.</p>
                                <p>Чекаємо вас <strong>${booking.date} о ${booking.start_time}</strong>.</p>
                            </div>
                        `
                    });
                }
            }
        }

        const time = Math.floor(Date.now() / 1000);
        const responseString = [
            data.orderReference,
            'accept',
            time
        ].join(';');

        const responseSignature = crypto
            .createHmac('md5', SECRET_KEY)
            .update(responseString)
            .digest('hex');

        return NextResponse.json({
            orderReference: data.orderReference,
            status: 'accept',
            time: time,
            signature: responseSignature
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}