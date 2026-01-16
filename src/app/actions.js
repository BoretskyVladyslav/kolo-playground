'use server';

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const getSupabaseAdmin = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
};

export async function sendBooking(prevState, formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const date = formData.get('date');
    const time = formData.get('time');
    const guests = formData.get('guests');
    const city = formData.get('city');

    if (!name || !phone || !email) {
        return { success: false, message: 'Заповніть обов\'язкові поля' };
    }

    const price = Number(guests) * 400;

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
                    <p>Чекаємо на вас: м. Київ, вул. Анни Ахматової, 50</p>
                </div>
            `
        });

        await resend.emails.send({
            from: 'Kolo Admin <onboarding@resend.dev>',
            to: ['kolo.playground@gmail.com'], 
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
        console.error('Email Error:', error);
        return { success: false, message: 'Помилка відправки' };
    }
}

export async function sendFranchise(prevState, formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message');

    try {
        await resend.emails.send({
            from: 'Kolo Franchise <onboarding@resend.dev>',
            to: ['kolo.playground@gmail.com'],
            subject: `💼 Франшиза: ${name}`,
            html: `<p>Ім'я: ${name}</p><p>Тел: ${phone}</p><p>${message}</p>`
        });
        return { success: true, message: 'Запит отримано!' };
    } catch (error) {
        return { success: false, message: 'Помилка' };
    }
}

export async function sendContact(prevState, formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message');

    try {
        await resend.emails.send({
            from: 'Kolo Contact <onboarding@resend.dev>',
            to: ['kolo.playground@gmail.com'],
            subject: `💬 Питання: ${name}`,
            html: `<p>Ім'я: ${name}</p><p>Тел: ${phone}</p><p>${message}</p>`
        });
        return { success: true, message: 'Надіслано!' };
    } catch (error) {
        return { success: false, message: 'Помилка' };
    }
}

export async function deleteBooking(id) {
    const supabase = getSupabaseAdmin();
    try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Delete Error:', error);
        return { success: false, message: error.message };
    }
}

export async function updateBookingStatus(id, status) {
    const supabase = getSupabaseAdmin();
    try {
        const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Update Error:', error);
        return { success: false, message: error.message };
    }
}