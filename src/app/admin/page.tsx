'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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
            
            if (!activeDateFilter) {
                calculateStats(data || []);
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
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
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id);

            if (error) throw error;
            loadBookings(); 
        } catch (error) {
            alert('Помилка видалення запису');
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
                <button onClick={handleLogout} className={styles.logoutBtn}>Вийти</button>
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
                
                {/* Кнопка Скинути (з'являється тільки якщо вибрана дата) */}
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
                                    <td>{booking.date}</td>
                                    <td>{booking.start_time} - {booking.end_time}</td>
                                    <td>{booking.customer_name}</td>
                                    <td>
                                        {booking.customer_phone}<br/>
                                        <span style={{fontSize: '12px', opacity: 0.6}}>{booking.customer_email}</span>
                                    </td>
                                    <td>{booking.number_of_people}</td>
                                    <td>
                                        <button 
                                            className={`${styles.actionBtn} ${styles.delete}`}
                                            onClick={() => deleteBooking(booking.id)}
                                        >
                                            Видалити
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{textAlign: 'center', padding: '30px'}}>
                                        {filterDate ? 'На цю дату записів немає' : 'Бронювань не знайдено'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}