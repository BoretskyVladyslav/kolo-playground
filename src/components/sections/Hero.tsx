'use client';

import { useEffect, useState } from 'react';
import { Reveal } from '../ui/Reveal';
import styles from './Hero.module.scss';

interface Particle {
    id: number;
    style: {
        top: string;
        left: string;
        animationDelay: string;
        animationDuration: string;
    };
}

export const Hero = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const generatedParticles = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            style: {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
            },
        }));
        setParticles(generatedParticles);
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.hero__particles}>
                {particles.map((p) => (
                    <div key={p.id} className={styles.hero__particle} style={p.style} />
                ))}
            </div>

            <div className={styles.hero__content}>
                <div className={styles.hero__logoWrapper}>
                    <Reveal animation="blur" duration={1.2}>
                        <h1 className={styles.hero__title} aria-label="KOLO">
                            <span className={`${styles.hero__letter} ${styles['hero__letter--1']}`} aria-hidden="true">K</span>
                            <span className={`${styles.hero__letter} ${styles['hero__letter--2']}`} aria-hidden="true">O</span>
                            <span className={`${styles.hero__letter} ${styles['hero__letter--3']}`} aria-hidden="true">L</span>
                            <span className={`${styles.hero__letter} ${styles['hero__letter--4']}`} aria-hidden="true">O</span>
                        </h1>
                    </Reveal>
                    
                    <Reveal animation="fade-up" delay={0.3}>
                        <p className={styles.hero__subtitle}>PLAYGROUND</p>
                    </Reveal>
                </div>
            </div>

            <div className={styles.hero__bottom}>
                <Reveal animation="fade-up" delay={0.6}>
                    <div className={styles.hero__action}>
                        <button className={styles.hero__button} type="button">
                            <span className={styles.hero__bracket}>[</span>
                            <span className={styles.hero__btnText} >ВИБРАТИ МІСТО</span>
                            <span className={styles.hero__bracket}>]</span>
                            <div className={styles.hero__glow} />
                        </button>
                    </div>
                </Reveal>

                <Reveal animation="fade-up" delay={0.8}>
                    <div className={styles.hero__slogan}>
                        <p>місце, де звичайний<br />день стає святом</p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};