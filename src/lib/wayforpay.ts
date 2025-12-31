import crypto from 'crypto';

const getKeys = () => {
    const account = process.env.WAYFORPAY_MERCHANT_ACCOUNT?.trim();
    const secret = process.env.WAYFORPAY_SECRET_KEY?.trim();

    if (!account || !secret) {
        throw new Error('WayForPay keys are missing');
    }
    return { account, secret };
};

interface PaymentData {
    orderReference: string;
    orderDate: number;
    amount: number;
    productName: string[];
    productCount: number[];
    productPrice: number[];
    merchantDomainName: string;
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
    const { account, secret } = getKeys();

    const stringToSign = [
        account,
        data.merchantDomainName,
        data.orderReference,
        data.orderDate,
        String(data.amount),
        'UAH',
        ...data.productName,
        ...data.productCount,
        ...data.productPrice.map(String)
    ].join(';');

    console.log('Sign string:', stringToSign);

    return crypto
        .createHmac('md5', secret)
        .update(stringToSign)
        .digest('hex');
};

export const verifySignature = (data: CallbackData, receivedSignature: string) => {
    const { secret } = getKeys();

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
        .createHmac('md5', secret)
        .update(stringToSign)
        .digest('hex');

    return signature === receivedSignature;
};

export const generateResponseSignature = (orderReference: string, status: string, time: number) => {
    const { secret } = getKeys();
    
    const stringToSign = [
        orderReference,
        status,
        time
    ].join(';');

    return crypto
        .createHmac('md5', secret)
        .update(stringToSign)
        .digest('hex');
};