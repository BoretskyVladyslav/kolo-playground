'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Clock, User, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import { Reveal } from '../ui/Reveal';
import 'swiper/css';
import styles from './Rooms.module.scss';

const rooms = [
    {
        id: 1,
        title: 'ІНТЕРАКТИВНА ПІДЛОГА',
        desc: 'Ця гра підкорює дітей і дорослих – адже поєднує рух, азарт і веселощі. Ідеальна розвага для вечірок, днів народжень та активного відпочинку з друзями.',
        time: '2-3 хвилини',
        age: '5+ років',
        players: '1-8 гравців',
        image: '/images/rooms__floor-game.jpg'
    },
    {
        id: 2,
        title: 'ІНТЕРАКТИВНІ ПАЗЛИ',
        desc: 'Любите рух, змагання та азарт? Хочете прокачати командний дух чи розважитись? «Інтерактивні пазли» створені для драйву та справжніх емоцій!',
        time: '2-3 хвилини',
        age: '5+ років',
        players: '1-9 гравців',
        image: '/images/rooms__puzzle-game.jpg'
    },
    {
        id: 3,
        title: 'ХОВАНКИ З МОНСТРАМИ',
        desc: 'У цій зоні на стінах розташовані кнопки, а над ними – фігури монстрів-охоронців. Ваше завдання – зібрати бали, уникнувши небезпеки.',
        time: '3-5 хвилин',
        age: '6+ років',
        players: '1-10 гравців',
        image: '/images/rooms__hiding-game.jpg'
    },
    {
        id: 4,
        title: 'МІНІ БАСКЕТБОЛ',
        desc: 'Ця зона перетворює кидки на справжнє інтерактивне змагання. Цілися у кільце, влучай та заробляй бали – драйв гарантовано.',
        time: '2-4 хвилини',
        age: '5+ років',
        players: '1-10 гравців',
        image: '/images/rooms__basketball-game.jpg'
    },
    {
        id: 5,
        title: 'ІНТЕРАКТИВНА СТІНА',
        desc: 'Ця зона перетворює стрільбу на справжнє інтерактивне змагання. Візьми пістолет, націлься та влучай в ціль — драйв гарантовано!',
        time: '2-3 хвилини',
        age: '3+ років',
        players: '1-6 гравців',
        image: '/images/rooms__wall-game.jpg'
    },
    {
        id: 6,
        title: 'ФІШКИ ПРОСТОРУ',
        desc: 'Не обмежуйтесь однією грою — у нас десятки форматів, що подарують новий досвід. Кожен візит — нові враження, адже ми постійно розширюємо колекцію ігор.',
        time: 'скільки хочете',
        age: '3+ років',
        players: 'довільна к-сть',
        image: '/images/rooms__space-game.jpg'
    }
];

export const Rooms = () => {
    const swiperRef = useRef<SwiperType | null>(null);

    const handleScrollToBooking = () => {
        const elem = document.getElementById('booking');
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="rooms" className={styles.rooms}>
            <div className={styles.rooms__container}>
                <span className={styles.rooms__index}>[3]</span>
                
                <div className={styles.rooms__header}>
                    <div className={styles.rooms__headerLeft}>
                        <Reveal animation="fade-up">
                            <h2 className={styles.rooms__title}>ПРО КІМНАТИ</h2>
                        </Reveal>
                    </div>

                    <div className={styles.rooms__headerRight}>
                        <Reveal animation="fade-up" delay={0.2}>
                            <p className={styles.rooms__subtitle}>
                                Десятки форматів взаємодії,<br />зібрані у 6 унікальних кімнатах.
                            </p>
                        </Reveal>
                        <div className={styles.rooms__nav}>
                            <button 
                                onClick={() => swiperRef.current?.slidePrev()}
                                className={styles.rooms__navBtn}
                                aria-label="Попередня кімната"
                                type="button"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={() => swiperRef.current?.slideNext()}
                                className={styles.rooms__navBtn}
                                aria-label="Наступна кімната"
                                type="button"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <Reveal animation="fade-up" delay={0.3}>
                    <div className={styles.rooms__sliderWrapper}>
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            onBeforeInit={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            spaceBetween={20}
                            slidesPerView={1.2}
                            loop={true}
                            speed={800}
                            grabCursor={true}
                            breakpoints={{
                                480: { slidesPerView: 1.5 },
                                768: { slidesPerView: 2.2 },
                                1024: { slidesPerView: 3 }
                            }}
                            className={styles.rooms__swiper}
                        >
                            {rooms.map((room) => (
                                <SwiperSlide key={room.id} className={styles.rooms__slide}>
                                    <div className={styles.rooms__card}>
                                        <div className={styles.rooms__imageWrapper}>
                                            <Image 
                                                src={room.image} 
                                                alt={room.title} 
                                                fill 
                                                className={styles.rooms__image}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        
                                        <div className={styles.rooms__content}>
                                            <h3 className={styles.rooms__cardTitle}>{room.title}</h3>
                                            <p className={styles.rooms__cardDesc}>{room.desc}</p>
                                            
                                            <div className={styles.rooms__divider} />
                                            
                                            <div className={styles.rooms__meta}>
                                                <div className={styles.rooms__metaItem}>
                                                    <Clock size={18} className={styles.rooms__icon} />
                                                    <span>{room.time}</span>
                                                </div>
                                                <div className={styles.rooms__metaItem}>
                                                    <User size={18} className={styles.rooms__icon} />
                                                    <span>{room.age}</span>
                                                </div>
                                                <div className={styles.rooms__metaItem}>
                                                    <Users size={18} className={styles.rooms__icon} />
                                                    <span>{room.players}</span>
                                                </div>
                                            </div>

                                            <button 
                                                className={styles.rooms__moreBtn}
                                                onClick={handleScrollToBooking}
                                                type="button"
                                            >
                                                ЗАБРОНЮВАТИ
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};