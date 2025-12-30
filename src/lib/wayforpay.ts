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

interface CallbackData {
	merchantAccount: string;
	orderReference: string;
	amount: number;
	currency: string;
	authCode: string;
	cardPan: string;
	transactionStatus: string;
	reasonCode: string;
}

export const generateSignature = (data: PaymentData) => {
	// Очищаємо домен від можливого слеша в кінці, щоб уникнути помилок підпису
	const domain = (process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000').replace(/\/$/, "");

	const stringToSign = [
		MERCHANT_ACCOUNT,
		domain,
		data.orderReference,
		data.orderDate,
		String(data.amount), // Явно перетворюємо на рядок
		'UAH',
		...data.productName,
		...data.productCount,
		...data.productPrice.map(String) // Ціни теж у рядки
	].join(';');

	return crypto
		.createHmac('md5', SECRET_KEY)
		.update(stringToSign)
		.digest('hex');
};

export const verifySignature = (data: CallbackData, receivedSignature: string) => {
	const stringToSign = [
		data.merchantAccount,
		data.orderReference,
		data.amount,
		data.currency,
		data.authCode,
		data.cardPan,
		data.transactionStatus,
		data.reasonCode
	].join(';');

	const signature = crypto
		.createHmac('md5', SECRET_KEY)
		.update(stringToSign)
		.digest('hex');

	return signature === receivedSignature;
};

export const generateResponseSignature = (orderReference: string, status: string, time: number) => {
	const stringToSign = [
		orderReference,
		status,
		time
	].join(';');

	return crypto
		.createHmac('md5', SECRET_KEY)
		.update(stringToSign)
		.digest('hex');
};