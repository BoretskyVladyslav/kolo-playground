'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './admin.module.scss';

const ADMIN_EMAIL = 'Kolo.playground@gmail.com';
const ADMIN_PASS = 'Koloahmatovoy50';

export default function AdminPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState('');

	const [bookings, setBookings] = useState<any[]>([]);
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
	};

	const loadBookings = async () => {
		setLoading(true);
		try {
			let query = supabase
				.from('bookings')
				.select('*')
				.order('date', { ascending: false })
				.order('start_time', { ascending: false });

			if (filterDate) {
				query = query.eq('date', filterDate);
			}

			const { data, error } = await query;

			if (error) throw error;
			
			setBookings(data || []);
			calculateStats(data || []);
		} catch (error) {
			console.error('Error loading bookings:', error);
		} finally {
			setLoading(false);
		}
	};

	const calculateStats = (data: any[]) => {
		const today = new Date().toLocaleDateString('en-CA');
		const todayCount = data.filter(b => b.date === today).length;
		setStats({
			total: data.length,
			today: todayCount
		});
	};

	const deleteBooking = async (id: number) => {
		if (!confirm('Ви впевнені?')) return;

		try {
			const { error } = await supabase
				.from('bookings')
				.delete()
				.eq('id', id);

			if (error) throw error;
			loadBookings();
		} catch (error) {
			alert('Помилка видалення');
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
					<span className={styles.label}>На сьогодні</span>
				</div>
			</div>

			<div className={styles.filters}>
				<input 
					type="date" 
					value={filterDate} 
					onChange={(e) => setFilterDate(e.target.value)} 
				/>
				<button onClick={loadBookings} className={styles.refreshBtn}>Оновити</button>
			</div>

			<div className={styles.tableWrapper}>
				{loading ? (
					<div className={styles.loading}>Завантаження...</div>
				) : (
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Дата</th>
								<th>Час</th>
								<th>Ім'я</th>
								<th>Телефон</th>
								<th>Людей</th>
								<th>Дії</th>
							</tr>
						</thead>
						<tbody>
							{bookings.map((booking) => (
								<tr key={booking.id}>
									<td>{booking.date}</td>
									<td>{booking.start_time} - {booking.end_time}</td>
									<td>{booking.customer_name}</td>
									<td>{booking.customer_phone}</td>
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
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}