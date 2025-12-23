'use client';

import Image from 'next/image';
import { Reveal } from '../ui/Reveal';
import styles from './Birthdays.module.scss';

const steps = [
    {
        id: '01',
        title: 'Зустріч гостей',
        description: 'Святкова кімната з інтерактивним столом зустрічає вас яскравою проекцією. Ведучий одразу налаштовує на веселий настрій'
    },
    {
        id: '02',
        title: 'Ігровий тур по всіх зонах',
        description: 'Інтерактивна підлога, хованка з монстрами, «ШІ інтерактив» – 5 різних локацій, де можна грати, змагатися та ставити власні рекорди'
    },
    {
        id: '03',
        title: 'Конкурси та квести',
        description: 'Командні ігри, жарти, веселі випробування, ведучий не дасть нікому нудьгувати'
    },
    {
        id: '04',
        title: 'Смачна пауза',
        description: 'Час перепочити й підкріпитися смаколиками'
    },
    {
        id: '05',
        title: 'Кульмінація',
        description: 'Святковий тортик, свічки, побажання, овації та море теплих слів'
    },
    {
        id: '06',
        title: 'Емоції, що залишаються',
        description: 'Свято триває і після основної програми – усі гості можуть вільно досліджувати ігрові зони, робити фото й відео на пам’ять'
    }
];

export const Birthdays = () => {
    return (
        <section id="birthdays" className={styles.birthdays}> 
            <div className={styles.birthdays__container}>
                <div className={styles.birthdays__header}>
                    <Reveal animation="fade-up">
                        <h2 className={styles.birthdays__title}>ДНІ НАРОДЖЕННЯ</h2>
                    </Reveal>
                    <span className={styles.birthdays__index} aria-hidden="true">[5]</span>
                </div>

                <div className={styles.birthdays__content}>
                    <div className={styles.birthdays__sidebar}>
                        <div className={styles.birthdays__intro}>
                            <Reveal animation="fade-up" delay={0.1}>
                                <p className={styles.birthdays__text}>
                                    KOLO – місце, де будь-яке свято чи тімбілдінг перетворюється на шоу майбутнього.
                                </p>
                            </Reveal>
                            <Reveal animation="fade-up" delay={0.2}>
                                <p className={styles.birthdays__highlight}>
                                    П’ЯТЬ ІГРОВИХ ЗОН, ДЕСЯТКИ СЦЕНАРІЇВ ТА ІННОВАЦІЙНІ ТЕХНОЛОГІЇ СТВОРЮЮТЬ АТМОСФЕРУ, В ЯКІЙ СВІТЛО Й ЗВУК ОЖИВАЮТЬ, А ДІТИ Й ДОРОСЛІ СТАЮТЬ ГОЛОВНИМИ ГЕРОЯМИ ГРИ
                                </p>
                            </Reveal>
                        </div>
                        
                        <div className={styles.birthdays__starWrapper}>
                            <Reveal animation="scale" delay={0.4}>
                                <Image 
                                    src="/icons/star.png" 
                                    alt="Star Decoration" 
                                    width={120} 
                                    height={120} 
                                    className={styles.birthdays__star}
                                />
                            </Reveal>
                        </div>
                    </div>

                    <div className={styles.birthdays__timeline}>
                        {steps.map((step, index) => (
                            <Reveal key={step.id} animation="slide-in" delay={index * 0.1}>
                                <div className={styles.birthdays__step}>
                                    <span className={styles.birthdays__stepNumber}>{step.id}</span>
                                    <div className={styles.birthdays__stepContent}>
                                        <h3 className={styles.birthdays__stepTitle}>{step.title}</h3>
                                        <p className={styles.birthdays__stepDesc}>{step.description}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};