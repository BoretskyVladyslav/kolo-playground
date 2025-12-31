'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBooking(prevState, formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const date = formData.get('date');
    const time = formData.get('time');
    const guests = formData.get('guests');

    if (!name || !phone || !email) {
        return { success: false, message: 'Заповніть обов\'язкові поля' };
    }

    const price = Number(guests) * 400;

    try {
        await resend.emails.send({
            from: 'Kolo Playground <info@koloplayground.com>',
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
            from: 'Kolo Admin <info@koloplayground.com>',
            to: ['kolo.playground@gmail.com'],
            subject: `🆕 Нове бронювання: ${name}`,
            html: `
                <div>
                    <h2>Нова заявка (Очікує оплати)</h2>
                    <p><strong>Клієнт:</strong> ${name}, ${phone}</p>
                    <p><strong>Дата:</strong> ${date} на ${time}</p>
                    <p><strong>Сума:</strong> ${price} грн</p>
                </div>
            `
        });

        return { success: true, message: 'Заявку створено!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Помилка відправки' };
    }
}

export async function sendFranchise(prevState, formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const message = formData.get('message');

    try {
        await resend.emails.send({
            from: 'Kolo Franchise <info@koloplayground.com>',
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
    const email = formData.get('email');
    const message = formData.get('message');

    try {
        await resend.emails.send({
            from: 'Kolo Contact <info@koloplayground.com>',
            to: ['kolo.playground@gmail.com'],
            subject: `💬 Питання: ${name}`,
            html: `<p>Ім'я: ${name}</p><p>Тел: ${phone}</p><p>${message}</p>`
        });
        return { success: true, message: 'Надіслано!' };
    } catch (error) {
        return { success: false, message: 'Помилка' };
    }
}