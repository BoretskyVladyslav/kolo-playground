'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Reveal } from '../ui/Reveal';
import styles from './About.module.scss';

const aboutImages = [
    '/images/about__changing-img1.jpg',
    '/images/about__changing-img2.jpg',
    '/images/about__changing-img3.jpg',
    '/images/about__changing-img4.jpg',
    '/images/about__changing-img5.jpg',
    '/images/about__changing-img6.jpg',
    '/images/about__changing-img7.jpg',
    '/images/about__changing-img8.jpg',
];

export const About = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === aboutImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section id="about" className={styles.about}>
            <div className={`${styles.about__blur} ${styles['about__blur--green']}`} />
            <div className={`${styles.about__blur} ${styles['about__blur--pink']}`} />
            <div className={`${styles.about__blur} ${styles['about__blur--blue']}`} />

            <div className={styles.about__container}>
                <Reveal animation="fade-up">
                    <h2 className={styles.about__title}>ПРО НАС</h2>
                </Reveal>

                <div className={styles.about__content}>
                    <div className={styles.about__sidebar}>
                        <Reveal animation="slide-in" delay={0.2}>
                            <h3 className={styles.about__slogan}>
                                ОДНА ЛОКАЦІЯ – БЕЗЛІЧ<br />
                                ЕМОЦІЙ, ДЕСЯТКИ<br />
                                ФОРМАТІВ ВЗАЄМОДІЇ
                            </h3>
                        </Reveal>
                        
                        <div className={styles.about__starWrapper}>
                             <Reveal animation="scale" delay={0.4}>
                                <Image 
                                    src="/icons/star.png" 
                                    alt="Star Decoration" 
                                    width={140} 
                                    height={140} 
                                    className={styles.about__star}
                                    priority
                                />
                            </Reveal>
                        </div>
                    </div>

                    <div className={styles.about__main}>
                        <Reveal animation="fade-up" delay={0.3}>
                            <p className={styles.about__lead}>
                                KOLO PLAYGROUND – інтерактивний ігровий простір, 
                                де гра об’єднує покоління. Ми поєднали новітні 
                                технології зі спільними активностями, створивши 
                                середовище, яке залучає дітей та дорослих інтуїтивно 
                                і з захопленням.
                            </p>
                        </Reveal>

                        <Reveal animation="blur" delay={0.4} duration={0.8}>
                            <div className={styles.about__visual}>
                                {aboutImages.map((src, index) => (
                                    <div 
                                        key={src}
                                        className={`${styles.about__imageWrapper} ${
                                            index === currentImageIndex ? styles.active : ''
                                        }`}
                                    >
                                        <Image
                                            src={src}
                                            alt="Kolo Playground Atmosphere"
                                            fill
                                            className={styles.about__image}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority={index === 0}
                                        />
                                    </div>
                                ))}
                                
                                <div className={`${styles.about__bracket} ${styles['about__bracket--top']}`} aria-hidden="true" />
                                <div className={`${styles.about__bracket} ${styles['about__bracket--bottom']}`} aria-hidden="true" />
                            </div>
                        </Reveal>

                        <Reveal animation="fade-up" delay={0.5}>
                            <div className={styles.about__footer}>
                                <p className={styles.about__description}>
                                    У KOLO немає вікових бар’єрів: тут однаково цікаво й дітям, 
                                    і дорослим. Наш простір створений для компаній друзів, родин, 
                                    шкільних груп і всіх, хто шукає живий, активний відпочинок.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};