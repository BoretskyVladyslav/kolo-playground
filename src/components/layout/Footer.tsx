'use client';

import Link from 'next/link';
import { Reveal } from '../ui/Reveal';
import styles from './Footer.module.scss';

const TikTokIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="currentColor"/>
    </svg>
);

const InstagramIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

export const Footer = () => {
    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footer__bgGlow} />

            <div className={styles.footer__container}>
                <div className={styles.footer__top}>
                    <div className={styles.footer__col}>
                        <Reveal animation="fade-up">
                            <div className={styles.footer__logo}>
                                <span className={styles.footer__logoMain}>KOLO</span>
                                <span className={styles.footer__logoSub}>PLAYGROUND</span>
                            </div>
                        </Reveal>
                        
                        <Reveal animation="fade-up" delay={0.1}>
                            <div className={styles.footer__block}>
                                <span className={styles.footer__label}>графік роботи</span>
                                <p>щодня</p>
                                <p>11:00 – 22:00</p>
                            </div>
                        </Reveal>
                    </div>

                    <div className={styles.footer__col}>
                        <Reveal animation="fade-up" delay={0.2}>
                            <div className={styles.footer__contacts}>
                                <div className={styles.footer__block}>
                                    <span className={styles.footer__label}>адреса</span>
                                    <a 
                                        href="https://maps.google.com/?q=вул. Анни Ахматової, 50, Київ, 02081" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.footer__addressLink}
                                    >
                                        вул. Анни Ахматової, 50,<br/>Київ, 02081
                                    </a>
                                </div>
                                
                                <div className={styles.footer__contactLinks}>
                                    <a href="tel:+380665215706" className={styles.footer__link}>
                                        +38 (066) 521 57 06
                                    </a>
                                    <a href="mailto:kolo.playground@gmail.com" className={styles.footer__link}>
                                        kolo.playground@gmail.com
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    <div className={`${styles.footer__col} ${styles['footer__col--end']}`}>
                        <Reveal animation="fade-up" delay={0.3}>
                            <nav className={styles.footer__nav}>
                                <a href="#about" className={styles.footer__navLink} onClick={(e) => handleScrollTo(e, '#about')}>про нас</a>
                                <a href="#booking" className={styles.footer__navLink} onClick={(e) => handleScrollTo(e, '#booking')}>запис онлайн</a>
                                <a href="#rooms" className={styles.footer__navLink} onClick={(e) => handleScrollTo(e, '#rooms')}>про кімнати</a>
                                <a href="#faq" className={styles.footer__navLink} onClick={(e) => handleScrollTo(e, '#faq')}>питання та відповіді</a>
                            </nav>
                        </Reveal>
                    </div>
                </div>

                <div className={styles.footer__divider} />

                <div className={styles.footer__bottom}>
                    <div className={styles.footer__col}>
                        <Reveal animation="fade-up" delay={0.4}>
                            <p className={styles.footer__copyright}>
                                © 2025 KOLO Playground.<br/>
                                <span className={styles.footer__designer}>design by irinakrecko</span>
                            </p>
                        </Reveal>
                    </div>

                    <div className={styles.footer__col}>
                        <Reveal animation="scale" delay={0.5}>
                            <div className={styles.footer__socials}>
                                <a href="https://www.tiktok.com/@kolo_playground?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className={styles.footer__socialBtn} aria-label="TikTok">
                                    <TikTokIcon />
                                </a>
                                <a href="https://www.instagram.com/kolo_playground?igsh=amlyeDhseTV2YnVx" target="_blank" rel="noopener noreferrer" className={styles.footer__socialBtn} aria-label="Instagram">
                                    <InstagramIcon />
                                </a>
                            </div>
                        </Reveal>
                    </div>

                    <div className={`${styles.footer__col} ${styles['footer__col--end']}`}>
                        <Reveal animation="fade-up" delay={0.6}>
                            <div className={styles.footer__legal}>
                                <Link href="/privacy">політика конфіденційності</Link>
                                <Link href="/oferta">публічна оферта</Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </footer>
    );
};