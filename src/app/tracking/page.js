'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { getOrders, trackOrder } from '@/lib/api';

const statusMap = {
  pending:       'অপেক্ষায়',
  confirmed:     'নিশ্চিত',
  cutting:       'কাটা হচ্ছে',
  stitching:     'সেলাই হচ্ছে',
  quality_check: 'মান পরীক্ষা',
  ready:         'তৈরি',
  delivered:     'ডেলিভারি হয়েছে',
  cancelled:     'বাতিল',
};
const allSteps = ['pending','confirmed','cutting','stitching','quality_check','ready','delivered'];

const badge = (st) => {
  const m = {
    delivered:{bg:'#dcfce7',c:'#15803d'},
    cancelled:{bg:'#fee2e2',c:'#dc2626'},
    pending:{bg:'#fef9c3',c:'#854d0e'},
  };
  const s = m[st]||{bg:'#dbeafe',c:'#1d4ed8'};
  return <span style={{padding:'3px 11px',borderRadius:20,fontSize:'.75rem',fontWeight:700,background:s.bg,color:s.c}}>{statusMap[st]||st}</span>;
};

export default function TrackingPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackId, setTrackId] = useState('');
  const [found, setFound]     = useState(null);
  const [trackErr, setTrackErr] = useState('');

  useEffect(() => {
    getOrders().then(r=>setOrders(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const doTrack = async () => {
    setTrackErr(''); setFound(null);
    if (!trackId.trim()) return;
    try {
      const r = await trackOrder(trackId.trim());
      setFound(r.data);
    } catch { setTrackErr('এই আইডিতে কোনো অর্ডার পাওয়া যায়নি'); }
  };

  return (
    <AppLayout>
      <div style={{textAlign:'center',fontSize:'1.35rem',fontWeight:700,background:'#fff',border:'1.5px solid #dde3ed',borderRadius:10,padding:13,marginBottom:20}}>
        অর্ডার ট্র্যাকিং
      </div>

      {/* Search */}
      <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #dde3ed',padding:20,marginBottom:18}}>
        <div style={{display:'flex',gap:9}}>
          <input value={trackId} onChange={e=>setTrackId(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&doTrack()}
            placeholder="অর্ডার আইডি লিখুন (যেমন: ITF-2024-0042)"
            style={{flex:1,border:'1.5px solid #dde3ed',borderRadius:8,padding:'10px 13px',fontFamily:'inherit',fontSize:'.93rem',outline:'none'}} />
          <button onClick={doTrack} style={{padding:'10px 20px',background:'#1a6fc4',color:'#fff',border:'none',borderRadius:8,fontFamily:'inherit',fontSize:'.93rem',fontWeight:600,cursor:'pointer'}}>
            খুঁজুন
          </button>
        </div>
        {trackErr && <p style={{color:'#dc2626',fontSize:'.85rem',marginTop:9}}>{trackErr}</p>}
        {found && (
          <div style={{marginTop:14,border:'1.5px solid #1a6fc4',borderRadius:10,padding:15,background:'#f0f6ff'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontWeight:700,color:'#1a6fc4'}}>#{found.order_number}</span>
              {badge(found.status)}
            </div>
            <div style={{paddingLeft:18}}>
              {allSteps.map((step,i)=>{
                const idx = allSteps.indexOf(found.status);
                const done = i<=idx;
                const active = i===idx;
                return (
                  <div key={step} style={{position:'relative',paddingBottom:12,fontSize:'.83rem'}}>
                    <span style={{position:'absolute',left:-14,top:5,width:7,height:7,borderRadius:'50%',background:active?'#1a6fc4':done?'#16a34a':'#dde3ed',display:'block',boxShadow:active?'0 0 0 3px #bfdbfe':''}}></span>
                    <span style={{fontWeight:done?600:400,color:done?'#0f172a':'#94a3b8'}}>{statusMap[step]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* All orders */}
      <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #dde3ed',padding:20}}>
        <div style={{fontSize:'1.05rem',fontWeight:700,marginBottom:16,paddingBottom:9,borderBottom:'2px solid #dde3ed',display:'flex',alignItems:'center',gap:7}}>
          <span style={{display:'inline-block',width:4,height:18,background:'#e31e24',borderRadius:2}}></span>
          সকল অর্ডার
        </div>
        {loading && <p style={{color:'#64748b',fontSize:'.88rem'}}>লোড হচ্ছে...</p>}
        {!loading && orders.length===0 && <p style={{color:'#64748b',fontSize:'.88rem'}}>এখনো কোনো অর্ডার নেই</p>}
        {orders.map(o=>(
          <div key={o.id} style={{border:'1.5px solid #dde3ed',borderRadius:10,padding:15,marginBottom:13}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:9}}>
              <span style={{fontWeight:700,color:'#1a6fc4',fontSize:'.95rem'}}>#{o.order_number}</span>
              {badge(o.status)}
            </div>
            <div style={{fontSize:'.82rem',color:'#64748b',marginBottom:11}}>
              {o.fabric?.name} • ৳{Number(o.total_amount).toLocaleString()} • {new Date(o.created_at).toLocaleDateString('bn-BD')}
            </div>
            {/* Mini timeline */}
            <div style={{paddingLeft:18}}>
              {allSteps.map((step,i)=>{
                const idx=allSteps.indexOf(o.status);
                const done=i<=idx; const active=i===idx;
                return (
                  <div key={step} style={{position:'relative',paddingBottom:8,fontSize:'.78rem'}}>
                    <span style={{position:'absolute',left:-14,top:4,width:6,height:6,borderRadius:'50%',background:active?'#1a6fc4':done?'#16a34a':'#dde3ed',display:'block'}}></span>
                    <span style={{color:done?'#0f172a':'#94a3b8'}}>{statusMap[step]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
