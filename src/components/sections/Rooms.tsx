'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Clock, User, Users, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import { Reveal } from '../ui/Reveal';
import 'swiper/css';
import styles from './Rooms.module.scss';

// ... (масив rooms залишається тим самим, що і був у попередньому кроці)
const rooms = [
    {
        id: 1,
        title: 'ІНТЕРАКТИВНА ПІДЛОГА',
        desc: 'Гра, яка захоплює з перших секунд. Поєднує рух, азарт і веселощі.',
        time: '2-3 хвилини',
        age: '5+ років',
        players: '1-8 гравців',
        image: '/images/rooms__floor-game.jpg',
        details: {
            intro: "Уявіть підлогу, що оживає під вашими ногами: квадратики загоряються різними кольорами і кожен колір має своє значення.",
            rules: [
                "Зелений – безпечна зона, де можна перевести подих.",
                "Синій – ваш шанс заробити бали та вийти вперед.",
                "Червоний – пастка! Наступиш – втратиш життя."
            ],
            gameplay: "Кожна гра – 5 життів. Ваше завдання: набрати максимум балів і залишитися в грі якомога довше. Підлога постійно змінюється: квадратики засвічуються у нових комбінаціях.",
            modes: [
                "Multiplayer – гра для всієї компанії. 8 різних рівнів (4 легкі та 4 більш складні).",
                "2 Player – змагайся один на один або команда на команду. Одна команда вибиває сині, інша – рожеві."
            ]
        }
    },
    // ... інші кімнати (без змін) ...
    {
        id: 2,
        title: 'ІНТЕРАКТИВНІ ПАЗЛИ',
        desc: 'Швидкість. Логіка. Адреналін. Хочете прокачати командний дух чи розважитись?',
        time: '2-3 хвилини',
        age: '5+ років',
        players: '1-9 гравців',
        image: '/images/rooms__puzzle-game.jpg',
        details: {
            intro: "Ви отримуєте ігрове поле з фігурами. Завдання – знайти потрібні фігури та розташувати їх правильно на ігровому полі.",
            rules: [
                "Час кожної гри обмежений!",
                "Вставили фігурку – отримали бал.",
                "Хто швидший і кмітливіший – той переможець."
            ],
            gameplay: "На вас чекає 2 рівні по 8 ігор – боротьба за перемогу до останньої секунди. Наприкінці підраховуємо бали, визначаємо переможців і залишаємо час для реваншу.",
            modes: []
        }
    },
    {
        id: 3,
        title: 'ХОВАНКИ З МОНСТРАМИ',
        desc: 'Спробуй сховатися і перемогти. Збирайте бали, уникаючи небезпеки.',
        time: '3-5 хвилин',
        age: '6+ років',
        players: 'до 6 гравців',
        image: '/images/rooms__hiding-game.jpg',
        details: {
            intro: "На стінах розташовані кнопки, а над ними – фігури монстрів-охоронців.",
            rules: [
                "Сині кнопки запалюються у певній послідовності – натискайте на них.",
                "Червоні «монстрики» засвічуються несподівано.",
                "У цей момент потрібно сховатися або завмерти, бо рух забирає життя."
            ],
            gameplay: "Гра динамічна: комбінації кнопок постійно змінюються, а складність росте з кожним наступним рівнем.",
            modes: [
                "Multiplayer – гра однією командою. 8 ігор (4 легкі та 4 складні).",
                "2 Player – гра на дві команди. Сині кнопки для однієї, рожеві для другої."
            ]
        }
    },
    {
        id: 4,
        title: 'МІНІ БАСКЕТБОЛ',
        desc: 'Тренуй швидкість та точність. Ця зона перетворює кидки на справжнє змагання.',
        time: '2-4 хвилини',
        age: '5+ років',
        players: 'до 4 гравців',
        image: '/images/rooms__basketball-game.jpg',
        details: {
            intro: "Кільця засвічуються в певній динаміці і послідовності, залежно від рівня гри.",
            rules: [
                "Слідкуй за кольором отворів, кидай кульку в синій.",
                "Попав в червоний – мінус життя.",
                "Кожне точне попадання приносить бали."
            ],
            gameplay: "Збирай максимум і стань лідером! Драйв гарантовано.",
            modes: [
                "Multiplayer – всі гравці кидають кульку в отвори, що засвічуються синім.",
                "2 Player – одна команда кидає в сині кільця, інша в рожеві."
            ]
        }
    },
    {
        id: 5,
        title: 'ІНТЕРАКТИВНА СТІНА',
        desc: 'Влучай у ціль та відчуй драйв. Візьми пістолет, націлься та влучай.',
        time: '2-3 хвилини',
        age: '3+ років',
        players: '1-6 гравців',
        image: '/images/rooms__wall-game.jpg',
        details: {
            intro: "Кожен гравець отримує пістолет та точкову ціль на інтерактивній стіні.",
            rules: [
                "Кожен правильний постріл приносить бали.",
                "Мета проста: встигни вибити ціль, перш ніж вона зникне."
            ],
            gameplay: "Реакція, швидкість, координація – усе в одному місці. Обмежений час – треба встигнути набрати більше балів.",
            modes: [
                "20+ ігор різних рівнів складності.",
                "Цікава розвага як для дітей, так і для дорослих."
            ]
        }
    },
    {
        id: 6,
        title: 'ФІШКИ ПРОСТОРУ',
        desc: 'Крок у майбутнє – занурення і взаємодія! Десятки форматів, що подарують новий досвід.',
        time: 'скільки хочете',
        age: '3+ років',
        players: 'довільна к-сть',
        image: '/images/rooms__space-game.jpg',
        details: {
            intro: "Ми не зупиняємось на досягнутому – постійно додаємо нові ігри та технології.",
            rules: [],
            gameplay: "Наш простір живе, розвивається й змінюється разом із вами.",
            modes: [
                "ШІ інтерактив",
                "Інтерактивне графіті",
                "Голографічні проекції та шоу",
                "Інтерактив, який реагує на звук",
                "Аудіовізуальні інсталяції"
            ]
        }
    }
];

