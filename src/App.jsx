import {useState,useEffect,useRef,useMemo,useCallback,lazy,Suspense} from 'react';
const Hero3D=lazy(()=>import('./Scenes.jsx').then(m=>({default:m.Hero3D}))),CupPreview=lazy(()=>import('./Scenes.jsx').then(m=>({default:m.CupPreview}))),Floor3D=lazy(()=>import('./Scenes.jsx').then(m=>({default:m.Floor3D})));
const GL=(()=>{try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'))&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&(navigator.hardwareConcurrency||4)>=4}catch{return false}})();

const MENU=[
{n:'Ocean Latte',i:'☕',p:180,c:'Coffee',d:'Creamy espresso with a sea-inspired twist.',best:1,hot:1,sweet:0},
{n:'Cappuccino',i:'☕',p:150,c:'Coffee',d:'Espresso under thick velvety foam.',hot:1,sweet:0},
{n:'Caramel Macchiato',i:'🍮',p:190,c:'Coffee',d:'Vanilla, steamed milk and caramel.',hot:1,sweet:1},
{n:'Cold Brew',i:'🧊',p:170,c:'Cold Drinks',d:'Steeped 18 hours, smooth and bold.',hot:0,sweet:0},
{n:'Blue Ocean Frappe',i:'🧋',p:200,c:'Cold Drinks',d:'Creamy, cold and ocean blue.',best:1,hot:0,sweet:1},
{n:'Iced Mocha',i:'🥤',p:210,c:'Cold Drinks',d:'Chocolate and espresso over ice.',hot:0,sweet:1},
{n:'Butter Croissant',i:'🥐',p:140,c:'Bakes',d:'Golden, flaky, baked each morning.',best:1},
{n:'Cinnamon Roll',i:'🥮',p:160,c:'Bakes',d:'Warm, with cream cheese icing.'},
{n:'Veg Club Sandwich',i:'🥪',p:230,c:'Bakes',d:'Grilled veg, cheese, mint chutney.'},
{n:'Blueberry Cheesecake',i:'🍰',p:220,c:'Desserts',d:'Creamy, topped with fresh blueberries.',best:1},
{n:'Chocolate Brownie',i:'🍫',p:150,c:'Desserts',d:'Fudgy and served warm.'},
{n:'Vegan Berry Tart',i:'🍓',p:200,c:'Desserts',d:'Oat-cream tart, seasonal berries.',vegan:1}];
const DRINK=['Coffee','Cold Drinks'],SIZE={S:-20,M:0,L:40},MILK={Dairy:0,Oat:30,Almond:40},EXTRA={'Extra shot':40,'Whipped cream':30,Caramel:25};
import {LANGV,LANGS,tr,wa,INFO,Weather,Events,Gifts,PhotoWall,InfoModal,Cursor,Admin} from './extras.jsx';
import {flushSync} from 'react-dom';
import {ics,Accent,Install,SeaVideo,useStreak,Deals,Story,BeanGame,Kitchen,QRSheet,A11y} from './more.jsx';
import {TideClock,Creature,Atmosphere,Shells,BeachBook,Persona,Studio,Journal,Community,Sense,Rewards,recordSeason} from './magic.jsx';
const LINKS=['home','menu','mood','book','loyalty','guestbook','contact'];
const ALL=[...LINKS,'deals','studio','story','play','rewards','community','sense','journal','events','gifts','photos'];
const TABLES=Array.from({length:12},(_,i)=>({id:i+1,seats:i%3?4:2,zone:i<4?'Window':i<8?'Indoor':'Terrace',taken:[2,5,9].includes(i+1)}));

function useLS(k,d){const [v,s]=useState(()=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}});useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}},[k,v]);return [v,s]}
function useReveal(){const r=useRef();useEffect(()=>{const o=new IntersectionObserver(e=>e[0].isIntersecting&&(r.current.classList.add('in'),o.disconnect()),{threshold:.1});o.observe(r.current);return()=>o.disconnect()},[]);return r}
const Sec=({id,cls='',children})=>{const r=useReveal();return <section id={id} ref={r} className={'sec reveal '+cls}>{children}</section>};
const Tilt=({children,className=''})=>{const m=e=>{const b=e.currentTarget,r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-6px)`};return <div className={'card '+className} onMouseMove={m} onMouseLeave={e=>e.currentTarget.style.transform=''}>{children}</div>};

export default function App(){
const [dark,setDark]=useLS('dark',matchMedia('(prefers-color-scheme: dark)').matches);
const [lang,setLang]=useLS('lang','en'),[log,setLog]=useLS('log',[]),[bks,setBks]=useLS('bks',[]),[evs,setEvs]=useLS('evs',[]),[gifts,setGifts]=useLS('gifts',[]),[soldOut,setSoldOut]=useLS('soldout',[]),[admin,setAdmin]=useState(false),[kitchen,setKitchen]=useState(false),[bump,setBump]=useState(false),[qr,setQr]=useState(false),[info,setInfo]=useState(null),[cart,setCart]=useLS('cart',[]),[favs,setFavs]=useLS('favs',[]),[stamps,setStamps]=useLS('stamps',0),[notes,setNotes]=useLS('notes',['Best latte by the sea! – Ananya','Came for coffee, stayed for the view.']);
const [cat,setCat]=useState('All'),[q,setQ]=useState(''),[cu,setCu]=useState(null),[drawer,setDrawer]=useState(false),[cmd,setCmd]=useState(false),[chat,setChat]=useState(false),[orders,setOrders]=useState([]),[toasts,setToasts]=useState([]),[menuOpen,setMenuOpen]=useState(false),[sound,setSound]=useState(false),[boom,setBoom]=useState(0),[active,setActive]=useState('home'),[scrolled,setScrolled]=useState(0);
LANGV.v=lang;const flip=()=>{const f=()=>setDark(d=>!d);if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.startViewTransition(()=>flushSync(f));else f()};useEffect(()=>{setBump(true);const t=setTimeout(()=>setBump(false),450);return()=>clearTimeout(t)},[cart.reduce((a,c)=>a+c.q,0)]);const streak=useStreak();useEffect(()=>{const f=e=>{if(e.key==='log')setLog(JSON.parse(e.newValue||'[]'))};addEventListener('storage',f);const tb=new URLSearchParams(location.search).get('table');tb&&setTimeout(()=>toast('Welcome! Ordering for table '+tb+' ☕'),800);return()=>removeEventListener('storage',f)},[]);
useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light'},[dark]);
const toast=useCallback((m,a)=>{const id=Math.random();navigator.vibrate?.(12);setToasts(t=>[...t,{id,m,a}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),a?5500:2800)},[]);
const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenuOpen(false);setCmd(false)};

useEffect(()=>{const k=e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();setCmd(c=>!c)}if(e.key==='Escape'){setCmd(false);setCu(null);setDrawer(false);setMenuOpen(false)}};addEventListener('keydown',k);
const s=()=>setScrolled(scrollY/(document.body.scrollHeight-innerHeight));addEventListener('scroll',s,{passive:true});
const o=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&setActive(e.target.id)),{rootMargin:'-45% 0px -50% 0px'});ALL.forEach(l=>{const el=document.getElementById(l);el&&o.observe(el)});
return()=>{removeEventListener('keydown',k);removeEventListener('scroll',s);o.disconnect()}},[]);

/* ambient ocean sound (generated, no audio file) */
const ac=useRef();
useEffect(()=>{if(!sound){ac.current?.close();ac.current=null;return}
const c=new AudioContext(),b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}
const s=c.createBufferSource();s.buffer=b;s.loop=true;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=500;const g=c.createGain();g.gain.value=.25;const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.12;lg.gain.value=.15;lfo.connect(lg).connect(g.gain);s.connect(f).connect(g).connect(c.destination);s.start();lfo.start();ac.current=c;return()=>c.close()},[sound]);

const total=cart.reduce((a,c)=>a+c.price*c.q,0),count=cart.reduce((a,c)=>a+c.q,0);
const add=it=>{setCart(c=>{const f=c.find(x=>x.k===it.k);return f?c.map(x=>x===f?{...x,q:x.q+1}:x):[...c,{...it,q:1}]});toast('☕ '+it.name+' added')};
const pick=m=>soldOut.includes(m.n)?toast(m.n+' is sold out today'):DRINK.includes(m.c)?setCu({m,size:'M',milk:'Dairy',sweet:50,ex:[]}):add({k:m.n,name:m.n,price:m.p,opts:''});
const place=(opt={})=>{if(!cart.length)return toast('Your order is empty');recordSeason(cart.map(c=>c.name));const drinks=cart.filter(c=>DRINK.includes(MENU.find(m=>m.n===c.name)?.c)).reduce((a,c)=>a+c.q,0);
const id='#'+Math.floor(100+Math.random()*900);setOrders(o=>[...o,{id,t:Date.now(),items:count}]);setLog(l=>[...l,{id,at:Date.now(),items:cart,total:opt.final??total,type:opt.type||'Dine-in',tbl:opt.tbl||'',st:'new'}]);setCart([]);setDrawer(false);
if(drinks){const n=Math.min(9,stamps+drinks);setStamps(n);if(n===9&&stamps<9){setBoom(Date.now());toast('🎁 Next drink is free!')}}toast('🌊 Order '+id+' placed')};

return <>
<div className="progress" style={{transform:`scaleX(${scrolled})`}}/>
<header className="nav"><a href="#home" className="logo" onClick={e=>{e.preventDefault();go('home')}}>☕ Cozy Café</a>
<nav className={menuOpen?'open':''}>{ALL.map(l=><a key={l} href={'#'+l} className={(active===l?'on ':'')+(LINKS.includes(l)?'':'xtra')} onClick={e=>{e.preventDefault();go(l)}}>{tr(l)}</a>)}</nav>
<div className="tools"><OpenBadge/><button className="ib" onClick={()=>setCmd(true)} aria-label="Search (Ctrl+K)">⌘</button><button className="ib" onClick={()=>setSound(!sound)} aria-label="Ocean sound">{sound?'🔊':'🔈'}</button><button className="ib" onClick={flip} aria-label="Theme">{dark?'☀️':'🌙'}</button><button className={'ib '+(bump?'bump':'')} onClick={()=>setDrawer(true)} aria-label="Cart">🛒{count>0&&<b>{count}</b>}</button><select className="lang" value={lang} onChange={e=>setLang(e.target.value)} aria-label="Language">{Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><button className="ib burger" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menu">☰</button></div></header>

<Hero go={go}/>
<Weather pick={pick} menu={MENU}/>
<Menu {...{cat,setCat,q,setQ,favs,setFavs,pick,soldOut,setInfo}}/>
<Deals add={add} pick={pick} menu={MENU} streak={streak} soldOut={soldOut}/>
<Mood pick={pick}/>
<Special pick={()=>pick(MENU[4])}/>
<Booking toast={toast} addBk={b=>setBks(x=>[...x,b])}/>
<Loyalty stamps={stamps} reset={()=>setStamps(0)} boom={boom}/>
<BeachBook notes={notes} setNotes={setNotes} toast={toast}/>
<Studio add={add} toast={toast}/>
<Story/>
<BeanGame onWin={()=>{const d=new Date().toDateString();if(localStorage.getItem('gamed')===d)return toast('Great score! Daily stamp already claimed.');localStorage.setItem('gamed',d);setStamps(s=>Math.min(9,s+1));toast('🏆 You won a loyalty stamp!')}}/>
<Rewards add={add} toast={toast} onStamp={()=>setStamps(s=>Math.min(9,s+1))}/>
<Community bks={bks}/>
<Sense menu={MENU} pick={pick}/>
<Journal menu={MENU}/>
<Events toast={toast} save={e=>setEvs(x=>[...x,e])}/>
<Gifts toast={toast} add={add} save={g=>setGifts(x=>[...x,g])}/>
<PhotoWall toast={toast}/>
<Reviews/>
<Contact go={go} toast={toast}/>
<footer><p>☕ Cozy Café · Made with coffee, calm and a little ocean magic 🌊</p><small>© 2026 Cozy Café · <button className="lnk" onClick={()=>setAdmin(true)}>Staff</button> · <button className="lnk" onClick={()=>setKitchen(true)}>Kitchen</button> · <button className="lnk" onClick={()=>setQr(true)}>Table QR</button> · <A11y/> · <Accent/><Install/></small></footer>

{orders.length>0&&<div className="trackers">{orders.map(o=><Tracker key={o.id} o={o} st={log.find(x=>x.id===o.id)?.st} done={()=>setOrders(x=>x.filter(y=>y!==o))}/>)}</div>}
{cu&&<Custom cu={cu} setCu={setCu} add={add}/>}
<Drawer open={drawer} close={()=>setDrawer(false)} {...{cart,setCart,total,place,add,toast}} last={log[log.length-1]?.items}/>
{cmd&&<Palette close={()=>setCmd(false)} go={go} pick={m=>{setCmd(false);pick(m)}} dark={flip} sound={()=>setSound(!sound)}/>}
{admin&&<Admin close={()=>setAdmin(false)} {...{log,bks,evs,gifts,soldOut,setSoldOut}} menu={MENU}/>}{info&&<InfoModal m={info} close={()=>setInfo(null)} pick={m=>{setInfo(null);pick(m)}}/>}{kitchen&&<Kitchen log={log} setLog={setLog} close={()=>setKitchen(false)}/>}{qr&&<QRSheet close={()=>setQr(false)}/>}<Cursor/>
<Chat open={chat} setOpen={setChat} pick={pick} go={go}/>
<Atmosphere/><Creature toast={toast}/><Shells add={add} toast={toast}/>
<div className="toasts">{toasts.map(t=><div key={t.id} className="toast">{t.m}{t.a&&<button onClick={()=>{t.a.f();setToasts(x=>x.filter(y=>y.id!==t.id))}}>{t.a.l}</button>}</div>)}</div>
{boom>0&&<Confetti key={boom}/>}
<button className={'top '+(scrolled>.08?'on':'')} onClick={()=>scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top">↑</button>
</>}

function OpenBadge(){const [,t]=useState(0);useEffect(()=>{const i=setInterval(()=>t(x=>x+1),60000);return()=>clearInterval(i)},[]);const n=new Date(),d=n.getDay(),h=n.getHours()+n.getMinutes()/60,[o,c]=d===0?[9,21]:d===6?[8,22]:[8,21],f=x=>(x%12||12)+(x<12?' AM':' PM'),op=h>=o&&h<c;return <span className="badge">{op?`🟢 Open · until ${f(c)}`:`🔴 Closed · opens ${f(o)}`}</span>}

function Hero({go}){const [p,setP]=useState({x:0,y:0}),[vid,setVid]=useState(false);return <section id="home" className={'hero '+(vid?'hasvid':'')} onMouseMove={e=>setP({x:e.clientX/innerWidth-.5,y:e.clientY/innerHeight-.5})}>
<SeaVideo onOk={setVid}/><div className="blob b1" style={{transform:`translate(${p.x*40}px,${p.y*40}px)`}}/><div className="blob b2" style={{transform:`translate(${p.x*-60}px,${p.y*-30}px)`}}/>
<div className="hero-in"><p className="kicker">A little escape by the sea</p><h1>Where coffee<br/>meets the <em>sea.</em></h1><p className="lead">Slow mornings, warm coffee and peaceful ocean vibes. Order ahead, pick your table, or let us find your coffee mood.</p>
<div className="btns"><button className="btn" onClick={()=>go('menu')}>{tr('order')}</button><button className="btn ghost" onClick={()=>go('mood')}>{tr('find')}</button></div>
<small className="hint">Tip: press Ctrl+K to search anything</small><TideClock/></div>
{GL?<Suspense fallback={null}><Hero3D noSea={vid}/></Suspense>:<div className="cup" style={{transform:`translate(${p.x*-20}px,${p.y*-20}px)`}}><div className="steam"><i/><i/><i/></div><span>☕</span><p>Today's pick<br/><b>Ocean Latte</b></p></div>}
<svg className="waves" viewBox="0 0 1440 120" preserveAspectRatio="none"><path className="w2" d="M0 80Q180 30 360 80T720 80T1080 80T1440 80V120H0Z"/><path className="w1" d="M0 60Q180 10 360 60T720 60T1080 60T1440 60V120H0Z"/></svg></section>}

function Menu({cat,setCat,q,setQ,favs,setFavs,pick,soldOut,setInfo}){
const [sort,setSort]=useState('default'),[bst,setBst]=useState(false);const l0=MENU.filter(m=>(cat==='All'||(cat==='Favorites'?favs.includes(m.n):m.c===cat))&&(m.n+m.d).toLowerCase().includes(q.toLowerCase())&&(!bst||m.best)),list=sort==='default'?l0:[...l0].sort((x,y)=>sort==='low'?x.p-y.p:sort==='high'?y.p-x.p:(y.best?1:0)-(x.best?1:0));
return <Sec id="menu"><h2>{tr('menuH')}</h2><div className="ctl"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search the menu…" aria-label="Search menu"/><div className="chips"><select className="inp" value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort menu"><option value="default">Sort: Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="best">Bestsellers first</option></select><button className={'chip '+(bst?'on':'')} onClick={()=>setBst(!bst)}>★ Bestsellers only</button></div><div className="chips">{['All','Favorites','Coffee','Cold Drinks','Bakes','Desserts'].map(c=><button key={c} className={'chip '+(cat===c?'on':'')} onClick={()=>setCat(c)}>{c==='Favorites'?'♥ ':''}{c}</button>)}</div></div>
<div className="grid">{list.map(m=><Tilt key={m.n}>{m.best&&<span className="tag">Bestseller</span>}<button className={'fav '+(favs.includes(m.n)?'on':'')} aria-label="Favorite" onClick={()=>setFavs(f=>f.includes(m.n)?f.filter(x=>x!==m.n):[...f,m.n])}>♥</button><div className="ico">{m.i}</div><h3>{m.n} <small>{m.vegan?'🌱':'🟢'}</small></h3><p>{m.d}</p><div className="row"><b>₹{m.p}</b><span className="rr"><button className="ib sm2" onClick={()=>setInfo(m)} aria-label={'Info about '+m.n}>ⓘ</button><button className="btn sm" disabled={soldOut.includes(m.n)} onClick={()=>pick(m)}>{soldOut.includes(m.n)?'Sold out':'Add +'}</button></span></div></Tilt>)}</div>
{!list.length&&<p className="empty">{cat==='Favorites'?'Tap ♥ on a dish to save it here.':'Nothing matches that search. Try another word.'}</p>}</Sec>}

function Mood({pick}){const [a,setA]=useState([]);const Q=[['How is your energy?',['Need a boost','Calm and slow']],['Sweet tooth?',['Yes please','Keep it simple']],['Hot or cold?',['Hot','Cold']]];
let res;if(a.length===3){const sc=m=>(!!m.hot===(a[2]==='Hot'))*3+(!!m.sweet===(a[1]==='Yes please'))*2+(a[0]==='Need a boost'&&/Brew|Latte|Mocha/.test(m.n)?1:0);res=MENU.filter(m=>DRINK.includes(m.c)).sort((x,y)=>sc(y)-sc(x))[0]}
return <Sec id="mood" cls="mood"><h2>What's your coffee mood?</h2><div className="glass quiz">{res?<><div className="big">{res.i}</div><h3>Your match: {res.n}</h3><p>{res.d}</p><div className="btns c"><button className="btn" onClick={()=>pick(res)}>Add to order</button><button className="btn ghost" onClick={()=>setA([])}>Retake</button></div><Persona drink={res}/></>:<><small>Question {a.length+1} of 3</small><h3>{Q[a.length][0]}</h3><div className="btns c">{Q[a.length][1].map(o=><button key={o} className="btn ghost" onClick={()=>setA([...a,o])}>{o}</button>)}</div></>}</div></Sec>}

function Special({pick}){return <section className="special"><div><h2>The Ocean Blue Frappe</h2><p>Creamy milk, vanilla and our signature blue ocean syrup.</p><div className="price">₹200 <small>/ glass</small></div><button className="btn light" onClick={pick}>Try today's special</button></div><div className="orb">🧋</div></section>}

function Booking({toast,addBk}){const [t,setT]=useState(null),[v3,setV3]=useState(true),[hov,setHov]=useState(null),[f,setF]=useState({name:'',phone:'',date:'',guests:2,slot:''}),[done,setDone]=useState(null);const today=new Date().toISOString().split('T')[0],now=new Date().getHours();
const SL=['09:00','11:00','13:00','15:00','17:00','19:00','20:30'];const set=k=>e=>setF({...f,[k]:e.target.value});
const ok=()=>{if(!t||!f.name||!f.date||!f.slot||f.phone.replace(/\D/g,'').length<10||f.guests>t.seats)return toast(t&&f.guests>t.seats?`Table ${t.id} seats ${t.seats}. Pick a bigger table.`:'Pick a table and fill in every field (10-digit phone)');{const b={...f,t,ref:'CC'+Math.floor(1000+Math.random()*9000)};setDone(b);addBk(b)}};
return <Sec id="book"><h2>{tr('bookH')}</h2><p className="sub">Tap a free table, then choose a date and time.</p>
{done?<div className="glass ticket"><h3>Booked 🌊</h3><p><b>{done.name}</b> · Table {done.t.id} ({done.t.zone})<br/>{done.date} at {done.slot} · {done.guests} guest(s)<br/>Ref {done.ref}</p><button className="btn" onClick={()=>{setDone(null);setT(null)}}>Book another</button> <a className="btn ghost" target="_blank" rel="noopener" href={wa(`Hi! Table ${done.t.id} booked: ${done.name}, ${done.date} ${done.slot}, ${done.guests} guests. Ref ${done.ref}`)}>Confirm on WhatsApp</a> <a className="btn ghost" href={ics(done)} download="cozy-cafe-booking.ics">Add to calendar</a></div>:
<div className="book"><div>{GL&&<div className="vt"><button className={'chip '+(v3?'on':'')} onClick={()=>setV3(true)}>3D view</button><button className={'chip '+(!v3?'on':'')} onClick={()=>setV3(false)}>2D map</button></div>}{v3&&GL?<Suspense fallback={<div className="floor3d"/>}><Floor3D tables={TABLES} sel={t} onSel={setT} onHover={setHov}/></Suspense>:<div className="floor">{TABLES.map(x=><button key={x.id} disabled={x.taken} className={'tbl '+(t?.id===x.id?'on':'')} onClick={()=>setT(x)} aria-label={`Table ${x.id}, ${x.seats} seats, ${x.zone}`}><b>{x.id}</b><small>{x.taken?'Taken':x.seats+' seats'}</small><i>{x.zone}</i></button>)}</div>}<p className="sub hov">{hov?`Table ${hov.id} · ${hov.zone} · ${hov.taken?'taken':hov.seats+' seats'}`:t?`Selected: table ${t.id} (${t.zone}, ${t.seats} seats)`:'Hover or tap a table'}</p></div>
<div className="glass form"><input placeholder="Your name" value={f.name} onChange={set('name')}/><input type="tel" placeholder="Phone number" value={f.phone} onChange={set('phone')}/><input type="date" min={today} value={f.date} onChange={set('date')}/><input type="number" min="1" max="8" value={f.guests} onChange={set('guests')} aria-label="Guests"/>
<div className="chips">{SL.map(s=><button key={s} className={'chip '+(f.slot===s?'on':'')} disabled={f.date===today&&+s.slice(0,2)<=now} onClick={()=>setF({...f,slot:s})}>{s}</button>)}</div><button className="btn" onClick={ok}>{t?`Reserve table ${t.id}`:'Choose a table'}</button></div></div>}</Sec>}

function Loyalty({stamps,reset}){const [f,setF]=useState(false),prev=useRef(stamps);useEffect(()=>{if(stamps>prev.current)setF(true);prev.current=stamps},[stamps]);
return <Sec id="loyalty" cls="center"><h2>Buy 8, get the 9th free.</h2><p className="sub">Tap the card to flip it. Every drink you order adds a stamp.</p>
<div className={'flip '+(f?'f':'')} role="button" tabIndex={0} aria-label="Flip loyalty card" onClick={()=>setF(!f)} onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&setF(!f)}><div className="fi"><div className="ff front"><h3>☕ Cozy Café</h3><p>Loyalty card</p><b>{stamps} / 9</b></div><div className="ff back"><div className="stamps">{Array.from({length:9},(_,i)=><div key={i} className={'stamp '+(i<stamps?'on ':'')+(i===8?'free':'')}>{i===8?'🎁':i<stamps?<span>🫘</span>:''}</div>)}</div></div></div></div>
<button className="btn ghost" onClick={reset}>Reset card</button></Sec>}

function Guestbook({notes,setNotes,toast}){const [v,setV]=useState('');const last=notes.slice(-8);return <Sec id="guestbook" cls="center"><h2>Message in a bottle.</h2><div className="sea">{last.map((n,i)=><button key={i} className="bottle" style={{left:`${8+(i*37)%80}%`,top:`${12+(i*53)%60}%`,animationDelay:i*.6+'s'}} onClick={()=>toast('🍾 '+n)} aria-label="Read note">🍾</button>)}</div><form className="gf" onSubmit={e=>{e.preventDefault();if(!v.trim())return;setNotes([...notes,v.trim()]);setV('');toast('🍾 Your bottle is floating out to sea')}}><input maxLength="80" value={v} onChange={e=>setV(e.target.value)} placeholder="Leave a note for the sea…"/><button className="btn">Send bottle</button></form></Sec>}

function Reviews(){const R=[['Ananya','The atmosphere is so peaceful. The coffee was amazing and I loved the ocean theme!'],['Rahul','Such a beautiful café. Perfect to study, relax or spend time with friends.'],['Meera','The Ocean Latte is definitely my new favorite drink.']];const [i,setI]=useState(0);useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%3),4500);return()=>clearInterval(t)},[]);
return <Sec id="reviews" cls="center"><h2>People love their cozy moments.</h2><div className="rv"><div className="glass" key={i}><div className="stars">★★★★★</div><p>“{R[i][1]}”</p><b>{R[i][0]}</b></div><div className="dots">{R.map((_,j)=><button key={j} className={j===i?'on':''} onClick={()=>setI(j)} aria-label={'Review '+(j+1)}/>)}</div></div></Sec>}

function Contact({toast}){return <Sec id="contact" cls="contact"><div><h2>Find your way to Cozy Café.</h2><p>📍 24 Ocean View Street, Chennai<br/>📞 +91 98765 43210<br/>✉ hello@cozycafe.com</p><div className="btns"><a className="btn ghost" href="tel:+919876543210">Call</a><a className="btn ghost" target="_blank" rel="noopener" href="https://wa.me/919876543210">WhatsApp</a><a className="btn ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=24+Ocean+View+Street+Chennai">Directions</a></div>
<form className="gf" onSubmit={e=>{e.preventDefault();e.target.reset();toast('💌 Subscribed to our weekly special')}}><input type="email" required placeholder="Email for our weekly special"/><button className="btn">Subscribe</button></form></div>
<div className="glass hours"><iframe title="Map" loading="lazy" src="https://maps.google.com/maps?q=Chennai+Marina+Beach&output=embed"/><h3>Opening hours</h3><p>Mon–Fri <span>8 AM – 9 PM</span></p><p>Saturday <span>8 AM – 10 PM</span></p><p>Sunday <span>9 AM – 9 PM</span></p></div></Sec>}

function Custom({cu,setCu,add}){const {m}=cu,price=m.p+SIZE[cu.size]+MILK[cu.milk]+cu.ex.reduce((a,x)=>a+EXTRA[x],0);const B=(g,o)=>Object.keys(o).map(k=><button key={k} className={'chip '+((g==='ex'?cu.ex.includes(k):cu[g]===k)?'on':'')} onClick={()=>setCu(g==='ex'?{...cu,ex:cu.ex.includes(k)?cu.ex.filter(x=>x!==k):[...cu.ex,k]}:{...cu,[g]:k})}>{k}</button>);
return <div className="modal" onClick={()=>setCu(null)}><div className="sheet" onClick={e=>e.stopPropagation()}><button className="x" onClick={()=>setCu(null)} aria-label="Close">×</button><h3>{m.i} {m.n}</h3>{GL&&<Suspense fallback={<div className="cuprev"/>}><CupPreview size={cu.size} milk={cu.milk} ex={cu.ex}/></Suspense>}<label>Size</label><div className="chips">{B('size',SIZE)}</div><label>Milk</label><div className="chips">{B('milk',MILK)}</div><label>Sweetness: {cu.sweet}%</label><input type="range" min="0" max="100" step="25" value={cu.sweet} onChange={e=>setCu({...cu,sweet:+e.target.value})}/><label>Extras</label><div className="chips">{B('ex',EXTRA)}</div>
<button className="btn" onClick={()=>{const o=`${cu.size}, ${cu.milk}, ${cu.sweet}% sweet${cu.ex.length?', '+cu.ex.join(', '):''}`;add({k:m.n+o,name:m.n,price,opts:o});setCu(null)}}>Add to order · ₹{price}</button></div></div>}

function Drawer({open,close,cart,setCart,total,place,add,last,toast}){const [tip,setTip]=useState(0),[code,setCode]=useState(''),[ok,setOk]=useState(false),[type,setType]=useState('Dine-in'),[tbl,setTbl]=useState(new URLSearchParams(location.search).get('table')||''),[split,setSplit]=useState(1);
const hh=new Date().getHours()>=15&&new Date().getHours()<17,disc=ok||hh?Math.round(total*.1):0,tipAmt=Math.round((total-disc)*tip/100),final=total-disc+tipAmt;
const qty=(k,d)=>{const it=cart.find(x=>x.k===k);if(!it)return;if(it.q+d<1){setCart(c=>c.filter(x=>x.k!==k));toast('Removed '+it.name,{l:'Undo',f:()=>setCart(c=>[...c,it])})}else setCart(c=>c.map(x=>x.k===k?{...x,q:x.q+d}:x))};
const pair=cart.length?INFO[cart[0].name]?.[2]:null,pm=pair&&!cart.some(c=>c.name===pair)&&MENU.find(m=>m.n===pair);
const msg=`Hi Cozy Café! ${type}${type==='Dine-in'&&tbl?' (table '+tbl+')':''} order:\n${cart.map(c=>`${c.q}x ${c.name}${c.opts?' ('+c.opts+')':''}`).join('\n')}\nTotal ₹${final}`;
return <><div className={'veil '+(open?'on':'')} onClick={close}/><aside className={'drawer '+(open?'on':'')}><div className="dh"><h3>{tr('yo')}</h3><button className="x" onClick={close} aria-label="Close cart">×</button></div>
<div className="di">{cart.length?cart.map(c=><div key={c.k} className="ci"><div><b>{c.name}</b><small>{c.opts}</small>₹{c.price}</div><div className="qty"><button onClick={()=>qty(c.k,-1)} aria-label="Less">−</button>{c.q}<button onClick={()=>qty(c.k,1)} aria-label="More">+</button></div></div>):<><p className="empty">Your order is empty. Add something from the menu.</p>{last&&<button className="btn ghost" onClick={()=>setCart(last)}>Reorder my last order</button>}</>}
{pm&&<div className="pair">Pairs well: <b>{pm.i} {pm.n}</b> ₹{pm.p}<button className="btn sm" onClick={()=>add({k:pm.n,name:pm.n,price:pm.p,opts:''})}>Add</button></div>}</div>
<div className="df"><div className="chips">{['Dine-in','Takeaway'].map(t=><button key={t} className={'chip '+(type===t?'on':'')} onClick={()=>setType(t)}>{t}</button>)}{type==='Dine-in'&&<input className="tn" type="number" min="1" max="12" placeholder="Table no." value={tbl} onChange={e=>setTbl(e.target.value)}/>}</div>
<div className="chips"><span>Tip</span>{[0,5,10].map(t=><button key={t} className={'chip '+(tip===t?'on':'')} onClick={()=>setTip(t)}>{t}%</button>)}</div>
<div className="promo"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Promo code (try COZY10)"/><button className="btn ghost sm" onClick={()=>setOk(code.trim().toUpperCase()==='COZY10')}>Apply</button></div>
{disc>0&&<div className="line"><span>{hh&&!ok?'Happy hour 10%':'Discount'}</span><span>−₹{disc}</span></div>}{tipAmt>0&&<div className="line"><span>Tip</span><span>₹{tipAmt}</span></div>}
<div className="line"><span>Split between <button className="qb" onClick={()=>setSplit(Math.max(1,split-1))} aria-label="Fewer">−</button>{split}<button className="qb" onClick={()=>setSplit(split+1)} aria-label="More">+</button></span><span>{split>1?`₹${Math.ceil(final/split)} each`:''}</span></div>
<div className="line tot"><span>{tr('total')}</span><span>₹{final}</span></div><button className="btn" onClick={()=>{place({type,final,tbl});setTip(0);setCode('');setOk(false);setSplit(1)}}>{tr('place')}</button>{cart.length>0&&<a className="btn ghost" target="_blank" rel="noopener" href={wa(msg)}>Send order on WhatsApp</a>}</div></aside></>}

function Tracker({o,done,st}){const [s,setS]=useState(0),[sec,setSec]=useState(0),L=['Received','Brewing','Ready ☕'],step=Math.max(s,{preparing:1,ready:2}[st]||0);
useEffect(()=>{if(typeof Notification!=='undefined'&&Notification.permission==='default')Notification.requestPermission();const a=setTimeout(()=>setS(1),4000),b=setTimeout(()=>setS(2),12000),c=setTimeout(done,40000),t=setInterval(()=>setSec(x=>x+1),1000);return()=>{[a,b,c].forEach(clearTimeout);clearInterval(t)}},[]);
useEffect(()=>{if(step===2){navigator.vibrate?.([80,40,80]);if(typeof Notification!=='undefined'&&Notification.permission==='granted')new Notification('Cozy Café',{body:'Order '+o.id+' is ready ☕'})}},[step]);
return <div className="track glass"><b>Order {o.id}</b><div className="pb"><i style={{width:(step===2?100:Math.min(95,sec/12*100))+'%'}}/></div><div className="steps">{L.map((l,i)=><span key={l} className={i<=step?'on':''}>{l}</span>)}</div><small>{step<2?'Ready in about '+Math.max(1,12-sec)+'s (demo timing, or when the kitchen screen marks it ready)':'Come pick it up!'}</small></div>}

function Palette({close,go,pick,dark,sound}){const [q,setQ]=useState(''),[ix,setIx]=useState(0);const A=[...ALL.map(l=>({t:'Go to '+l,f:()=>go(l)})),{t:'Toggle day / night',f:()=>{dark();close()}},{t:'Toggle ocean sound',f:()=>{sound();close()}},...MENU.map(m=>({t:`Order ${m.n} · ₹${m.p}`,f:()=>pick(m)}))].filter(a=>a.t.toLowerCase().includes(q.toLowerCase())).slice(0,8);
return <div className="modal pt" onClick={close}><div className="sheet pal" onClick={e=>e.stopPropagation()}><input autoFocus value={q} onChange={e=>{setQ(e.target.value);setIx(0)}} placeholder="Type a command or a dish…" onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setIx(i=>Math.min(A.length-1,i+1))}else if(e.key==='ArrowUp'){e.preventDefault();setIx(i=>Math.max(0,i-1))}else if(e.key==='Enter')A[ix]?.f()}}/>{A.map((a,i)=><button key={a.t} className={i===ix?'on':''} onClick={a.f}>{a.t}</button>)}{!A.length&&<p className="empty">No match</p>}</div></div>}

function Chat({open,setOpen,pick,go}){const [m,setM]=useState([{b:1,t:"Hi! I'm Brew, your barista bot. Ask for a recommendation, hours, or booking."}]),[v,setV]=useState(''),[typing,setTyping]=useState(false),end=useRef();useEffect(()=>end.current?.scrollIntoView(),[m]);
const reply=t=>{t=t.toLowerCase();if(/hour|open|close/.test(t))return 'We open 8 AM–9 PM Mon–Fri, 8 AM–10 PM Saturday and 9 AM–9 PM Sunday.';if(/book|table|reserve/.test(t)){go('book');return 'Opening our table map for you.'}if(/vegan/.test(t))return 'Our Vegan Berry Tart 🍓 is fully vegan, and every drink can be made with oat or almond milk.';if(/sweet/.test(t))return 'Try the Caramel Macchiato or Blue Ocean Frappe.';if(/strong|energy|boost/.test(t))return 'The Cold Brew is our strongest. Add an extra shot for more.';if(/cheap|budget/.test(t))return 'Brownie ₹150 and Cappuccino ₹150 are our best-value picks.';const f=MENU.find(x=>t.includes(x.n.toLowerCase().split(' ')[0]));if(f){pick(f);return `Great choice. ${f.n} is ₹${f.p}.`}return 'I can help with hours, bookings, vegan options or drink picks. Try “something sweet”.'};
const ask=t=>{setM(x=>[...x,{t}]);setTyping(true);setTimeout(()=>{setM(x=>[...x,{b:1,t:reply(t)}]);setTyping(false)},700)};const send=e=>{e.preventDefault();if(!v.trim())return;ask(v);setV('')};
return <><button className="chatbtn" onClick={()=>setOpen(!open)} aria-label="Chat with barista bot">{open?'×':'💬'}</button>{open&&<div className="chat glass"><div className="cm">{m.map((x,i)=><p key={i} className={x.b?'bot':'me'}>{x.t}</p>)}{typing&&<p className="bot typ">…</p>}<div ref={end}/></div><div className="chips qr">{['Opening hours','Something sweet','Vegan options','Book a table'].map(c=><button key={c} className="chip" onClick={()=>ask(c)}>{c}</button>)}</div><form onSubmit={send}><input value={v} onChange={e=>setV(e.target.value)} placeholder="Ask Brew…"/></form></div>}</>}

function Confetti(){return <>{Array.from({length:60},(_,i)=><i key={i} className="cf" style={{left:Math.random()*100+'vw',background:['#087fa8','#f4b942','#78c8df','#e0533d'][i%4],animationDelay:Math.random()*.6+'s'}}/>)}</>}
