import crypto from 'crypto';

const MERCHANT_ACCOUNT = process.env.WAYFORPAY_MERCHANT_ACCOUNT!;
const SECRET_KEY = process.env.WAYFORPAY_SECRET_KEY!;

interface PaymentData {
	orderReference: string;
	orderDate: number;
	amount: number;
	productName: string[];
	productCount: number[];
	productPrice: number[];
}

export const generateSignature = (data: PaymentData) => {
	const stringToSign = [
		MERCHANT_ACCOUNT,
		process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000',
		data.orderReference,
		data.orderDate,
		data.amount,
		'UAH',
		...data.productName,
		...data.productCount,
		...data.productPrice
	].join(';');

	const signature = crypto
		.createHmac('md5', SECRET_KEY)
		.update(stringToSign)
		.digest('hex');

	return signature;
};