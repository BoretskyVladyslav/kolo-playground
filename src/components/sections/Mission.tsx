'use client';

import { Reveal } from '../ui/Reveal';
import styles from './Mission.module.scss';

const missionItems = [
    {
        id: 1,
        text: "надихнути на активний досвід, що запам'ятається",
        variant: 'blue'
    },
    {
        id: 2,
        text: "сформувати універсальний формат, у якому гра – це спільне",
        variant: 'pink'
    },
    {
        id: 3,
        text: "забезпечити інноваційний геймерський простір для всієї родини",
        variant: 'green'
    }
];

export const Mission = () => {
    return (
        <section className={styles.mission}>
            <div className={styles.mission__container}>
                <div className={styles.mission__header}>
                    <Reveal animation="fade-up">
                        <h2 className={styles.mission__title}>
                            МИ СТВОРИЛИ<br />
                            KOLO, ЩОБ:
                        </h2>
                    </Reveal>
                    <span className={styles.mission__index}>[2]</span>
                </div>

                <div className={styles.mission__grid}>
                    {missionItems.map((item, index) => (
                        <Reveal key={item.id} animation="fade-up" delay={index * 0.2}>
                            <div className={`${styles.mission__card} ${styles[`mission__card--${item.variant}`]}`}>
                                <div className={styles.mission__pinWrapper}>
                                    <div className={styles.mission__pin} />
                                </div>
                                <p className={styles.mission__text}>
                                    {item.text}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};