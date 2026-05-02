import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function App({ Component, pageProps }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !['/', '/login', '/register'].includes(router.pathname)) {
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            if (!['/login', '/register', '/'].includes(router.pathname)) {
              router.push('/login');
            }
          }
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [router.pathname]);

  if (!authChecked) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border" role="status"></div></div>;
  }

  return <Component {...pageProps} user={user} setUser={setUser} />;
}
