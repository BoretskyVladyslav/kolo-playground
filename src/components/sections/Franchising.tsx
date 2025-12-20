'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import styles from './Franchising.module.scss';

export const Franchising = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Franchise Request:', formData);
        alert("Дякуємо! Ми зв'яжемося з вами.");
    };

    const steps = [
        "залишаєте заявку",
        "обговорюємо формат і місто",
        "підписуємо договір",
        "відкриваємо ваш kolo playground"
    ];

    return (
        <section id="franchising" className={styles.franchising}>
            <div className={styles.franchising__container}>
                <div className={styles.franchising__header}>
                    <Reveal animation="fade-up">
                        <h2 className={styles.franchising__title}>ФРАНЧАЙЗИНГ</h2>
                    </Reveal>
                    <span className={styles.franchising__index}>[7]</span>
                </div>

                <div className={styles.franchising__content}>
                    <div className={styles.franchising__sidebar}>
                        <Reveal animation="slide-in">
                            <h3 className={styles.franchising__cta}>
                                СТВОРИ СВІЙ ІНТЕРАКТИВНИЙ ПРОСТІР <br />
                                РАЗОМ ІЗ НАМИ!
                            </h3>
                        </Reveal>
                    </div>

                    <div className={styles.franchising__main}>
                        <Reveal animation="fade-up" delay={0.2}>
                            <p className={styles.franchising__description}>
                                Відкрий KOLO Playground – інтерактивний простір із швидкою окупністю. 
                                Ви отримаєте готову бізнес-модель: дизайн, технічне оснащення, 
                                навчання персоналу, маркетинг та постійне оновлення ігор.
                            </p>
                        </Reveal>

                        <form onSubmit={handleSubmit} className={styles.franchising__form}>
                            <Reveal animation="fade-up" delay={0.3}>
                                <div className={styles.franchising__field}>
                                    <input 
                                        type="text" 
                                        className={styles.franchising__input}
                                        placeholder=" " 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                    <label className={styles.franchising__label}>ваше ім'я:</label>
                                </div>
                            </Reveal>
                            
                            <Reveal animation="fade-up" delay={0.4}>
                                <div className={styles.franchising__field}>
                                    <input 
                                        type="email" 
                                        className={styles.franchising__input}
                                        placeholder=" " 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                    <label className={styles.franchising__label}>email:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.5}>
                                <div className={styles.franchising__field}>
                                    <input 
                                        type="text" 
                                        className={styles.franchising__input}
                                        placeholder=" " 
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    />
                                    <label className={styles.franchising__label}>ваш запит:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.6}>
                                <button type="submit" className={styles.franchising__submit}>
                                    надіслати
                                </button>
                            </Reveal>
                        </form>
                    </div>
                </div>

                <div className={styles.franchising__steps}>
                    {steps.map((step, index) => (
                        <Reveal key={index} animation="fade-up" delay={0.7 + index * 0.1}>
                            <div className={styles.franchising__stepItem}>
                                <span className={styles.franchising__stepText}>{step}</span>
                                {index !== steps.length - 1 && (
                                    <ArrowRight size={16} className={styles.franchising__arrow} />
                                )}
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};