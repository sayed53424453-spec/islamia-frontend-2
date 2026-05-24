'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/api';

export default function AppLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/login'); return; }
    setUser(JSON.parse(u));
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard',  label: 'ড্যাশবোর্ড' },
    { href: '/buy',        label: 'কাপড় কিনুন' },
    { href: '/tracking',   label: 'অর্ডার ট্র্যাকিং' },
    { href: '/profile',    label: 'প্রোফাইল' },
    { href: '/help',       label: 'সহায়তা' },
  ];

  return (
    <div style={{minHeight:'100vh',background:'#f4f6fb',fontFamily:"'Hind Siliguri',sans-serif"}}>
      {/* Header */}
      <header style={{background:'#fff',borderBottom:'2px solid #dde3ed',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:300,boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
        <div style={{width:80}}></div>
        <Link href="/dashboard" style={{textAlign:'center',textDecoration:'none'}}>
          <div style={{fontSize:'1.9rem',fontWeight:700,color:'#e31e24',lineHeight:1,letterSpacing:'-1px'}}>ইসলামিয়া</div>
          <div style={{fontSize:'.8rem',color:'#555'}}>টেইলার্স এন্ড ফেব্রিক্স</div>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'#e8f0fe',display:'flex',alignItems:'center',justifyContent:'center'}}>👤</div>
          <div>
            <div style={{fontWeight:600,fontSize:'.88rem'}}>{user?.name||'ব্যবহারকারী'}</div>
            <div onClick={handleLogout} style={{fontSize:'.75rem',color:'#64748b',cursor:'pointer',textDecoration:'underline'}}>লগআউট</div>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav style={{background:'#fff',borderBottom:'1px solid #dde3ed',display:'flex',justifyContent:'center',overflowX:'auto'}}>
        {navItems.map(n => (
          <Link key={n.href} href={n.href} style={{
            padding:'11px 22px',textDecoration:'none',color: pathname===n.href ? '#1a6fc4':'#0f172a',
            fontSize:'.92rem',fontWeight:500,borderBottom: pathname===n.href ? '3px solid #1a6fc4':'3px solid transparent',
            background: pathname===n.href ? '#f0f6ff':'transparent',whiteSpace:'nowrap'
          }}>{n.label}</Link>
        ))}
      </nav>

      <main style={{maxWidth:1000,margin:'0 auto',padding:'22px 14px 70px'}}>
        {children}
      </main>

      <footer style={{textAlign:'center',padding:14,color:'#64748b',fontSize:'.78rem',borderTop:'1px solid #dde3ed',background:'#fff'}}>
        © ২০২৪ ইসলামিয়া টেইলার্স এন্ড ফেব্রিক্স | সর্বস্বত্ব সংরক্ষিত
      </footer>
    </div>
  );
}
