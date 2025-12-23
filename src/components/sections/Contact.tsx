'use client';

import { Instagram } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import styles from './Contact.module.scss';

export const Contact = () => {
    return (
        <section id="contacts" className={styles.contact}>
            <div className={styles.contact__glow} />

            <div className={styles.contact__container}>

                <div className={styles.contact__grid}>
                    <div className={styles.contact__sidebar}>
                        <Reveal animation="fade-up">
                            <h2 className={styles.contact__title}>
                                У KOLO МОЖНА СВЯТКУВАТИ НЕ ЛИШЕ<br />
                                ДНІ НАРОДЖЕННЯ, А Й СІМЕЙНІ СВЯТА,<br />
                                ВИПУСКНІ ТА ТЕМАТИЧНІ ВЕЧІРКИ
                            </h2>
                        </Reveal>
                        
                        <Reveal animation="scale" delay={0.2}>
                            <a 
                                href="https://www.instagram.com/kolo_playground?igsh=amlyeDhseTV2YnVx" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.contact__socialBtn} 
                                aria-label="Instagram"
                            >
                                <Instagram size={32} strokeWidth={2} />
                            </a>
                        </Reveal>
                    </div>

                    <div className={styles.contact__content}>
                        <Reveal animation="fade-up" delay={0.2}>
                            <p className={styles.contact__subtitle}>
                                Пишіть у Instagram або бронюйте зараз –<br />
                                адміністрація вам перетелефонує.
                            </p>
                        </Reveal>

                        <form className={styles.contact__form} onSubmit={(e) => e.preventDefault()}>
                            <Reveal animation="fade-up" delay={0.3}>
                                <div className={styles.contact__field}>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        className={styles.contact__input} 
                                        placeholder=" " 
                                        required 
                                        autoComplete="name"
                                    />
                                    <label htmlFor="name" className={styles.contact__label}>ваше ім'я:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.4}>
                                <div className={styles.contact__field}>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        className={styles.contact__input} 
                                        placeholder=" " 
                                        required 
                                        autoComplete="tel"
                                    />
                                    <label htmlFor="phone" className={styles.contact__label}>номер телефону:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.5}>
                                <div className={styles.contact__field}>
                                    <input 
                                        type="text" 
                                        id="request" 
                                        className={styles.contact__input} 
                                        placeholder=" " 
                                        autoComplete="off"
                                    />
                                    <label htmlFor="request" className={styles.contact__label}>ваш запит:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.6}>
                                <button type="submit" className={styles.contact__submit}>
                                    надіслати
                                </button>
                            </Reveal>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};