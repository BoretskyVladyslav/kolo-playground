'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import styles from './FAQ.module.scss';

const faqData = [
    {
        question: "ЩО TAKE KOLO PLAYGROUND",
        answer: `KOLO Playground — це сучасний ігровий простір, де розваги виходять за рамки звичних батутних парків чи квест-кімнат. Ми створили унікальне місце, де технології та ігри об'єднують дітей і дорослих у спільному захоплюючому досвіді.

• 5 інтерактивних кімнат із десятками різноманітних ігор
• Також маємо зону AI та різні інтерактивні активності
• Окрема кімната для святкувань (доступна за попереднім бронюванням)
• Можливість грати всією родиною або великою компанією`
    },
    {
        question: "СКІЛЬКИ ЛЮДЕЙ МОЖЕ ГРАТИ ГРУ ОДНОЧАСНО",
        answer: "У нас є ігри, розраховані на різну кількість учасників, від 1 до 10. Хочете прийти більшою компанією?\nНемає проблем! Ви можете грати по черзі, ігрових зон вистачить на всіх, а між іграми – відпочити в нашій затишній вітальні з безалкогольними напоями та кавою."
    },
    {
        question: "ЩО ВХОДИТЬ У ВАРТІСТЬ КВИТКА",
        answer: "Усі 5 зон, повний маршрут без доплат."
    },
    {
        question: "СКІЛЬКИ ТРИВАЄ ІГРОВА СЕСІЯ",
        answer: "Ігрова сесія триває 2 години."
    },
    {
        question: "ЧИ ПОТРІБНО БРОНЮВАТИ ГРУ ЗАЗДАЛЕГІДЬ, ЧИ МОЖНА ПРИЙТИ БЕЗ ЗАПИСУ?",
        answer: "Щоб ваша компанія гарантовано отримала доступ в ігровий простір у потрібний час – радимо забронювати візит заздалегідь.\nЯкщо ж ви зайдете без бронювання і в закладі будуть місця для вас – можна одразу почати гру."
    },
    {
        question: "ЯК СКАСУВАТИ БРОНЮВАННЯ?",
        answer: "Якщо ваші плани змінились, повідомте нас про скасування не пізніше ніж за 24 години до візиту — у такому разі ви отримаєте 100% відшкодування."
    },
    {
        question: "ЦЕ КІМНАТА ДЛЯ ДІТЕЙ?",
        answer: "KOLO Playground — це інтерактивний простір для всієї родини. Ми раді вітати гостей будь-якого віку: від маленьких дітей до дорослих.\nІгри підійдуть дітям від 5 років, а дорослі теж залишаться у захваті від активного та веселого відпочинку."
    },
    {
        question: "У ВАС Є БАР?",
        answer: "Так! У нашому просторі є вода, солодкі напої, безалкогольні коктейлі та кава."
    },
    {
        question: "ЧИ МОЖНА ПРОВЕСТИ У ВАС СВЯТКУВАННЯ ДНЯ НАРОДЖЕННЯ?",
        answer: "Звичайно! Ви можете забронювати кімнату для святкування через наш сайт, Instagram або зателефонувати – ми допоможемо спланувати незабутню вечірку для дітей чи дорослих у KOLO Playground."
    },
    {
        question: "ЧИ МОЖНА ОРГАНІЗУВАТИ У ВАС ШКІЛЬНУ ЕКСКУРСІЮ АБО ЛІТНІЙ ТАБІР?",
        answer: "Обов’язково! Заплануйте груповий візит до KOLO Playground, 2 години захопливих інтерактивних ігор в ігровій кімнаті подарують дітям та підліткам незабутні емоції та активний відпочинок."
    },
    {
        question: "ЯКЕ ПОТРІБНЕ ВЗУТТЯ ТА ОДЯГ ПРИ ВІДВІДУВАННІ ЗАКЛАДУ?",
        answer: "Підійде будь-яке зручне змінне взуття та зручний одяг."
    }
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className={styles.faq}>
            <div className={styles.faq__container}>
                <div className={styles.faq__header}>
                    <Reveal animation="fade-up">
                        <h2 className={styles.faq__title}>FAQ</h2>
                    </Reveal>
                </div>

                <div className={styles.faq__list}>
                    {faqData.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <Reveal key={index} animation="fade-up" delay={index * 0.05}>
                                <div 
                                    className={`${styles.faq__item} ${isOpen ? styles['faq__item--open'] : ''}`}
                                    onClick={() => toggleItem(index)}
                                >
                                    <div className={styles.faq__questionRow}>
                                        <h3 className={styles.faq__question}>{item.question}</h3>
                                        <div className={styles.faq__icon}>
                                            <Plus size={24} />
                                        </div>
                                    </div>
                                    
                                    <div className={styles.faq__answerWrapper}>
                                        <div className={styles.faq__answerInner}>
                                            <p>{item.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};