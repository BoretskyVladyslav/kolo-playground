'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Music2 } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import styles from './Header.module.scss';

const navLinks = [
    { name: 'Про нас', href: '#about' },
    { name: 'Кімнати', href: '#rooms' },
    { name: 'Дні народження', href: '#birthdays' },
    { name: 'Франшиза', href: '#franchising' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Контакти', href: '#contacts' },
];

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
            closeMenu();
        }
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles['header--scrolled'] : ''}`}>
            <div className={styles.header__container}>
                <Link href="/" className={styles.header__logo} onClick={closeMenu}>
                    <span className={styles.logoMain}>KOLO</span>
                    <span className={styles.logoSub}>PLAYGROUND</span>
                </Link>

                <nav className={`${styles.header__nav} ${isMenuOpen ? styles['header__nav--active'] : ''}`}>
                    {navLinks.map((link, i) => (
                        <Reveal key={link.name} animation="fade-up" delay={i * 0.1}>
                            <a 
                                href={link.href} 
                                className={styles.header__link} 
                                onClick={(e) => handleScrollTo(e, link.href)}
                            >
                                {link.name}
                            </a>
                        </Reveal>
                    ))}

                    <div className={styles.header__mobileSocials}>
                        <a href="#" className={styles.header__socialIcon}>
                            <Instagram size={28} />
                        </a>
                        <a href="#" className={styles.header__socialIcon}>
                            <Music2 size={28} />
                        </a>
                    </div>
                </nav>

                <div className={styles.header__actions}>
                    <div className={styles.header__socials}>
                        <a href="#" aria-label="Instagram" className={styles.header__socialIcon}>
                            <Instagram size={20} strokeWidth={2.5} />
                        </a>
                        <a href="#" aria-label="TikTok" className={styles.header__socialIcon}>
                            <Music2 size={20} strokeWidth={2.5} />
                        </a>
                    </div>

                    <button 
                        className={`${styles.header__burger} ${isMenuOpen ? styles['header__burger--active'] : ''}`} 
                        onClick={toggleMenu}
                        aria-label="Menu"
                    >
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
        </header>
    );
};