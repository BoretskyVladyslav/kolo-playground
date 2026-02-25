'use server';

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'boretskyvladyslav@gmail.com';

const getSupabaseAdmin = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
};

export async function sendBooking(prevState: any, formData: FormData) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const guests = formData.get('guests') as string;
    const city = formData.get('city') as string;

    if (!name || !phone || !email) {
        return { success: false, message: 'Заповніть всі поля' };
    }

    const price = Number(guests) * 400;

    // --- ЛИСТ КЛІЄНТУ (Стиль: Яскравий, Жовтий, Playful) ---
    try {
        await resend.emails.send({
            from: 'Kolo Playground <onboarding@resend.dev>',
            to: [email],
            subject: `🟡 Твоя гра вже скоро! Заявку прийнято`,
            html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fefce8; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; color: #333;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #ca8a04; margin: 0; font-size: 28px;">KOLO PLAYGROUND</h1>
                        <p style="font-size: 14px; color: #854d0e; letter-spacing: 2px; text-transform: uppercase;">Game & Lounge</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <p style="font-size: 18px; line-height: 1.6;">Привіт, <strong>${name}</strong>! 👋</p>
                        <p style="font-size: 16px; color: #555;">Ми отримали твою заявку. Твій час майже заброньовано! Найближчим часом ми зателефонуємо для підтвердження.</p>
                        
                        <div style="background-color: #f3f4f6; border-left: 4px solid #ca8a04; padding: 15px; margin: 25px 0; border-radius: 4px;">
                            <p style="margin: 5px 0;">📅 <strong>Дата:</strong> ${date}</p>
                            <p style="margin: 5px 0;">⏰ <strong>Час:</strong> ${time}</p>
                            <p style="margin: 5px 0;">👥 <strong>Компанія:</strong> ${guests} чол.</p>
                            <p style="margin: 5px 0;">📍 <strong>Локація:</strong> ${city}</p>
                            <p style="margin: 15px 0 0 0; font-size: 18px; font-weight: bold; color: #ca8a04;">Сума: ${price} грн</p>
                        </div>

                        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">До зустрічі на грі! 🎮</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('Client email skipped (Test Mode)');
    }

    // --- ЛИСТ АДМІНУ (Стиль: Чіткий, Інформативний, Зелений акцент) ---
    try {
        await resend.emails.send({
            from: 'Kolo Admin <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `✅ Нове бронювання: ${price} грн (${name})`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #16a34a; padding: 20px; color: white;">
                        <h2 style="margin: 0;">💰 Нове замовлення</h2>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">Клієнт очікує підтвердження</p>
                    </div>
                    
                    <div style="padding: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Клієнт:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Телефон:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${phone}</td>
                            </tr>
                             <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Дата та час:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #16a34a;">${date} о ${time}</td>
                            </tr>
                             <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Гостей:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${guests}</td>
                            </tr>
                        </table>
                        
                        <div style="margin-top: 20px; text-align: center; background: #f0fdf4; padding: 15px; border-radius: 8px;">
                            <span style="font-size: 24px; font-weight: bold; color: #16a34a;">+${price} грн</span>
                        </div>
                    </div>
                </div>
            `
        });

        return { success: true, message: 'Заявку створено!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Помилка сервера' };
    }
}

export async function sendFranchise(prevState: any, formData: FormData) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    // --- ЛИСТ ФРАНШИЗА (Стиль: Діловий, Строгий, Темно-синій) ---
    try {
        await resend.emails.send({
            from: 'Kolo Franchise <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `💼 ПАРТНЕРСТВО: Запит від ${name}`,
            html: `
                <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; border-top: 5px solid #1e3a8a; padding-top: 20px;">
                    <h2 style="color: #1e3a8a; text-transform: uppercase; margin-bottom: 10px;">Запит на франшизу</h2>
                    <p style="font-style: italic; color: #555;">Потенційний партнер зацікавився відкриттям KOLO.</p>
                    
                    <div style="background-color: #f8fafc; padding: 25px; border: 1px solid #e2e8f0; margin-top: 20px;">
                        <p style="margin: 0 0 10px 0;"><strong>👤 Ім'я:</strong> ${name}</p>
                        <p style="margin: 0 0 20px 0;"><strong>📞 Телефон:</strong> <a href="tel:${phone}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${phone}</a></p>
                        
                        <div style="border-top: 1px solid #cbd5e1; padding-top: 15px;">
                            <p style="color: #475569; font-size: 14px; margin-bottom: 5px;">Повідомлення:</p>
                            <p style="margin: 0; line-height: 1.6; color: #0f172a;">${message}</p>
                        </div>
                    </div>
                    
                    <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Цей лист згенеровано автоматично формою "Стати партнером".</p>
                </div>
            `
        });
        return { success: true, message: 'Запит отримано!' };
    } catch (error) {
        return { success: false, message: 'Помилка' };
    }
}

export async function sendContact(prevState: any, formData: FormData) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    // --- ЛИСТ КОНТАКТИ (Стиль: Нейтральний, Сірий) ---
    try {
        await resend.emails.send({
            from: 'Kolo Contact <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `💬 Питання з сайту: ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 500px;">
                    <h3>Нове повідомлення</h3>
                    <p><strong>Від:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> ${phone}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
                    <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
                </div>
            `
        });
        return { success: true, message: 'Надіслано!' };
    } catch (error) {
        return { success: false, message: 'Помилка' };
    }
}

export async function deleteBooking(id: string) {
    const supabase = getSupabaseAdmin();
    try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateBookingStatus(id: string, status: string) {
    const supabase = getSupabaseAdmin();
    try {
        const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}