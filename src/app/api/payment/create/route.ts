import { NextResponse } from 'next/server';
import { generateSignature } from '@/lib/wayforpay';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // 👇 Ігноруємо ціну з фронтенду, беремо тільки назву і ID
        const { productName, orderReference } = body;

        // 🔥 ЖОРСТКО СТАВИМО 1 ГРН ДЛЯ ТЕСТУ
        const amount = 1;

        const orderDate = Date.now();
        const ref = orderReference || `ORDER_${orderDate}`;
        const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

        const data = {
            orderReference: ref,
            orderDate,
            amount, // Тут буде 1
            currency: 'UAH',
            productName: [productName],
            productCount: [1],
            productPrice: [amount], // Тут теж 1
            serviceUrl: `${baseUrl}/api/payment/callback`,
        };

        const signature = generateSignature({
            orderReference: ref,
            orderDate,
            amount,
            productName: data.productName,
            productCount: data.productCount,
            productPrice: data.productPrice
        });

        return NextResponse.json({
            ...data,
            merchantAccount: process.env.WAYFORPAY_MERCHANT_ACCOUNT,
            merchantDomainName: process.env.NEXT_PUBLIC_DOMAIN,
            signature
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }
}