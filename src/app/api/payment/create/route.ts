import { NextResponse } from 'next/server';
import { generateSignature } from '@/lib/wayforpay';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // 👇 1. Тут ми дістаємо дані, але 'amount' (ціну) поки ігноруємо
        const { productName, orderReference } = body; 

        // 🔥 2. ЖОРСТКА ПІДМІНА ЦІНИ ДЛЯ ТЕСТУ
        // Замість реальної ціни ставимо 1 гривню
        const amount = 1; 

        const orderDate = Date.now();
        const ref = orderReference || `ORDER_${orderDate}`;
        const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

        // Далі все як було, але воно вже використовує нашу змінну amount = 1
        const data = {
            orderReference: ref,
            orderDate,
            amount, // Тут буде 1
            currency: 'UAH',
            productName: [productName],
            productCount: [1],
            productPrice: [amount], // Тут теж буде 1
            serviceUrl: `${baseUrl}/api/payment/callback`,
        };

        const signature = generateSignature({
            orderReference: ref,
            orderDate,
            amount, // І в підпис піде 1
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