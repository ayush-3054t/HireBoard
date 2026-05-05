import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { dashboardFor } from '../utils/routes';

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const isLogin = mode === 'login';

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const resolvedRole = await (isLogin ? login({ ...form, role }) : register({ ...form, role }));
      navigate(dashboardFor(resolvedRole));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <form className="panel space-y-4" onSubmit={submit}>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{isLogin ? 'Login' : 'Register'}</h1>
          <p className="text-sm text-stone-500">{isLogin ? 'Access your role dashboard.' : 'Create a candidate or recruiter account.'}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['user', 'recruiter', ...(isLogin ? ['admin'] : [])].map((item) => (
            <button type="button" key={item} onClick={() => setRole(item)} className={role === item ? 'btn-primary' : 'btn-secondary'}>
              {item}
            </button>
          ))}
        </div>
        {!isLogin && <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />}
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}</button>
        <p className="text-center text-sm text-stone-500">
          {isLogin ? 'Need an account? ' : 'Already registered? '}
          <Link className="font-semibold text-brand" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Register' : 'Login'}</Link>
        </p>
      </form>
    </main>
  );
}
