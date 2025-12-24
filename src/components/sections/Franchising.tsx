'use client';

import { useActionState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { sendFranchise } from '@/app/actions';
import styles from './Franchising.module.scss';

const initialState = {
    success: false,
    message: '',
};

export const Franchising = () => {
    const [state, formAction, isPending] = useActionState(sendFranchise, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success && state.message) {
            alert(state.message);
            formRef.current?.reset();
        } else if (state.message) {
            alert(state.message);
        }
    }, [state]);

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

                        <form action={formAction} ref={formRef} className={styles.franchising__form}>
                            <Reveal animation="fade-up" delay={0.3}>
                                <div className={styles.franchising__field}>
                                    <input 
                                        type="text" 
                                        name="name"
                                        className={styles.franchising__input}
                                        placeholder=" " 
                                        required
                                        autoComplete="name"
                                    />
                                    <label className={styles.franchising__label}>ваше ім'я:</label>
                                </div>
                            </Reveal>
                            
                            <Reveal animation="fade-up" delay={0.4}>
                                <div className={styles.franchising__field}>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        className={styles.franchising__input}
                                        placeholder=" " 
                                        required
                                        autoComplete="tel"
                                    />
                                    <label className={styles.franchising__label}>телефон:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.5}>
                                <div className={styles.franchising__field}>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className={styles.franchising__input}
                                        placeholder=" " 
                                        required
                                        autoComplete="email"
                                    />
                                    <label className={styles.franchising__label}>email:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.6}>
                                <div className={styles.franchising__field}>
                                    <input 
                                        type="text" 
                                        name="message"
                                        className={styles.franchising__input}
                                        placeholder=" " 
                                        autoComplete="off"
                                    />
                                    <label className={styles.franchising__label}>ваше повідомлення:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.7}>
                                <button type="submit" disabled={isPending} className={styles.franchising__submit}>
                                    {isPending ? 'надсилаємо...' : 'надіслати'}
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