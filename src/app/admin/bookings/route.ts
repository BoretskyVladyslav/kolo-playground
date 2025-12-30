import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_PASS = 'Koloahmatovoy50';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { action, id, password } = body;

		if (password !== ADMIN_PASS) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (action === 'delete') {
			const { error } = await supabaseAdmin.from('bookings').delete().eq('id', id);
			if (error) throw error;
			return NextResponse.json({ success: true });
		}

		if (action === 'confirm') {
			const { error } = await supabaseAdmin
				.from('bookings')
				.update({ status: 'paid' })
				.eq('id', id);
			
			if (error) throw error;
			return NextResponse.json({ success: true });
		}

		return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

	} catch (error) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}