export const Rooms = () => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [activeRoomId, setActiveRoomId] = useState<number | null>(null);

    const handleBookingScroll = () => {
        const elem = document.getElementById('booking');
        elem?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="rooms" className={styles.rooms}>
            <div className={styles.rooms__container}>
                <span className={styles.rooms__index} aria-hidden="true">[3]</span>
                
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
                            loop={false} // Вимкнули loop, щоб не було проблем зі станом оверлею на дубльованих слайдах
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
                                                onClick={() => setActiveRoomId(room.id)}
                                                type="button"
                                            >
                                                ДІЗНАТИСЯ БІЛЬШЕ
                                            </button>
                                        </div>

                                        {/* OVERLAY */}
                                        <div className={`${styles.rooms__overlay} ${activeRoomId === room.id ? styles.active : ''}`}>
                                            <div className={styles.rooms__overlayHeader}>
                                                <h3 className={styles.rooms__overlayTitle}>{room.title}</h3>
                                                <button 
                                                    className={styles.rooms__closeBtn} 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveRoomId(null);
                                                    }}
                                                >
                                                    <X size={24} />
                                                </button>
                                            </div>

                                            <div className={styles.rooms__overlayScroll}>
                                                <div className={styles.rooms__overlayText}>
                                                    <p className={styles.intro}>{room.details.intro}</p>
                                                    
                                                    {room.details.rules.length > 0 && (
                                                        <div className={styles.section}>
                                                            <h4>Як проходить гра:</h4>
                                                            <ul>
                                                                {room.details.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {room.details.gameplay && (
                                                        <p className={styles.gameplay}>{room.details.gameplay}</p>
                                                    )}

                                                    {room.details.modes.length > 0 && (
                                                        <div className={styles.section}>
                                                            <h4>Варіанти гри:</h4>
                                                            <ul>
                                                                {room.details.modes.map((mode, i) => <li key={i}>{mode}</li>)}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.rooms__overlayFooter}>
                                                <button 
                                                    className={styles.rooms__bookBtn}
                                                    onClick={() => {
                                                        setActiveRoomId(null);
                                                        handleBookingScroll();
                                                    }}
                                                >
                                                    ЗАБРОНЮВАТИ ГРУ
                                                </button>
                                            </div>
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