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
	merchantDomainName: string; // <--- Додали це поле
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
	const stringToSign = [
		MERCHANT_ACCOUNT,
		data.merchantDomainName, // Використовуємо те, що передали
		data.orderReference,
		data.orderDate,
		String(data.amount),
		'UAH',
		...data.productName,
		...data.productCount,
		...data.productPrice.map(String)
	].join(';');

	// 👇 ЦЕЙ LOG КРИТИЧНО ВАЖЛИВИЙ ДЛЯ ДЕБАГУ
	console.log('STRING TO SIGN:', stringToSign); 

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