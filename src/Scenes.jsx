import {useRef,useMemo,useEffect} from 'react';
import {Canvas,useFrame} from '@react-three/fiber';
import * as THREE from 'three';

const prof=[[0,0],[.55,0],[.7,.08],[.95,1.2],[1.02,1.3],[.96,1.32],[.9,1.2],[.62,.2],[0,.15]].map(([x,y])=>new THREE.Vector2(x,y));
const lathe=new THREE.LatheGeometry(prof,48);
const MILKC={Dairy:'#c9a27a',Oat:'#b98a54',Almond:'#c4a77d'};

function Cup({scale=1,coffee='#6b3f1d',cream=false,caramel=false,shot=false}){
return <group scale={scale}>
<mesh geometry={lathe}><meshStandardMaterial color="#fdfdfd" roughness={.2} side={THREE.DoubleSide}/></mesh>
<mesh position={[0,1.14,0]} rotation-x={-Math.PI/2}><circleGeometry args={[.9,48]}/><meshStandardMaterial color={coffee} roughness={.35}/></mesh>
<mesh position={[.98,.75,0]} rotation-z={-Math.PI/2}><torusGeometry args={[.33,.08,12,24,Math.PI]}/><meshStandardMaterial color="#fdfdfd" roughness={.2}/></mesh>
<mesh position={[0,-.05,0]}><cylinderGeometry args={[1.5,1.25,.1,48]}/><meshStandardMaterial color="#f3f8fa" roughness={.3}/></mesh>
{caramel&&<mesh position={[0,1.16,0]} rotation-x={Math.PI/2}><torusGeometry args={[.55,.035,8,40]}/><meshStandardMaterial color="#c47a2c"/></mesh>}
{cream&&[[1.22,.45],[1.5,.33],[1.74,.2]].map(([y,r],i)=><mesh key={i} position={[0,y,0]}><sphereGeometry args={[r,24,16]}/><meshStandardMaterial color="#fffaf0" roughness={.6}/></mesh>)}
{shot&&<mesh position={[1.9,.28,.4]}><cylinderGeometry args={[.28,.2,.45,24]}/><meshStandardMaterial color="#fdfdfd"/></mesh>}
</group>}

const mouse={x:0,y:0};
if(typeof window!=='undefined')addEventListener('mousemove',e=>{mouse.x=e.clientX/innerWidth-.5;mouse.y=e.clientY/innerHeight-.5});
const night=new THREE.Color('#0b2e48'),palettes={dawn:'#4fc3e0',day:'#1e9bc4',dusk:'#e8884a'};
function targetSea(){if(document.documentElement.dataset.theme==='dark')return night;const h=new Date().getHours();return new THREE.Color(h<9?palettes.dawn:h<17?palettes.day:h<19.5?palettes.dusk:'#0b2e48')}

function Ocean(){const m=useRef(),geo=useMemo(()=>new THREE.PlaneGeometry(26,26,44,44),[]);
useFrame(({clock})=>{const t=clock.elapsedTime,p=geo.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,Math.sin(p.getX(i)*.7+t)*.18+Math.cos(p.getY(i)*.9+t*1.2)*.12);p.needsUpdate=true;geo.computeVertexNormals();m.current.color.lerp(targetSea(),.03)});
return <mesh geometry={geo} rotation-x={-Math.PI/2} position={[0,-.25,0]}><meshStandardMaterial ref={m} color="#1e9bc4" flatShading roughness={.3} metalness={.15}/></mesh>}

function Steam(){const N=36,a=useMemo(()=>new Float32Array(N*3),[]),seed=useMemo(()=>Array.from({length:N},()=>Math.random()),[]),g=useRef();
useFrame(({clock})=>{const t=clock.elapsedTime;for(let i=0;i<N;i++){const k=(t*.35+seed[i])%1;a[i*3]=Math.sin(k*6+i)*.25*k;a[i*3+1]=1.3+k*1.6;a[i*3+2]=Math.cos(k*5+i)*.2*k}g.current.attributes.position.needsUpdate=true});
return <points><bufferGeometry ref={g}><bufferAttribute attach="attributes-position" count={N} array={a} itemSize={3}/></bufferGeometry><pointsMaterial size={.16} color="#fff" transparent opacity={.45} depthWrite={false}/></points>}

