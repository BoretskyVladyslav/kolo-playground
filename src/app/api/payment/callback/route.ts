export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifySignature, generateResponseSignature } from '@/lib/wayforpay';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
	try {
		const text = await req.text();
		if (!text) return NextResponse.json({ error: 'Empty body' }, { status: 400 });

		let data;
		try {
			data = JSON.parse(text);
		} catch (e) {
			return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
		}

		const signature = data.merchantSignature;
		const isValid = verifySignature(data, signature);

		if (!isValid) {
			return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
		}

		if (data.transactionStatus === 'Approved') {
			const { error } = await supabaseAdmin
				.from('bookings')
				.update({ status: 'paid' })
				.eq('id', data.orderReference);
			
			if (error) {
				console.error('Supabase Update Error:', error);
			}
		}

		const time = Date.now();
		const responseSignature = generateResponseSignature(data.orderReference, 'accept', time);

		return NextResponse.json({
			orderReference: data.orderReference,
			status: 'accept',
			time,
			signature: responseSignature
		});

	} catch (error) {
		console.error('Callback Error:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}