'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBooking(prevState, formData) {
	const name = formData.get('name');
	const phone = formData.get('phone');
	const city = formData.get('city');

	if (!name || !phone) {
		return { success: false, message: 'Заповніть обов\'язкові поля' };
	}

	try {
		await resend.emails.send({
			from: 'Kolo Booking <info@koloplayground.com>',
			to: ['kolo.playground@gmail.com'],
			subject: `🔥 Нова заявка: ${name}`,
			html: `
				<div style="font-family: sans-serif; font-size: 16px; color: #333;">
					<h2 style="color: #d4ff00; background: #000; padding: 10px;">Нове бронювання</h2>
					<p><strong>Ім'я:</strong> ${name}</p>
					<p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
					<p><strong>Місто:</strong> ${city}</p>
				</div>
			`
		});
		return { success: true, message: 'Заявку успішно відправлено!' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Помилка відправки' };
	}
}

export async function sendFranchise(prevState, formData) {
	const name = formData.get('name');
	const email = formData.get('email');
	const message = formData.get('message');

	if (!name || !email) {
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
	const message = formData.get('message');

	if (!name || !phone) {
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