function Beans(){const g=useRef(),b=useMemo(()=>Array.from({length:9},(_,i)=>({x:(Math.random()-.5)*9,y:Math.random()*3+.5,z:-Math.random()*4-.5,s:.12+Math.random()*.12,o:i})),[]);
useFrame(({clock})=>{const t=clock.elapsedTime;g.current.children.forEach((c,i)=>{c.position.y=b[i].y+Math.sin(t+b[i].o)*.3;c.rotation.x=t*.6+i;c.rotation.y=t*.4})});
return <group ref={g}>{b.map((q,i)=><mesh key={i} position={[q.x,q.y,q.z]} scale={[q.s,q.s*1.4,q.s]}><sphereGeometry args={[1,12,10]}/><meshStandardMaterial color="#4a2a14" roughness={.5}/></mesh>)}</group>}

function HeroScene({noSea}){const g=useRef();
useFrame(({clock},d)=>{const t=clock.elapsedTime,o=g.current;o.position.y=.25+Math.sin(t*1.2)*.08;o.rotation.y+=d*.35;o.rotation.x+=(mouse.y*.35-o.rotation.x)*.05;o.rotation.z+=(-mouse.x*.25-o.rotation.z)*.05});
return <><ambientLight intensity={.8}/><directionalLight position={[4,6,3]} intensity={1.6}/><pointLight position={[-4,2,2]} intensity={.8} color="#ffcf9a"/>
<group ref={g}><Cup coffee="#6b3f1d"/><Steam/></group><Beans/>{!noSea&&<Ocean/>}</>}
export function Hero3D({noSea}){return <div className="h3d" aria-hidden="true"><Canvas camera={{position:[0,2.4,6.4],fov:40}} dpr={[1,1.75]} gl={{alpha:true,antialias:true}}><HeroScene noSea={noSea}/></Canvas></div>}

function Spin({children}){const g=useRef();useFrame((_,d)=>g.current.rotation.y+=d*.6);return <group ref={g}>{children}</group>}
export function CupPreview({size,milk,ex}){const sc={S:.85,M:1,L:1.2}[size];
return <div className="cuprev" aria-hidden="true"><Canvas camera={{position:[0,2.2,5.2],fov:38}} dpr={[1,1.5]}><ambientLight intensity={.9}/><directionalLight position={[3,5,3]} intensity={1.5}/>
<group position={[0,-.6,0]}><Spin><Cup scale={sc} coffee={MILKC[milk]} cream={ex.includes('Whipped cream')} caramel={ex.includes('Caramel')} shot={ex.includes('Extra shot')}/></Spin></group></Canvas></div>}

function Table({t,sel,onSel,onHover}){const c=t.taken?'#8a9aa3':sel?'#087fa8':'#f4e3c8';
return <group position={[((t.id-1)%4-1.5)*2.4,0,(Math.floor((t.id-1)/4)-1)*2.3]} onClick={e=>{e.stopPropagation();!t.taken&&onSel(t)}} onPointerOver={e=>{e.stopPropagation();onHover(t);document.body.style.cursor=t.taken?'not-allowed':'pointer'}} onPointerOut={()=>{onHover(null);document.body.style.cursor=''}}>
<mesh position={[0,.7,0]}><cylinderGeometry args={[.75,.75,.1,32]}/><meshStandardMaterial color={c} roughness={.5} emissive={sel?'#0a6a8e':'#000'} emissiveIntensity={.4}/></mesh>
<mesh position={[0,.35,0]}><cylinderGeometry args={[.08,.08,.7,10]}/><meshStandardMaterial color="#5a4030"/></mesh>
{Array.from({length:t.seats},(_,i)=>{const a=i/t.seats*Math.PI*2;return <mesh key={i} position={[Math.cos(a)*1.05,.25,Math.sin(a)*1.05]}><cylinderGeometry args={[.22,.2,.5,16]}/><meshStandardMaterial color={t.taken?'#6b7a82':'#2f7f99'}/></mesh>})}</group>}
function Room({tables,sel,onSel,onHover,rot}){const g=useRef();useFrame(()=>{g.current.rotation.y+=(rot.current-g.current.rotation.y)*.1});
return <><ambientLight intensity={.9}/><directionalLight position={[5,8,4]} intensity={1.3}/>
<group ref={g} rotation-x={0}><mesh position={[0,-.1,0]}><boxGeometry args={[11,.2,8.6]}/><meshStandardMaterial color="#d9c3a3"/></mesh>
<mesh position={[0,-.08,3.1]}><boxGeometry args={[11,.22,2.4]}/><meshStandardMaterial color="#7a5a3a"/></mesh>
<mesh position={[0,1,-4.3]}><boxGeometry args={[11,2,.1]}/><meshStandardMaterial color="#8fd3e6" transparent opacity={.4}/></mesh>
{tables.map(t=><Table key={t.id} t={t} sel={sel?.id===t.id} onSel={onSel} onHover={onHover}/>)}</group></>}
export function Floor3D({tables,sel,onSel,onHover}){const rot=useRef(0),d=useRef(null);
return <div className="floor3d" onPointerDown={e=>d.current=e.clientX} onPointerMove={e=>{if(d.current!=null){rot.current=Math.max(-.9,Math.min(.9,rot.current+(e.clientX-d.current)*.008));d.current=e.clientX}}} onPointerUp={()=>d.current=null} onPointerLeave={()=>d.current=null}>
<Canvas camera={{position:[0,8,9],fov:40}} dpr={[1,1.6]} onCreated={({camera})=>camera.lookAt(0,0,0)}><Room {...{tables,sel,onSel,onHover,rot}}/></Canvas><small className="hint3">Drag to turn the room · tap a table · windows at the back, terrace at the front</small></div>}

