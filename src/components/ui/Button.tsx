import Link from 'next/link';
import styles from './Button.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'outline';
    onClick?: () => void;
    type?: 'button' | 'submit';
    href?: string;
    className?: string;
    disabled?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    href,
    className = '',
    disabled = false
}: ButtonProps) => {
    const classNames = `${styles.button} ${styles[variant]} ${className} ${disabled ? styles.disabled : ''}`;

    if (href && !disabled) {
        return (
            <Link href={href} className={classNames}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={classNames}
            disabled={disabled}
        >
            {children}
        </button>
    );
};