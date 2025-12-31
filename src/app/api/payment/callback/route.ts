export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifySignature, generateResponseSignature } from '@/lib/wayforpay';
import { createClient } from '@supabase/supabase-js';

const getAdminClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
        console.error("CRITICAL: Missing Supabase Admin Keys");
        return null;
    }
    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
};

export async function GET() {
    const admin = getAdminClient();
    return NextResponse.json({ 
        status: admin ? 'ALIVE' : 'ERROR', 
        message: admin ? 'System ready' : 'Keys missing' 
    });
}

export async function POST(req: Request) {
    try {
        const text = await req.text();
        if (!text) return NextResponse.json({ error: 'Empty body' }, { status: 400 });

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error");
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
        }

        console.log(`Callback: Order ${data.orderReference}, Status ${data.transactionStatus}`);

        const signature = data.merchantSignature;
        const isValid = verifySignature(data, signature);

        if (!isValid) {
            console.error("Invalid Signature");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        if (data.transactionStatus === 'Approved') {
            const supabaseAdmin = getAdminClient();
            
            if (supabaseAdmin) {
                const { error } = await supabaseAdmin
                    .from('bookings')
                    .update({ status: 'paid' })
                    .eq('id', data.orderReference);
                
                if (error) console.error('DB Update Error:', error);
                else console.log('DB Updated: PAID');
            } else {
                console.error('DB Update Skipped: No Admin Client');
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
        console.error('Callback Fatal Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}