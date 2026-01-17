'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { deleteBooking as deleteBookingAction, updateBookingStatus } from '@/app/actions';
import styles from './admin.module.scss';

const ADMIN_EMAIL = 'kolo.playground@gmail.com';
const ADMIN_PASS = 'Koloahmatovoy50';

interface Booking {
    id: number;
    city_id: number;
    date: string;
    start_time: string;
    end_time: string;
    number_of_people: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    created_at: string;
    status: 'pending' | 'paid' | 'failed';
    payment_id?: string;
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [stats, setStats] = useState({ total: 0, today: 0 });

    const [showModal, setShowModal] = useState(false);
    const [manualBooking, setManualBooking] = useState({
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        guests: '6',
        name: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        const isLogged = localStorage.getItem('kolo_admin_logged');
        if (isLogged === 'true') {
            setIsAuthenticated(true);
            loadBookings();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
            setIsAuthenticated(true);
            localStorage.setItem('kolo_admin_logged', 'true');
            loadBookings();
        } else {
            setLoginError('Невірний логін або пароль');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('kolo_admin_logged');
        setBookings([]);
    };

    const loadBookings = async (dateOverride?: string) => {
        setLoading(true);
        try {
            const activeDateFilter = dateOverride !== undefined ? dateOverride : filterDate;

            let query = supabase
                .from('bookings')
                .select('*')
                .order('date', { ascending: false })
                .order('start_time', { ascending: false });

            if (activeDateFilter) {
                query = query.eq('date', activeDateFilter);
            }

            const { data, error } = await query;
            if (error) throw error;
            
            setBookings(data || []);
            if (!activeDateFilter) calculateStats(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFilterDate('');
        loadBookings('');
    };

    const calculateStats = (data: Booking[]) => {
        const today = new Date().toLocaleDateString('en-CA');
        const todayCount = data.filter(b => b.date === today).length;
        setStats({
            total: data.length,
            today: todayCount
        });
    };

    const deleteBooking = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете видалити це бронювання?')) return;
        try {
            const res = await deleteBookingAction(String(id));
            if (!res.success) throw new Error(res.message);
            loadBookings(); 
        } catch (error) {
            alert('Помилка видалення запису. Перевірте консоль.');
            console.error(error);
        }
    };

    const markAsPaid = async (id: number) => {
        if (!confirm('Підтвердити оплату для цього замовлення?')) return;
        try {
            const res = await updateBookingStatus(String(id), 'paid');
            if (!res.success) throw new Error(res.message);
            loadBookings();
        } catch (error) {
            alert('Помилка оновлення статусу');
            console.error(error);
        }
    };

    const createManualBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const [h, m] = manualBooking.time.split(':').map(Number);
            const startMinutes = h * 60 + m;
            const endMinutes = startMinutes + 120;
            const endH = Math.floor(endMinutes / 60);
            const endM = endMinutes % 60;
            const endTimeStr = `${endH}:${endM === 0 ? '00' : '30'}`;

            const newBooking = {
                city_id: 1,
                date: manualBooking.date,
                start_time: manualBooking.time,
                end_time: endTimeStr,
                number_of_people: parseInt(manualBooking.guests),
                customer_name: manualBooking.name || 'Адмін Бронь',
                customer_phone: manualBooking.phone || '-',
                customer_email: manualBooking.email || '-',
                created_at: new Date().toISOString(),
                status: 'paid' 
            };

            const { error } = await supabase.from('bookings').insert([newBooking]);
            if (error) throw error;

            setShowModal(false);
            setManualBooking({
                date: new Date().toISOString().split('T')[0],
                time: '12:00',
                guests: '6',
                name: '',
                phone: '',
                email: ''
            });
            alert('Бронювання успішно створено!');
            loadBookings();

        } catch (error) {
            console.error(error);
            alert('Помилка створення бронювання');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.adminContainer}>
                <div className={styles.loginWrapper}>
                    <div className={styles.loginBox}>
                        <h1>KOLO ADMIN</h1>
                        <form onSubmit={handleLogin}>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)} 
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)} 
                            />
                            <button type="submit">УВІЙТИ</button>
                            {loginError && <p className={styles.error}>{loginError}</p>}
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminContainer}>
            <header className={styles.header}>
                <h1>Адмін Панель</h1>
                <div className={styles.headerActions}>
                    <button onClick={() => setShowModal(true)} className={styles.createBtn}>
                        + Додати бронь
                    </button>
                    <button onClick={handleLogout} className={styles.logoutBtn}>Вийти</button>
                </div>
            </header>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.number}>{stats.total}</span>
                    <span className={styles.label}>Всього бронювань</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.number}>{stats.today}</span>
                    <span className={styles.label}>Сьогодні</span>
                </div>
            </div>

            <div className={styles.filters}>
                <input 
                    type="date" 
                    value={filterDate} 
                    onChange={(e) => setFilterDate(e.target.value)} 
                />
                
                {filterDate && (
                    <button onClick={handleReset} className={styles.resetBtn}>
                        Скинути дату
                    </button>
                )}

                <button onClick={() => loadBookings()} className={styles.refreshBtn}>
                    Оновити
                </button>
            </div>

            <div className={styles.tableWrapper}>
                {loading ? (
                    <div className={styles.loading}>Завантаження даних...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Статус</th>
                                <th>Дата</th>
                                <th>Час</th>
                                <th>Клієнт</th>
                                <th>Контакти</th>
                                <th>Гостей</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[booking.status || 'pending']}`}>
                                            {booking.status === 'paid' ? 'ОПЛАЧЕНО' : 'ОЧІКУЄ'}
                                        </span>
                                    </td>
                                    <td>{booking.date}</td>
                                    <td>{booking.start_time} - {booking.end_time}</td>
                                    <td>{booking.customer_name}</td>
                                    <td>
                                        {booking.customer_phone}<br/>
                                        <span style={{fontSize: '12px', opacity: 0.6}}>{booking.customer_email}</span>
                                    </td>
                                    <td>{booking.number_of_people}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            {booking.status !== 'paid' && (
                                                <button 
                                                    className={`${styles.actionBtn} ${styles.confirm}`}
                                                    onClick={() => markAsPaid(booking.id)}
                                                    title="Позначити як оплачено"
                                                >
                                                    Підтвердити
                                                </button>
                                            )}
                                            
                                            <button 
                                                className={`${styles.actionBtn} ${styles.delete}`}
                                                onClick={() => deleteBooking(booking.id)}
                                                title="Видалити"
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{textAlign: 'center', padding: '30px'}}>
                                        {filterDate ? 'На цю дату записів немає' : 'Бронювань не знайдено'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Ручне бронювання</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>×</button>
                        </div>
                        <form onSubmit={createManualBooking} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label>Дата</label>
                                <input 
                                    type="date" 
                                    required
                                    value={manualBooking.date}
                                    onChange={e => setManualBooking({...manualBooking, date: e.target.value})}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Час (Початок)</label>
                                    <select 
                                        value={manualBooking.time}
                                        onChange={e => setManualBooking({...manualBooking, time: e.target.value})}
                                    >
                                        {['11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Гостей</label>
                                    <select 
                                        value={manualBooking.guests}
                                        onChange={e => setManualBooking({...manualBooking, guests: e.target.value})}
                                    >
                                        {Array.from({length: 14}, (_, i) => i + 2).map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Ім'я клієнта</label>
                                <input 
                                    type="text" 
                                    placeholder="Наприклад: Instagram Direct"
                                    value={manualBooking.name}
                                    onChange={e => setManualBooking({...manualBooking, name: e.target.value})}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Телефон</label>
                                <input 
                                    type="text" 
                                    placeholder="+380..."
                                    value={manualBooking.phone}
                                    onChange={e => setManualBooking({...manualBooking, phone: e.target.value})}
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>СТВОРИТИ БРОНЬ (БЕЗ ОПЛАТИ)</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}