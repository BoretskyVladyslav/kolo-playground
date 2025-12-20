'use client';

import { Reveal } from '../ui/Reveal';
import styles from './About.module.scss';

export const About = () => {
    return (
        <section id="about" className={styles.about}>
            <div className={`${styles.about__blur} ${styles['about__blur--green']}`} />
            <div className={`${styles.about__blur} ${styles['about__blur--pink']}`} />
            <div className={`${styles.about__blur} ${styles['about__blur--blue']}`} />

            <div className={styles.about__container}>
                <Reveal animation="fade-up">
                    <h2 className={styles.about__title}>ПРО НАС</h2>
                </Reveal>
                
                <span className={styles.about__index}>[1]</span>

                <div className={styles.about__content}>
                    <div className={styles.about__sidebar}>
                        <Reveal animation="slide-in" delay={0.2}>
                            <h3 className={styles.about__slogan}>
                                ОДНА ЛОКАЦІЯ – БЕЗЛІЧ<br />
                                ЕМОЦІЙ, ДЕСЯТКИ<br />
                                ФОРМАТІВ ВЗАЄМОДІЇ
                            </h3>
                        </Reveal>
                        
                        <Reveal animation="scale" delay={0.4}>
                            <div className={styles.about__starWrapper}>
                                <div className={styles.about__star} />
                            </div>
                        </Reveal>
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
                                <div className={styles.about__image} />
                                <div className={`${styles.about__bracket} ${styles['about__bracket--top']}`} />
                                <div className={`${styles.about__bracket} ${styles['about__bracket--bottom']}`} />
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