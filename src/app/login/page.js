'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(''); setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (e) {
      setError(e.response?.data?.message || 'ইমেল বা পাসওয়ার্ড ভুল');
    } finally { setLoading(false); }
  };

  const s = {
    wrap:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#f8faff 60%,#fde8e8)',fontFamily:"'Hind Siliguri',sans-serif"},
    box:{background:'#fff',borderRadius:18,padding:'42px 34px',maxWidth:410,width:'100%',boxShadow:'0 8px 40px rgba(0,0,0,0.12)',textAlign:'center'},
    field:{width:'100%',border:'1.5px solid #dde3ed',borderRadius:8,padding:'12px 14px',fontFamily:'inherit',fontSize:'.97rem',marginBottom:13,outline:'none'},
    btn:{width:'100%',padding:13,background:'#1a6fc4',color:'#fff',border:'none',borderRadius:8,fontFamily:'inherit',fontSize:'1rem',fontWeight:600,cursor:'pointer'},
    err:{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:7,padding:'9px 13px',color:'#dc2626',fontSize:'.85rem',marginBottom:12},
  };

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={{fontSize:'2.8rem',fontWeight:700,color:'#e31e24',lineHeight:1}}>ইসলামিয়া</div>
        <div style={{fontSize:'1rem',color:'#444',marginBottom:28}}>টেইলার্স এন্ড ফেব্রিক্স</div>
        {error && <div style={s.err}>{error}</div>}
        <input style={s.field} type="email" placeholder="ইমেল" value={form.email}
          onChange={e=>setForm({...form,email:e.target.value})}
          onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        <input style={s.field} type="password" placeholder="পাসওয়ার্ড" value={form.password}
          onChange={e=>setForm({...form,password:e.target.value})}
          onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        <button style={s.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'লগিন হচ্ছে...' : 'লগিন'}
        </button>
        <p style={{marginTop:14,fontSize:'.82rem',color:'#64748b'}}>
          অ্যাকাউন্ট নেই? <a href="/register" style={{color:'#1a6fc4'}}>নতুন অ্যাকাউন্ট তৈরি করুন</a>
        </p>
      </div>
    </div>
  );
}
