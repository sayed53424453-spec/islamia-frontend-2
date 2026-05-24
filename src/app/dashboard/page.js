'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { getOrders } from '@/lib/api';
import Link from 'next/link';

const statusMap = {
  pending:       {label:'অপেক্ষায়',      bg:'#fef9c3',color:'#854d0e'},
  confirmed:     {label:'নিশ্চিত',        bg:'#dbeafe',color:'#1d4ed8'},
  cutting:       {label:'কাটা হচ্ছে',     bg:'#dbeafe',color:'#1d4ed8'},
  stitching:     {label:'সেলাই হচ্ছে',    bg:'#dbeafe',color:'#1d4ed8'},
  quality_check: {label:'মান পরীক্ষা',    bg:'#fef9c3',color:'#854d0e'},
  ready:         {label:'তৈরি',           bg:'#dcfce7',color:'#15803d'},
  delivered:     {label:'ডেলিভারি হয়েছে', bg:'#dcfce7',color:'#15803d'},
  cancelled:     {label:'বাতিল',          bg:'#fee2e2',color:'#dc2626'},
};

export default function Dashboard() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(r => setOrders(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const done    = orders.filter(o=>o.status==='delivered').length;
  const active  = orders.filter(o=>!['delivered','cancelled'].includes(o.status)).length;
  const total   = orders.reduce((s,o)=>s+Number(o.total_amount),0);

  return (
    <AppLayout>
      <div style={{textAlign:'center',fontSize:'1.35rem',fontWeight:700,background:'#fff',border:'1.5px solid #dde3ed',borderRadius:10,padding:13,marginBottom:20,boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
        স্বাগতম! 👋
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:18}}>
        {[
          {ico:'📦',val:orders.length,lbl:'মোট অর্ডার'},
          {ico:'⏳',val:active,        lbl:'চলমান'},
          {ico:'✅',val:done,          lbl:'সম্পন্ন'},
          {ico:'💰',val:`৳${total.toLocaleString()}`,lbl:'মোট ব্যয়',sm:true},
        ].map((s,i)=>(
          <div key={i} style={{background:'#fff',border:'1.5px solid #dde3ed',borderRadius:12,padding:16,textAlign:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
            <div style={{fontSize:'1.8rem',marginBottom:6}}>{s.ico}</div>
            <div style={{fontSize:s.sm?'1.3rem':'1.7rem',fontWeight:700,color:'#1a6fc4'}}>{s.val}</div>
            <div style={{fontSize:'.78rem',color:'#64748b',marginTop:2}}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #dde3ed',padding:20,marginBottom:18,boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
        <div style={{fontSize:'1.05rem',fontWeight:700,marginBottom:16,paddingBottom:9,borderBottom:'2px solid #dde3ed',display:'flex',alignItems:'center',gap:7}}>
          <span style={{display:'inline-block',width:4,height:18,background:'#e31e24',borderRadius:2}}></span>
          সাম্প্রতিক অর্ডার
        </div>
        {loading && <p style={{color:'#64748b',fontSize:'.88rem'}}>লোড হচ্ছে...</p>}
        {!loading && orders.length===0 && <p style={{color:'#64748b',fontSize:'.88rem'}}>এখনো কোনো অর্ডার নেই</p>}
        {orders.slice(0,3).map(o=>{
          const st=statusMap[o.status]||statusMap.pending;
          return (
            <div key={o.id} style={{border:'1.5px solid #dde3ed',borderRadius:10,padding:15,marginBottom:13}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{fontWeight:700,color:'#1a6fc4',fontSize:'.95rem'}}>#{o.order_number}</span>
                <span style={{padding:'3px 11px',borderRadius:20,fontSize:'.75rem',fontWeight:700,background:st.bg,color:st.color}}>{st.label}</span>
              </div>
              <div style={{fontSize:'.82rem',color:'#64748b'}}>{o.fabric?.name} • ৳{Number(o.total_amount).toLocaleString()}</div>
            </div>
          );
        })}
        <div style={{textAlign:'center',marginTop:12}}>
          <Link href="/tracking" style={{display:'inline-block',padding:'8px 18px',background:'#fff',color:'#1a6fc4',border:'1.5px solid #1a6fc4',borderRadius:7,textDecoration:'none',fontWeight:600,fontSize:'.87rem'}}>
            সব অর্ডার দেখুন
          </Link>
        </div>
      </div>

      <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #dde3ed',padding:20,boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
        <div style={{fontSize:'1.05rem',fontWeight:700,marginBottom:14,paddingBottom:9,borderBottom:'2px solid #dde3ed',display:'flex',alignItems:'center',gap:7}}>
          <span style={{display:'inline-block',width:4,height:18,background:'#e31e24',borderRadius:2}}></span>
          নতুন অর্ডার করুন
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <Link href="/buy" style={{padding:'9px 20px',background:'#e31e24',color:'#fff',borderRadius:7,textDecoration:'none',fontWeight:600,fontSize:'.88rem'}}>পাঞ্জাবি অর্ডার →</Link>
          <Link href="/buy" style={{padding:'9px 20px',background:'#0f172a',color:'#fff',borderRadius:7,textDecoration:'none',fontWeight:600,fontSize:'.88rem'}}>কাপড় দেখুন</Link>
        </div>
      </div>
    </AppLayout>
  );
}
