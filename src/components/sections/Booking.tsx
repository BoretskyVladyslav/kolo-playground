'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import DatePicker, { registerLocale } from 'react-datepicker';
import { uk } from 'date-fns/locale/uk';
import { ChevronDown, Calendar, CheckCircle, MapPin, Users, Clock, Banknote, AlertCircle } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { supabase } from '@/lib/supabase';
import { sendBooking } from '@/app/actions';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Booking.module.scss';

declare global {
    interface Window {
        fbq: any;
    }
}

registerLocale('uk', uk);

const START_HOUR = 11;
const END_HOUR = 20;
const MAX_CAPACITY = 15;
const VISIT_DURATION = 120;

type TimeSlot = {
    time: string;
    available: boolean;
    remaining: number;
};

export const Booking = () => {
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [city, setCity] = useState('1');
    const [guests, setGuests] = useState('2');
    const [date, setDate] = useState<Date | null>(new Date());
    
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const getMinutesFromMidnight = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    const fetchAvailableSlots = useCallback(async () => {
        if (!date) return;
        setLoading(true);

        try {
            const dateStr = date.toLocaleDateString('en-CA');
            
            const { data: bookings, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('city_id', city)
                .eq('date', dateStr);

            if (error) throw error;

            const generatedSlots: TimeSlot[] = [];
            const now = new Date();
            const isToday = date.getDate() === now.getDate() && 
                            date.getMonth() === now.getMonth() && 
                            date.getFullYear() === now.getFullYear();
            
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
                const minutesArr = hour === END_HOUR ? [0] : [0, 30];

                for (let minute of minutesArr) {
                    const timeStr = `${hour}:${minute === 0 ? '00' : '30'}`;
                    const slotStartMinutes = hour * 60 + minute;
                    const slotEndMinutes = slotStartMinutes + VISIT_DURATION;

                    if (isToday && slotStartMinutes < currentMinutes + 30) {
                         continue; 
                    }

                    let maxOccupancy = 0;

                    for (let checkTime = slotStartMinutes; checkTime < slotEndMinutes; checkTime += 30) {
                        let currentOccupancyAtPoint = 0;

                        bookings?.forEach((b) => {
                             const bStart = getMinutesFromMidnight(b.start_time);
                             const bEnd = getMinutesFromMidnight(b.end_time); 

                             if (checkTime >= bStart && checkTime < bEnd) {
                                 currentOccupancyAtPoint += b.number_of_people;
                             }
                        });
                        
                        if (currentOccupancyAtPoint > maxOccupancy) {
                                maxOccupancy = currentOccupancyAtPoint;
                        }
                    }

                    const guestsNum = parseInt(guests);
                    const remaining = MAX_CAPACITY - maxOccupancy;
                    const available = (maxOccupancy + guestsNum) <= MAX_CAPACITY;

                    generatedSlots.push({
                        time: timeStr,
                        available,
                        remaining: remaining < 0 ? 0 : remaining
                    });
                }
            }
            setSlots(generatedSlots);

        } catch (err) {
            console.error('Error loading slots:', err);
        } finally {
            setLoading(false);
        }
    }, [date, city, guests]);

    useEffect(() => {
        fetchAvailableSlots();
        setSelectedTime(null);
    }, [fetchAvailableSlots]);

    const formattedDate = date
        ? date.toLocaleDateString('uk-UA', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
        : '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !selectedTime) return;

        const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, "");
        if(cleanPhone.length < 10) {
                alert("Будь ласка, введіть коректний номер телефону");
                return;
        }

        try {
            const dateStr = date.toLocaleDateString('en-CA');
            
            const [h, m] = selectedTime.split(':').map(Number);
            const startMinutes = h * 60 + m;
            const endMinutes = startMinutes + VISIT_DURATION;
            
            const endH = Math.floor(endMinutes / 60);
            const endM = endMinutes % 60;
            const endTimeStr = `${endH}:${endM === 0 ? '00' : '30'}`;

            const newBooking = {
                city_id: parseInt(city),
                date: dateStr,
                start_time: selectedTime,
                end_time: endTimeStr, 
                number_of_people: parseInt(guests),
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_email: formData.email,
                created_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('bookings')
                .insert([newBooking]);

            if (error) throw error;

            if (typeof window !== 'undefined' && window.fbq) {
                window.fbq('track', 'Lead', {
                    content_name: 'Booking',
                    value: Number(guests) * 400,
                    currency: 'UAH'
                });
            }

            const emailData = new FormData();
            emailData.append('name', formData.name);
            emailData.append('phone', formData.phone);
            emailData.append('email', formData.email);
            emailData.append('city', city === '1' ? 'Київ' : 'Інше');
            emailData.append('date', formattedDate);
            emailData.append('time', `${selectedTime} - ${endTimeStr}`);
            emailData.append('guests', guests);
            
            await sendBooking(null, emailData);

            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

            setIsSubmitted(true);
            fetchAvailableSlots();

            setTimeout(() => {
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

        } catch (error: any) {
            console.error('Error creating booking:', error);
            alert('Помилка бронювання: ' + error.message);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isClient) return null;

    return (
        <section id="booking" className={styles.booking}>
            <div className={styles.booking__bgGlow} />

            <div className={styles.booking__container}>
                <div className={styles.booking__header}>
                    <Reveal animation="fade-up">
                        <h2 className={styles.booking__title}>ЗАПИС ОНЛАЙН</h2>
                    </Reveal>
                </div>

                <div className={styles.booking__intro}>
                    <div className={styles.booking__introLeft}>
                        <Reveal animation="slide-in">
                            <p className={styles.booking__cta}>
                                ОБИРАЙТЕ ЗРУЧНИЙ ЧАС У НАШОМУ КАЛЕНДАРІ ТА{' '}
                                <span className={styles.booking__highlight}>
                                    БРОНЮЙТЕ ВІЗИТ У KOLO PLAYGROUND ОНЛАЙН
                                </span>
                            </p>
                        </Reveal>
                    </div>

                    <div className={styles.booking__introRight}>
                        <Reveal animation="fade-up" delay={0.2}>
                            <p className={styles.booking__description}>
                                Кожна гра триває кілька хвилин, зберігаючи динаміку та азарт, а серія ігор
                                перевіряє вашу креативність, командну роботу та майстерність.
                            </p>
                        </Reveal>

                        <Reveal animation="scale" delay={0.3}>
                            <div className={styles.booking__visual}>
                                <Image
                                    src="/images/booking-img.jpg"
                                    alt="Booking Visual"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover' }}
                                    className={styles.booking__image}
                                />
                                <div className={`${styles.corner} ${styles.cornerTL}`} />
                                <div className={`${styles.corner} ${styles.cornerTR}`} />
                                <div className={`${styles.corner} ${styles.cornerBL}`} />
                                <div className={`${styles.corner} ${styles.cornerBR}`} />
                            </div>
                        </Reveal>

                        <p className={styles.booking__note}>
                            *незабаром нові міста, слідкуйте за оновленнями
                            <br />
                            в соц. мережах та на нашому сайті!
                        </p>
                    </div>
                </div>

                <Reveal animation="fade-up" delay={0.1}>
                    <div className={styles.booking__infoBanner}>
                        <div className={styles.infoItem}>
                            <div className={styles.iconCircle}>
                                <Clock size={24} color="#000" />
                            </div>
                            <div className={styles.infoText}>
                                <span className={styles.label}>ТРИВАЛІСТЬ</span>
                                <span className={styles.value}>120 хв</span>
                            </div>
                        </div>
                        
                        <div className={styles.divider} />

                        <div className={styles.infoItem}>
                            <div className={styles.iconCircle}>
                                <Banknote size={24} color="#000" />
                            </div>
                            <div className={styles.infoText}>
                                <span className={styles.label}>ВАРТІСТЬ</span>
                                <span className={styles.value}>400 грн</span>
                                <span className={styles.sub}>/ за особу</span>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal animation="fade-up" delay={0.2}>
                    <div className={styles.booking__interfaceWrapper}>
                        <div className={styles.booking__interface}>
                            {!isSubmitted ? (
                                <>
                                    <div className={styles.booking__filters}>
                                        <div className={styles.filterGroup}>
                                            <label>МІСТО</label>
                                            <div className={styles.selectWrapper}>
                                                <MapPin size={18} className={styles.icon} />
                                                <select value={city} onChange={e => setCity(e.target.value)}>
                                                    <option value="1">Київ</option>
                                                </select>
                                                <ChevronDown size={16} className={styles.arrow} />
                                            </div>
                                        </div>

                                        <div className={styles.filterGroup}>
                                            <label>ЛЮДЕЙ</label>
                                            <div className={styles.selectWrapper}>
                                                <Users size={18} className={styles.icon} />
                                                <select value={guests} onChange={e => {
                                                    setGuests(e.target.value);
                                                    setSelectedTime(null);
                                                }}>
                                                    {Array.from({ length: 14 }, (_, i) => i + 2).map(num => (
                                                        <option key={num} value={num}>
                                                            {num}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className={styles.arrow} />
                                            </div>
                                        </div>

                                        <div className={styles.filterGroup}>
                                            <label>ДАТА</label>
                                            <div className={styles.dateWrapper}>
                                                <Calendar size={18} className={styles.icon} />
                                                <DatePicker
                                                    selected={date}
                                                    onChange={(d: Date | null) => {
                                                        setDate(d);
                                                        setSelectedTime(null);
                                                    }}
                                                    dateFormat="dd.MM.yyyy"
                                                    minDate={new Date()}
                                                    locale="uk"
                                                />
                                                <ChevronDown size={16} className={styles.arrow} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.booking__notice}>
                                        <AlertCircle className={styles.noticeIcon} size={24} />
                                        <p>
                                            <strong>Максимум 15 людей одночасно. Всі бронювання на 2 години.</strong> <br/>
                                            Оберіть місто, кількість гостей та дату, щоб побачити доступні слоти. 
                                            Бронювання 30-хвилинними інтервалами з 11:00 до 20:00.
                                        </p>
                                    </div>

                                    <div className={styles.booking__slots}>
                                        {loading ? (
                                            <div style={{color: 'white', gridColumn: '1/-1', textAlign: 'center'}}>Завантаження слотів...</div>
                                        ) : slots.length > 0 ? (
                                                slots.map(slot => (
                                                        <button
                                                        key={slot.time}
                                                        disabled={!slot.available}
                                                        onClick={() => setSelectedTime(slot.time)}
                                                        className={`${styles.slotBtn} ${
                                                                selectedTime === slot.time ? styles.active : ''
                                                        }`}
                                                        >
                                                        <span className={styles.time}>{slot.time}</span>
                                                        <span className={styles.seats} style={{
                                                                color: slot.available ? 'rgba(255,255,255,0.7)' : '#ff4444'
                                                        }}>
                                                                        {slot.available 
                                                                                ? `Вільно: ${slot.remaining} з ${MAX_CAPACITY}` 
                                                                                : 'Місць немає'}
                                                        </span>
                                                        </button>
                                                ))
                                        ) : (
                                                <div style={{color: 'white', gridColumn: '1/-1', textAlign: 'center'}}>На цю дату немає доступних слотів</div>
                                        )}
                                    </div>

                                    {selectedTime && (
                                        <div className={styles.booking__formContainer}>
                                            <div className={styles.booking__summary}>
                                                <h3>Ваше бронювання</h3>
                                                <ul className={styles.summaryList}>
                                                    <li>
                                                        <span>Місто:</span> {city === '1' ? 'Київ' : 'Інше'}
                                                    </li>
                                                    <li>
                                                        <span>Дата:</span> {formattedDate}
                                                    </li>
                                                    <li>
                                                        <span>Час:</span> {selectedTime}
                                                    </li>
                                                    <li>
                                                        <span>Людей:</span> {guests}
                                                    </li>
                                                    <li className={styles.highlight}>
                                                        <span>Тривалість:</span> 120 хв
                                                    </li>
                                                    <li className={styles.highlight}>
                                                        <span>До сплати:</span> <span className={styles.price}>{Number(guests) * 400} грн</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <form onSubmit={handleSubmit} className={styles.booking__form}>
                                                <div className={styles.inputGroup}>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        placeholder=" "
                                                        required
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label>Ваше повне ім'я</label>
                                                </div>

                                                <div className={styles.inputGroup}>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        placeholder=" "
                                                        required
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        title="Введіть телефон, наприклад 0501234567"
                                                    />
                                                    <label>Номер телефону</label>
                                                </div>

                                                <div className={styles.inputGroup}>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder=" "
                                                        required
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label>Email</label>
                                                </div>

                                                <button type="submit" className={styles.submitBtn}>
                                                    ПІДТВЕРДИТИ БРОНЮВАННЯ
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.booking__success}>
                                    <CheckCircle size={80} className={styles.successIcon} />
                                    <h3>ДЯКУЄМО!</h3>
                                    <p>
                                        Ваше бронювання на {date?.toLocaleDateString()} о {selectedTime} прийнято.
                                    </p>
                                    <button
                                        onClick={() => {
                                                setIsSubmitted(false);
                                                fetchAvailableSlots();
                                        }}
                                        className={styles.resetBtn}
                                    >
                                        Забронювати ще
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};