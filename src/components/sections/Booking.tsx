'use client';

import { useState, useEffect, useMemo } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { uk } from 'date-fns/locale/uk';
import { ChevronDown, Calendar, CheckCircle, MapPin, Users, Clock, Banknote } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Booking.module.scss';

registerLocale('uk', uk);

const START_HOUR = 11;
const END_HOUR = 21;

export const Booking = () => {
  const [isClient, setIsClient] = useState(false);

  const [city, setCity] = useState('Київ');
  const [guests, setGuests] = useState('3');
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  }, []);

  const isTimeDisabled = (time: string) => {
    if (!date) return true;

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (!isToday) return false;

    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(now);
    slotTime.setHours(hours, minutes, 0, 0);

    return slotTime < new Date(now.getTime() + 30 * 60000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const formattedDate = date
    ? date.toLocaleDateString('uk-UA', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  if (!isClient) return null;

  return (
    <section id="booking" className={styles.booking}>
      <div className={styles.booking__bgGlow} />

      <div className={styles.booking__container}>
        <div className={styles.booking__header}>
          <Reveal animation="fade-up">
            <h2 className={styles.booking__title}>ЗАПИС ОНЛАЙН</h2>
          </Reveal>
          <span className={styles.booking__index}>[6]</span>
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
                <div className={styles.booking__imagePlaceholder} />
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

        <Reveal animation="fade-up" delay={0.2}>
          <div className={styles.booking__interface}>
            {!isSubmitted ? (
              <>
                <div className={styles.booking__controls}>
                  <div className={styles.booking__controlGroup}>
                    <label>Місто</label>
                    <div className={styles.selectWrapper}>
                      <MapPin size={18} className={styles.icon} />
                      <select value={city} onChange={e => setCity(e.target.value)}>
                        <option value="Київ">Київ</option>
                      </select>
                      <ChevronDown size={16} className={styles.arrow} />
                    </div>
                  </div>

                  <div className={styles.booking__controlGroup}>
                    <label>Людей</label>
                    <div className={styles.selectWrapper}>
                      <Users size={18} className={styles.icon} />
                      <select value={guests} onChange={e => setGuests(e.target.value)}>
                        {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className={styles.arrow} />
                    </div>
                  </div>

                  <div className={styles.booking__controlGroup}>
                    <label>Дата</label>
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

                <div className={styles.booking__slots}>
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      disabled={isTimeDisabled(time)}
                      onClick={() => setSelectedTime(time)}
                      className={`${styles.slotBtn} ${
                        selectedTime === time ? styles.active : ''
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {selectedTime && (
                  <div className={styles.booking__formContainer}>
                    <div className={styles.booking__summary}>
                      <h3>Ваше бронювання</h3>
                      <ul className={styles.summaryList}>
                        <li>
                          <span>Місто:</span> {city}
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
                          <span>До сплати:</span> {Number(guests) * 400} грн
                        </li>
                      </ul>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.booking__form}>
                      <div className={styles.inputGroup}>
                        <input
                          type="text"
                          name="name"
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
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        <label>Номер телефону</label>
                      </div>

                      <div className={styles.inputGroup}>
                        <input
                          type="email"
                          name="email"
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
                  onClick={() => setIsSubmitted(false)}
                  className={styles.resetBtn}
                >
                  Забронювати ще
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
