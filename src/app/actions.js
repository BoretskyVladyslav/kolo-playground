'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // const price = Number(guests) * 400;
    const price = 10;
    try {
        await resend.emails.send({
            from: 'Kolo Playground <info@koloplayground.com>',
            to: [email],
            subject: `🟡 Заявку прийнято! Очікуємо підтвердження оплати`,
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
                    <p>Вітаємо, <strong>${name}</strong>!</p>
                    <p>Ми зарезервували час для вашої компанії.</p>
                    
                    <div style="background: #fffbe6; border: 1px solid #ffe58f; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #faad14;">⚠️ Статус: Очікує оплати</h3>
                        <p style="margin: 5px 0;">Щоб гарантувати бронювання, будь ласка, завершіть оплату на сайті або зв'яжіться з нами.</p>
                    </div>

                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #555;">Деталі запису:</h3>
                        <p style="margin: 5px 0;"><strong>Дата:</strong> ${date}</p>
                        <p style="margin: 5px 0;"><strong>Час:</strong> ${time}</p>
                        <p style="margin: 5px 0;"><strong>Гостей:</strong> ${guests}</p>
                        <p style="margin: 5px 0;"><strong>До сплати:</strong> ${price} грн</p>
                    </div>

                    <p style="font-size: 14px; color: #666;">
                        *Якщо ви вже оплатили, ігноруйте це нагадування. Ми надішлемо підтвердження найближчим часом.
                    </p>
                    <br/>
                    <p>Чекаємо на вас за адресою: <strong>м. Київ, вул. Анни Ахматової, 50</strong></p>
                </div>
            `
        });

        await resend.emails.send({
            from: 'Kolo Admin <info@koloplayground.com>',
            to: ['kolo.playground@gmail.com'],
            subject: `🆕 Нове бронювання: ${name} (Очікує)`,
            html: `
                <div style="font-family: sans-serif; font-size: 16px; color: #333;">
                    <h2 style="background: #eee; padding: 10px; border-left: 5px solid #d4ff00;">Нова заявка (Pending)</h2>
                    <p><strong>Ім'я:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr>
                    <p><strong>Дата:</strong> ${date}</p>
                    <p><strong>Час:</strong> ${time}</p>
                    <p><strong>Людей:</strong> ${guests}</p>
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