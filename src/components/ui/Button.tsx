import styles from './Button.module.scss';

interface ButtonProps {
	children: React.ReactNode;
	variant?: 'primary' | 'outline';
	onClick?: () => void;
	type?: 'button' | 'submit';
	className?: string;
}

export const Button = ({ 
	children, 
	variant = 'primary', 
	onClick, 
	type = 'button',
	className = '' 
}: ButtonProps) => {
	return (
		<button 
			type={type}
			onClick={onClick}
			className={`${styles.button} ${styles[variant]} ${className}`}
		>
			{children}
		</button>
	);
};