'use client';

import { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import styles from './Reveal.module.scss';

type Animation = 'fade-up' | 'slide-in' | 'scale' | 'blur';

interface RevealProps {
    children: ReactNode;
    animation?: Animation;
    delay?: number; // затримка в секундах (0.1, 0.2...)
    duration?: number;
    className?: string;
}

export const Reveal = ({ 
    children, 
    animation = 'fade-up', 
    delay = 0, 
    duration = 0.6,
    className = '' 
}: RevealProps) => {
    const [ref, isInView] = useInView(0.1);

    return (
        <div 
            ref={ref} 
            className={`${styles.reveal} ${styles[`reveal--${animation}`]} ${isInView ? styles['reveal--visible'] : ''} ${className}`}
            style={{ transitionDuration: `${duration}s`, transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
};