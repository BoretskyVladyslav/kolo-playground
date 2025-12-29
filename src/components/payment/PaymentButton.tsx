"use client";

import styles from './PaymentButton.module.scss';
import { CreditCard } from 'lucide-react';

interface PaymentButtonProps {
	amount: number;
	isLoading?: boolean;
	onClick: () => void;
}

export const PaymentButton = ({ amount, isLoading, onClick }: PaymentButtonProps) => {
	return (
		<button
			onClick={onClick}
			disabled={isLoading}
			className={styles.button}
		>
			<div className={styles.content}>
				{isLoading ? (
					<>
						<div className={styles.spinner} />
						<span>Обробка...</span>
					</>
				) : (
					<>
						<CreditCard size={20} />
						<span>Оплатити {amount} грн</span>
					</>
				)}
			</div>
		</button>
	);
};