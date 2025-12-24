'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Instagram } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { sendContact } from '@/app/actions';
import styles from './Contact.module.scss';

const initialState = {
    success: false,
    message: '',
};

export const Contact = () => {
    const [state, formAction, isPending] = useActionState(sendContact, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success && state.message) {
            alert(state.message);
            formRef.current?.reset();
        } else if (state.message) {
            alert(state.message);
        }
    }, [state]);

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

                        <form action={formAction} ref={formRef} className={styles.contact__form}>
                            <Reveal animation="fade-up" delay={0.3}>
                                <div className={styles.contact__field}>
                                    <input 
                                        type="text" 
                                        name="name"
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
                                        name="phone"
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
                                        type="email" 
                                        name="email"
                                        id="email" 
                                        className={styles.contact__input} 
                                        placeholder=" " 
                                        required 
                                        autoComplete="email"
                                    />
                                    <label htmlFor="email" className={styles.contact__label}>email:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.6}>
                                <div className={styles.contact__field}>
                                    <input 
                                        type="text" 
                                        name="message"
                                        id="request" 
                                        className={styles.contact__input} 
                                        placeholder=" " 
                                        autoComplete="off"
                                    />
                                    <label htmlFor="request" className={styles.contact__label}>ваш запит:</label>
                                </div>
                            </Reveal>

                            <Reveal animation="fade-up" delay={0.7}>
                                <button type="submit" disabled={isPending} className={styles.contact__submit}>
                                    {isPending ? 'надсилаємо...' : 'надіслати'}
                                </button>
                            </Reveal>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};