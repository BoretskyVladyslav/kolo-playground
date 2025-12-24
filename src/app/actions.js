'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// --- 1. БРОНЮВАННЯ (2 листи: Клієнту + Адміну) ---
export async function sendBooking(prevState, formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const city = formData.get('city');
    const date = formData.get('date');
    const time = formData.get('time');
    const guests = formData.get('guests');

    if (!name || !phone || !email) {
        return { success: false, message: 'Заповніть обов\'язкові поля' };
    }

    try {
        // 1. ЛИСТ КЛІЄНТУ
        await resend.emails.send({
            from: 'Kolo Playground <info@koloplayground.com>',
            to: [email],
            subject: `✅ Ваше бронювання підтверджено!`,
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
                    <p>Шановний(а) <strong>${name}</strong>,</p>
                    <p>Ваше бронювання підтверджено!</p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #555;">Деталі:</h3>
                        <p style="margin: 5px 0;"><strong>Дата:</strong> ${date}</p>
                        <p style="margin: 5px 0;"><strong>Час:</strong> ${time}</p>
                        <p style="margin: 5px 0;"><strong>Кількість людей:</strong> ${guests}</p>
                        <p style="margin: 5px 0;"><strong>Телефон:</strong> <a href="tel:${phone}" style="color: #333; text-decoration: none;">${phone}</a></p>
                    </div>
                    <p>Дякуємо за Ваше бронювання!</p>
                    <br/>
                    <p style="color: #888; font-size: 14px;">
                        З найкращими побажаннями,<br/>
                        <strong>Команда Kolo Playground</strong>
                    </p>
                </div>
            `
        });

        // 2. ЛИСТ АДМІНУ (ВАМ)
        await resend.emails.send({
            from: 'Kolo Admin <info@koloplayground.com>',
            to: ['kolo.playground@gmail.com'],
            subject: `🔥 Нова заявка: ${name} (${date})`,
            html: `
                <div style="font-family: sans-serif; font-size: 16px; color: #333;">
                    <h2 style="color: #d4ff00; background: #000; padding: 10px;">Нове бронювання</h2>
                    <p><strong>Ім'я:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Місто:</strong> ${city}</p>
                    <hr>
                    <p><strong>Дата:</strong> ${date}</p>
                    <p><strong>Час:</strong> ${time}</p>
                    <p><strong>Людей:</strong> ${guests}</p>
                </div>
            `
        });

        return { success: true, message: 'Заявку успішно відправлено!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Помилка відправки' };
    }
}

// --- 2. ФРАНШИЗА (Тільки Адміну) ---
export async function sendFranchise(prevState, formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !phone) {
        return { success: false, message: 'Заповніть обов\'язкові поля' };
    }

    try {
        await resend.emails.send({
            from: 'Kolo Franchise <info@koloplayground.com>',
            to: ['kolo.playground@gmail.com'],
            subject: `💼 Франшиза: ${name}`,
            html: `
                <div style="font-family: sans-serif; font-size: 16px; color: #333;">
                    <h2 style="background: #000080; color: #fff; padding: 10px;">Запит на Франшизу</h2>
                    <p><strong>Ім'я:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Повідомлення:</strong> ${message}</p>
                </div>
            `
        });
        return { success: true, message: 'Ваш запит отримано! Ми зв\'яжемося з вами.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Помилка відправки' };
    }
}

// --- 3. КОНТАКТИ (Тільки Адміну) ---
export async function sendContact(prevState, formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !phone || !email) {
        return { success: false, message: 'Заповніть обов\'язкові поля' };
    }

    try {
        await resend.emails.send({
            from: 'Kolo Contact <info@koloplayground.com>',
            to: ['kolo.playground@gmail.com'],
            subject: `💬 Питання з сайту: ${name}`,
            html: `
                <div style="font-family: sans-serif; font-size: 16px; color: #333;">
                    <h2 style="border-bottom: 2px solid #ccc;">Нове повідомлення</h2>
                    <p><strong>Ім'я:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Запит:</strong> ${message}</p>
                </div>
            `
        });
        return { success: true, message: 'Повідомлення надіслано!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Помилка відправки' };
    }
}