function Sway({children}){const g=useRef();useFrame(({clock})=>g.current.rotation.y=Math.sin(clock.elapsedTime*.8)*.7);return <group ref={g}>{children}</group>}
export function NameCup({name}){const tex=useMemo(()=>{const c=document.createElement('canvas');c.width=512;c.height=160;const x=c.getContext('2d');x.fillStyle='#ead7b5';x.fillRect(0,0,512,160);x.fillStyle='#063b59';x.font='bold 72px serif';x.textAlign='center';x.textBaseline='middle';x.fillText((name||'Your name').slice(0,10),256,66);x.font='22px sans-serif';x.fillText('Cozy Café',256,126);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t},[name]);
return <div className="cuprev big" aria-hidden="true"><Canvas camera={{position:[0,2.2,5.2],fov:38}} dpr={[1,1.5]}><ambientLight intensity={.9}/><directionalLight position={[3,5,3]} intensity={1.5}/><group position={[0,-.6,0]}><Sway><Cup/><mesh position={[0,.65,0]}><cylinderGeometry args={[.9,.79,.5,32,1,true,-1,2]}/><meshStandardMaterial map={tex} roughness={.6}/></mesh></Sway></group></Canvas></div>}

function Bottle({i,n,onPick,on}){const g=useRef(),x=((i*37+11)%100/100-.5)*9,z=((i*53+7)%100/100)*3.2-.6;
useFrame(({clock})=>{g.current.position.y=.2+Math.sin(clock.elapsedTime*1.3+i)*.04;g.current.scale.setScalar(on?1.3:1)});
return <group ref={g} position={[x,.2,z]} rotation-y={i*1.7} onClick={e=>{e.stopPropagation();onPick(n)}} onPointerOver={()=>document.body.style.cursor='pointer'} onPointerOut={()=>document.body.style.cursor=''}>
<mesh rotation-z={Math.PI/2}><cylinderGeometry args={[.2,.2,.8,16]}/><meshStandardMaterial color="#7bd1a8" transparent opacity={.75} emissive={on?'#ffe08a':'#000'} emissiveIntensity={.6}/></mesh>
<mesh position={[.55,0,0]} rotation-z={Math.PI/2}><cylinderGeometry args={[.07,.1,.35,12]}/><meshStandardMaterial color="#7bd1a8" transparent opacity={.75}/></mesh><mesh position={[.76,0,0]}><sphereGeometry args={[.07,10,8]}/><meshStandardMaterial color="#b98a54"/></mesh></group>}
function BeachScene({notes,base,onPick,sel}){const foam=useRef();useFrame(({clock})=>{foam.current.position.z=-1.6+Math.sin(clock.elapsedTime*.9)*.35});
return <><ambientLight intensity={.9}/><directionalLight position={[4,6,3]} intensity={1.4}/>
<mesh rotation-x={-Math.PI/2} position={[0,0,1]}><planeGeometry args={[16,7]}/><meshStandardMaterial color="#e8d3a6"/></mesh>
<mesh rotation-x={-Math.PI/2} position={[0,.01,-5]}><planeGeometry args={[16,7]}/><meshStandardMaterial color="#2d9fc0"/></mesh>
<mesh ref={foam} rotation-x={-Math.PI/2} position={[0,.02,-1.6]}><planeGeometry args={[16,.3]}/><meshStandardMaterial color="#ffffff" transparent opacity={.8}/></mesh>
{notes.map((_,k)=><Bottle key={base+k} i={base+k} n={base+k} onPick={onPick} on={sel===base+k}/>)}</>}
export function Beach3D({notes,base,onPick,sel}){return <div className="beach3d"><Canvas camera={{position:[0,4.5,7],fov:45}} dpr={[1,1.5]} onCreated={({camera})=>camera.lookAt(0,0,-.5)}><BeachScene {...{notes,base,onPick,sel}}/></Canvas></div>}
