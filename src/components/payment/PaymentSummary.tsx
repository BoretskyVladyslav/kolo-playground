import { Check, ShieldCheck, ArrowLeft } from 'lucide-react';
import { PaymentButton } from "./PaymentButton";
import styles from './PaymentSummary.module.scss';

interface BookingDetails {
	date: string;
	time: string;
	guests: number;
	price: number;
}

interface PaymentSummaryProps {
	details: BookingDetails;
	onPay: () => void;
	onBack: () => void;
	isLoading: boolean;
}

export const PaymentSummary = ({ details, onPay, onBack, isLoading }: PaymentSummaryProps) => {
	return (
		<div id="payment-summary" className={styles.container}>
			<div className={styles.header}>
				<div className={styles.iconWrapper}>
					<Check size={32} strokeWidth={3} />
				</div>
				<h3>Бронювання створено!</h3>
				<p>Залишився останній крок — оплата</p>
			</div>

			<div className={styles.details}>
				<div className={styles.row}>
					<span>Дата:</span>
					<span>{details.date}</span>
				</div>
				<div className={styles.row}>
					<span>Час:</span>
					<span>{details.time}</span>
				</div>
				<div className={styles.row}>
					<span>Гостей:</span>
					<span>{details.guests} чол.</span>
				</div>
				
				<div className={styles.divider} />
				
				<div className={styles.total}>
					<span>До сплати:</span>
					<span className={styles.price}>{details.price} грн</span>
				</div>
			</div>

			<div className={styles.actions}>
				<PaymentButton 
					amount={details.price} 
					onClick={onPay} 
					isLoading={isLoading} 
				/>
				
				<button onClick={onBack} className={styles.backBtn} disabled={isLoading}>
					<span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
						<ArrowLeft size={16} />
						Повернутися до даних
					</span>
				</button>
			</div>
			
			<div className={styles.secureText}>
				<ShieldCheck size={14} />
				Безпечна оплата через WayForPay
			</div>
		</div>
	);
};