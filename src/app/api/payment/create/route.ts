export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { generateSignature } from '@/lib/wayforpay';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { amount, productName, orderReference } = body;

		const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT?.trim();
		if (!merchantAccount) throw new Error('Merchant Account is missing');

		const cleanDomain = 'https://www.koloplayground.com';
		
		const orderDate = Date.now();
		const ref = orderReference || `ORDER_${orderDate}`;

		const data = {
			orderReference: ref,
			orderDate,
			amount: Number(amount),
			currency: 'UAH',
			productName: [productName],
			productCount: [1],
			productPrice: [Number(amount)],
			merchantDomainName: cleanDomain,
			// 👇 КУДИ СТУКАЄ РОБОТ (щоб оновити базу)
			serviceUrl: `${cleanDomain}/api/payment/callback`,
			// 👇 КУДИ ЙДЕ ЛЮДИНА (щоб побачити "Дякую")
			returnUrl: `${cleanDomain}/?payment=success`,
		};

		const signature = generateSignature({
			orderReference: ref,
			orderDate,
			amount: Number(amount),
			productName: data.productName,
			productCount: data.productCount,
			productPrice: data.productPrice,
			merchantDomainName: cleanDomain
		});

		return NextResponse.json({
			...data,
			merchantAccount,
			merchantDomainName: cleanDomain,
			signature
		});

	} catch (error) {
		console.error('Payment Create Error:', error);
		return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }
}