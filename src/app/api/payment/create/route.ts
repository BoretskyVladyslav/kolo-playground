import { NextResponse } from 'next/server';
import { generateSignature } from '@/lib/wayforpay';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		
		// 👇 (1) Ми приймаємо ціну від фронтенду, але ігноруємо її
		const { amount: originalAmount, productName, orderReference } = body;

		// 👇 (2) ТИМЧАСОВО: Жорстко ставимо 1 грн для тесту
		const amount = 1; 

		const orderDate = Date.now();
		const ref = orderReference || `ORDER_${orderDate}`;
		
		const rawDomain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
		const cleanDomain = rawDomain.replace(/\/$/, "");

		const data = {
			orderReference: ref,
			orderDate,
			amount, // Тут піде 1
			currency: 'UAH',
			productName: [productName],
			productCount: [1],
			productPrice: [amount], // Тут теж 1
			merchantDomainName: cleanDomain,
			serviceUrl: `${cleanDomain}/api/payment/callback`,
		};

		const signature = generateSignature({
			orderReference: ref,
			orderDate,
			amount, // Підписуємо 1 грн
			productName: data.productName,
			productCount: data.productCount,
			productPrice: data.productPrice,
			merchantDomainName: cleanDomain
		});

		return NextResponse.json({
			...data,
			merchantAccount: process.env.WAYFORPAY_MERCHANT_ACCOUNT,
			merchantDomainName: cleanDomain,
			signature
		});

	} catch (error) {
		console.error('Payment Create Error:', error);
		return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
	}
}