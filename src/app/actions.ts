'use server';

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const getSupabaseAdmin = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
};

export async function sendBooking(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const guests = formData.get('guests') as string;
    const city = formData.get('city') as string;

    if (!name || !phone || !email) {
        return { success: false, message: 'Заповніть обов\'язкові поля' };
    }

    const price = Number(guests) * 400;

    // 1. Спроба відправити КЛІЄНТУ (може впасти, якщо домен не верифіковано)
    try {
        await resend.emails.send({
            from: 'Kolo Playground <onboarding@resend.dev>',
            to: [email],
            subject: `🟡 Заявку прийнято! Очікуємо оплати`,
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    <p>Вітаємо, <strong>${name}</strong>!</p>
                    <p>Ми зарезервували час. Для остаточного підтвердження потрібна оплата.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Дата:</strong> ${date}</p>
                        <p><strong>Час:</strong> ${time}</p>
                        <p><strong>Гостей:</strong> ${guests}</p>
                        <p><strong>До сплати:</strong> ${price} грн</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('Не вдалося надіслати лист клієнту (можливо Test Mode):', error);
        // Ми НЕ зупиняємо роботу, а йдемо далі відправляти лист адміну
    }

    // 2. Відправка АДМІНУ (Вам) - Це має спрацювати
    try {
        await resend.emails.send({
            from: 'Kolo Admin <onboarding@resend.dev>',
            to: ['kolo.playground@gmail.com'], // Впевніться, що це пошта власника акаунту Resend
            subject: `🆕 Нове бронювання: ${name}`,
            html: `
                <div>
                    <h2>Нова заявка (Очікує оплати)</h2>
                    <p><strong>Клієнт:</strong> ${name}, ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Місто:</strong> ${city}</p>
                    <p><strong>Дата:</strong> ${date} на ${time}</p>
                    <p><strong>Сума:</strong> ${price} грн</p>
                </div>
            `
        });

        return { success: true, message: 'Заявку створено!' };
    } catch (error) {
        console.error('Помилка відправки адміну:', error);
        return { success: false, message: 'Помилка сервера при відправці' };
    }
}

// ... (інші функції sendFranchise, sendContact, deleteBooking залишаються без змін)
export async function sendFranchise(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    try {
        await resend.emails.send({
            from: 'Kolo Franchise <onboarding@resend.dev>',
            to: ['kolo.playground@gmail.com'],
            subject: `💼 Франшиза: ${name}`,
            html: `<p>Ім'я: ${name}</p><p>Тел: ${phone}</p><p>${message}</p>`
        });
        return { success: true, message: 'Запит отримано!' };
    } catch (error) { return { success: false, message: 'Помилка' }; }
}

export async function sendContact(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    try {
        await resend.emails.send({
            from: 'Kolo Contact <onboarding@resend.dev>',
            to: ['kolo.playground@gmail.com'],
            subject: `💬 Питання: ${name}`,
            html: `<p>Ім'я: ${name}</p><p>Тел: ${phone}</p><p>${message}</p>`
        });
        return { success: true, message: 'Надіслано!' };
    } catch (error) { return { success: false, message: 'Помилка' }; }
}

export async function deleteBooking(id: string) {
    const supabase = getSupabaseAdmin();
    try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; }
}

export async function updateBookingStatus(id: string, status: string) {
    const supabase = getSupabaseAdmin();
    try {
        const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; }
}