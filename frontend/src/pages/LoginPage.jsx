import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to login');
      
      login(data.access_token, data.email);
      navigate('vault');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#080808',
        border: '1px solid var(--border)',
        borderRadius: 24, padding: '40px 32px',
        backdropFilter: 'blur(10px)',
        animation: 'scaleIn 0.4s ease-out',
        boxShadow: '12px 12px 0px var(--orange), 0 32px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--orange-dim)',
            border: '1px solid var(--orange-border)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Shield size={24} color="var(--orange)" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Welcome Back</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>Enter your credentials to access your vault</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,59,92,0.1)', border: '1px solid rgba(255,59,92,0.2)',
            color: '#FF3B5C', padding: '12px 16px', borderRadius: 12,
            fontSize: 13, marginBottom: 24, textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', marginLeft: 4 }}>Email Address</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14,
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--orange-border)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', marginLeft: 4 }}>Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14,
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--orange-border)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 8, padding: '12px', background: 'var(--orange)',
              color: '#fff', border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if(!loading) e.target.style.background = 'var(--orange2)'; e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { if(!loading) e.target.style.background = 'var(--orange)'; e.target.style.transform = 'none' }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: 'var(--text3)' }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('register')} style={{
            background: 'none', border: 'none', color: 'var(--orange)',
            fontWeight: 600, cursor: 'pointer', padding: 0,
          }}>
            Create one for free
          </button>
        </div>
      </div>
    </div>
  );
}
