import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySignature, generateResponseSignature } from '@/lib/wayforpay';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
	try {
		const text = await req.text();
		let data;

		try {
			data = JSON.parse(text);
		} catch {
			const params = new URLSearchParams(text);
			data = Object.fromEntries(params);
		}

		const signature = data.merchantSignature;
		if (!signature) {
			return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
		}

		const isValid = verifySignature(data, signature);
		if (!isValid) {
			return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
		}

		const { orderReference, transactionStatus } = data;
		const bookingId = orderReference.includes('_') ? orderReference.split('_')[1] : orderReference;
		const time = Date.now();

		if (transactionStatus === 'Approved') {
			const { error } = await supabase
				.from('bookings')
				.update({ status: 'paid' })
				.eq('id', bookingId);

			if (error) {
				return NextResponse.json({ status: 'error', message: 'DB Update failed' }, { status: 500 });
			}
		}

		const responseSignature = generateResponseSignature(orderReference, 'accept', time);

		return NextResponse.json({
			orderReference,
			status: 'accept',
			time,
			signature: responseSignature
		});

	} catch (error) {
		return NextResponse.json({ status: 'error' }, { status: 500 });
	}
}