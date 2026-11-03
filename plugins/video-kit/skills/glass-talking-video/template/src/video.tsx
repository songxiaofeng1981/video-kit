// 样式与动效。复用时不改这个文件，只改 content.ts。
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, OffthreadVideo, Loop, Sequence, staticFile, useCurrentFrame, interpolate, spring} from 'remotion';
import {content, type IconName, type Scene} from './content';
export const FPS=30;
const F='PingFang SC, Microsoft YaHei, sans-serif';
const gold='#ffce80';
const cl={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ramp=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],cl);
const ease=(f:number,d=0)=>spring({frame:Math.max(0,f-d),fps:FPS,config:{damping:23,stiffness:115,mass:.85}});
const {layout}=content;

// ---- 时间线与校验 ----
// 每个镜头的起点、帧数、捷径出现帧（chart 是缩到上半屏的帧，twoShots 是两项出现的帧）、柱子/时间线节点出现帧、差距标注帧（都相对镜头起点），由 index.tsx 在加载时算好传进来
export type Slot={from:number,frames:number,shortcut:number,bars:number[],gap:number};
export type Sub={from:number,to:number,text:string};
export type Props={videoFrames:number,timeline:Slot[],subs:Sub[]};
const icons=['person','film','edit','clock','back','spark','grid','phone','server','chip'];
// 卡片强调色：gold 黄（强调，默认）/ green 绿（新观点、结论）/ red 红（旧观点、风险）
const tones={gold,green:'#7fe3a2',red:'#ff8f85'};
const stepColors={...tones,plain:'#a9bacb'};
const barColors={blue:'#65baff',gold:'#f1c66d',violet:'#b8a5ff',green:'#63db89',red:'#e8736b'};
const minSeconds={glass:2,twoShots:3,canvas:6,chart:6,timeline:4,clean:1,outro:3};
export function buildTimeline(videoFrames:number):Slot[]{
	const err:string[]=[];
	const sc=content.scenes;
	if(!content.video) err.push('video 没填视频文件名');
	if(!sc.length) err.push('scenes 至少要有一个镜头');
	const byAt=sc.every(s=>s.at!==undefined), bySec=sc.every(s=>s.seconds!==undefined);
	if(sc.length&&!byAt&&!bySec) err.push('每个镜头都写 at（口播），或者都写 seconds（Demo），不能混用');
	const slots:Slot[]=[];
	let from=0;
	sc.forEach((s,i)=>{
		const at=`第 ${i+1} 个镜头（${s.type}）`;
		if(!(s.type in minSeconds)) {err.push(`${at}：type 只能是 glass / twoShots / canvas / chart / timeline / clean / outro`);return;}
		if(byAt) from=i===0?0:Math.round(s.at!*FPS);
		const end=byAt?(i+1<sc.length?Math.round(sc[i+1].at!*FPS):videoFrames):from+Math.round((s.seconds??0)*FPS);
		const frames=end-from;
		if(frames<minSeconds[s.type]*FPS) err.push(`${at}：时长 ${(frames/FPS).toFixed(1)} 秒，至少要 ${minSeconds[s.type]} 秒${byAt?'（检查 at 是否递增、是否超出视频长度）':''}`);
		if('tone' in s&&s.tone!==undefined&&!(s.tone in tones)) err.push(`${at}：没有颜色 "${s.tone}"，可用 ${Object.keys(tones).join(' / ')}`);
		// 时间写的是视频第几秒，换成相对镜头起点的帧
		const rel=(sec:number|undefined,dflt:number,what:string,lo=0,hi=frames-15)=>{if(sec===undefined) return dflt;const v=Math.round(sec*FPS)-from;if(v<lo||v>hi) err.push(`${at}：${what} 要在这个镜头的时间范围内`);return v};
		let shortcut=125;
		if(s.type==='twoShots') shortcut=rel(s.itemsAt,35,'itemsAt');
		if(s.type==='canvas'&&s.shortcutAt!==undefined){
			shortcut=Math.round(s.shortcutAt*FPS)-from;
			if(shortcut<60||shortcut>frames-30) err.push(`${at}：shortcutAt 要在镜头开始 2 秒后、结束前 1 秒内`);
		}
		let bars:number[]=[], gap=frames;
		if(s.type==='chart'){
			// 没写 at 的柱子从第 20 帧起每隔 25 帧升起一根
			if(s.bars.length<2||s.bars.length>4) err.push(`${at}：bars 要有 2–4 根柱子`);
			s.bars.forEach((b,j)=>{if(!(b.color in barColors)) err.push(`${at}：没有颜色 "${b.color}"，可用 ${Object.keys(barColors).join(' / ')}`);if(!(b.value>0)) err.push(`${at}：第 ${j+1} 根柱子的 value 要大于 0`)});
			bars=s.bars.map((b,j)=>rel(b.at,20+j*25,`第 ${j+1} 根柱子的 at`));
			shortcut=rel(s.shrinkAt,frames,'shrinkAt',60,frames-30);
			if(s.gap) gap=rel(s.gap.at,Math.max(...bars)+60,'gap.at');
		}
		if(s.type==='timeline'){
			// 没写 at 的节点从第 15 帧起每隔 40 帧出现一个
			if(s.steps.length<2||s.steps.length>4) err.push(`${at}：steps 要有 2–4 个节点`);
			s.steps.forEach((st,j)=>{if(st.tone&&!(st.tone in stepColors)) err.push(`${at}：第 ${j+1} 个节点没有颜色 "${st.tone}"，可用 ${Object.keys(stepColors).join(' / ')}`)});
			bars=s.steps.map((st,j)=>rel(st.at,15+j*40,`第 ${j+1} 个节点的 at`));
		}
		const items=s.type==='twoShots'?s.items:s.type==='canvas'?s.loop:[];
		if(s.type==='twoShots'&&items.length!==2) err.push(`${at}：items 必须正好 2 项`);
		if(s.type==='canvas'&&items.length!==4) err.push(`${at}：loop 必须正好 4 个节点`);
		items.forEach(it=>{if(!icons.includes(it.icon)) err.push(`${at}：没有图标 "${it.icon}"，可用 ${icons.join(' / ')}`)});
		slots.push({from,frames:Math.max(1,frames),shortcut,bars,gap});
		from=end;
	});
	if(err.length) throw new Error('content.ts 需要修改：'+err.join('；'));
	return slots;
}
export function parseSrt(text:string):Sub[]{
	const t=(s:string)=>{const [h,m,rest]=s.trim().split(':');const [sec,ms]=rest.split(/[,.]/);return Math.round((+h*3600+ +m*60+ +sec+ +ms/1000)*FPS)};
	return text.replace(/\r/g,'').split(/\n\s*\n/).map(b=>b.trim().split('\n')).filter(l=>l.some(x=>x.includes('-->'))).map(l=>{const i=l.findIndex(x=>x.includes('-->'));const [a,b]=l[i].split('-->');return {from:t(a),to:t(b),text:l.slice(i+1).join(' ')}}).filter(s=>s.text);
}

// 文字里 [方括号] 显示为强调色（默认金色），\n 换行
function Rich({text,color=gold}:{text:string,color?:string}){return <>{text.split('\n').map((line,i)=><React.Fragment key={i}>{i>0&&<br/>}{line.split(/(\[[^\]]*\])/).map((part,j)=>part.startsWith('[')&&part.endsWith(']')?<span key={j} style={{color}}>{part.slice(1,-1)}</span>:part)}</React.Fragment>)}</>}

function Icon({name,size=42}:{name:IconName,size?:number}) {return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{name==='person'?<><circle cx="24" cy="14" r="6" fill="currentColor" stroke="none"/><path d="M13 39V30a11 11 0 0 1 22 0v9Z" fill="currentColor" stroke="none"/></>:name==='film'?<><rect x="7" y="8" width="34" height="32" rx="5"/><path d="M16 8v32M32 8v32M7 18h9M7 30h9M32 18h9M32 30h9"/></>:name==='edit'?<><path d="m13 34 3-10L32 8l8 8-16 16-11 2ZM28 12l8 8M10 40h28"/></>:name==='clock'?<><circle cx="24" cy="24" r="17"/><path d="M24 13v12l8 5"/></>:name==='back'?<><path d="m17 11-9 9 9 9M9 20h19a11 11 0 0 1 0 22"/></>:name==='spark'?<><path d="m24 6 4 13 14 5-14 4-4 14-5-14L6 24l13-5Z"/><path d="m38 4 1 5 5 1-5 2-1 5-2-5-5-2 5-1Z"/></>:name==='phone'?<><rect x="13" y="4" width="22" height="40" rx="5"/><path d="M21 9h6M22 38h4"/></>:name==='server'?<><rect x="7" y="7" width="34" height="14" rx="3"/><rect x="7" y="27" width="34" height="14" rx="3"/><path d="M13 14h.01M13 34h.01M21 14h14M21 34h14"/></>:name==='chip'?<><rect x="13" y="13" width="22" height="22" rx="3"/><rect x="19" y="19" width="10" height="10" rx="1.5" fill="currentColor" stroke="none"/><path d="M19 13V6M29 13V6M19 42v-7M29 42v-7M13 19H6M13 29H6M42 19h-7M42 29h-7"/></>:<><rect x="6" y="8" width="36" height="30" rx="5"/><path d="M18 8v30M30 8v30M10 15h4M22 15h4M34 15h4"/></>}</svg>}

// 人物视频：start 是本镜头在整片里的起点帧；continuous 时从这里接着播，播完循环
const Clip=createContext({start:0,videoFrames:1});
function Source(){
	const {start,videoFrames}=useContext(Clip);
	const s=content.continuous?start%videoFrames:0;
	const v=(trim:number)=><OffthreadVideo muted={!content.audio} src={staticFile(content.video)} trimBefore={trim} style={{width:'100%',height:'100%',objectFit:'cover'}}/>;
	return <><Sequence durationInFrames={videoFrames-s}>{v(s)}</Sequence><Sequence from={videoFrames-s}><Loop durationInFrames={videoFrames}>{v(0)}</Loop></Sequence></>;
}

function Label({num,title}:{num:string,title:string}){return <div style={{position:'absolute',left:40,top:125,display:'flex',alignItems:'center',gap:12,minWidth:320,minHeight:62,padding:'12px 20px 12px 12px',background:'linear-gradient(120deg,#353533,#151a20)',border:'1px solid #ffffff35',borderRadius:15,boxShadow:'0 8px 20px #0006'}}><div style={{color:'#fff0c3',background:'linear-gradient(135deg,#dba338,#805515)',borderRadius:10,padding:7,display:'flex'}}><Icon name="film" size={30}/></div><div><div style={{color:'#f7cc5a',fontSize:11,fontWeight:800,letterSpacing:2}}>{num} · {content.series}</div><div style={{fontSize:22,fontWeight:800}}>{title}</div></div></div>}
const glass:React.CSSProperties={position:'absolute',left:64,width:952,boxSizing:'border-box',borderRadius:44,border:'1.6px solid rgba(255,255,255,.65)',background:'linear-gradient(118deg,rgba(245,231,218,.24),rgba(239,218,218,.10) 57%,rgba(136,135,166,.12))',backdropFilter:'blur(19px) saturate(.85)',WebkitBackdropFilter:'blur(19px) saturate(.85)',boxShadow:'inset 0 1px 0 #ffffff25,0 12px 40px #241b1510',padding:'45px 51px'};
function Glass({children,eyebrow,height=286,top=1310,delay=12}:{children:React.ReactNode,eyebrow:string,height?:number,top?:number,delay?:number}){const f=useCurrentFrame();const e=ease(f,delay);return <div style={{...glass,top:top+layout.cardShift,height,opacity:ramp(f,delay,delay+10),transform:`translateY(${(1-e)*42}px) scale(${.975+.025*e})`,transformOrigin:'50% 70%'}}><div style={{fontSize:20,fontWeight:700,letterSpacing:3.5,color:'#f2ece6bb',marginBottom:17}}>{eyebrow}</div>{children}</div>}
function Caption({children,top=1530}:{children:React.ReactNode,top?:number}){return <div style={{position:'absolute',top,left:25,right:25,textAlign:'center',fontSize:48,fontWeight:900,lineHeight:1.4,textShadow:'0 3px 2px #0009,0 0 6px #0009'}}>{children}</div>}

type TalkingScene=Exclude<Scene,{type:'canvas'|'chart'|'timeline'}>;
// clean：只有人物和字幕，不加章节签和卡片
function Talking({scene:s,slot}:{scene:TalkingScene,slot:Slot}){const f=useCurrentFrame();const tone=s.type==='clean'?gold:tones[s.tone??'gold'];const I=slot.shortcut;return <AbsoluteFill style={{fontFamily:F,color:'#fff',background:'#332b29'}}><AbsoluteFill><Source/></AbsoluteFill><AbsoluteFill style={{background:'linear-gradient(180deg,#00000010 0%,transparent 65%,#00000018)'}}/>
{s.type!=='clean'&&<Label {...s.label}/>}
{s.type==='clean'?null:s.type==='glass'?<Glass eyebrow={s.eyebrow}><div style={{fontSize:58,fontWeight:850,lineHeight:1.18,letterSpacing:-1.5}}><Rich text={s.title} color={tone}/></div></Glass>
:s.type==='twoShots'?<Glass eyebrow={s.eyebrow} height={365} top={1270}><div style={{fontSize:49,fontWeight:850}}><Rich text={s.title} color={tone}/></div><div style={{display:'flex',alignItems:'center',gap:25,marginTop:25}}>{s.items.map(({icon,title,sub},i)=><div key={i} style={{display:'flex',alignItems:'center',gap:14,opacity:ramp(f,I+i*18,I+12+i*18),transform:`translateY(${(1-ease(f,I+i*18))*18}px)`}}><div style={{padding:10,borderRadius:16,background:'#ffffff18',color:'#fff5dc'}}><Icon name={icon}/></div><div style={{fontSize:25,fontWeight:700}}>{title}<div style={{fontSize:17,color:'#ffdfa8',marginTop:3}}>{sub}</div></div>{i===0&&<span style={{padding:'0 10px',color:'#ffffff80'}}>→</span>}</div>)}</div></Glass>
:<Glass eyebrow={s.eyebrow} height={330} top={1290}><div style={{fontSize:54,fontWeight:850,lineHeight:1.25}}><Rich text={s.title} color={tone}/></div><div style={{width:interpolate(f,[35,85],[0,800],cl),height:4,background:`linear-gradient(90deg,${tone},#fff1d7)`,marginTop:24,borderRadius:3}}/></Glass>}
{!content.subtitles&&s.caption&&<Caption top={layout.captionTop}>{s.caption}</Caption>}</AbsoluteFill>}

function Node({x,y,icon,title,sub,color='#d5ae4d',show=0}:{x:number,y:number,icon:IconName,title:string,sub?:string,color?:string,show?:number}){const f=useCurrentFrame();return <div style={{position:'absolute',left:x,top:y,width:340,display:'flex',gap:16,alignItems:'center',padding:'20px',borderRadius:25,border:`1.5px solid ${color}66`,background:'linear-gradient(115deg,#27303ce6,#131923ee)',boxShadow:`0 0 22px ${color}15`,opacity:ramp(f,show,show+12),transform:`translateY(${(1-ease(f,show))*22}px)`}}><div style={{padding:10,borderRadius:13,display:'flex',background:`${color}26`,color}}><Icon name={icon} size={36}/></div><div style={{fontSize:28,fontWeight:800}}>{title}{sub&&<div style={{fontSize:17,color:'#9ba6b4',marginTop:5}}>{sub}</div>}</div></div>}
// 深色画布背景、点阵网格、右下角圆形头像（canvas 和 chart 共用）
const board:React.CSSProperties={fontFamily:F,color:'#fff',background:'radial-gradient(ellipse at 30% 15%,#132333 0%,#0e141e 34%,#07090d 80%)'};
const grid:React.CSSProperties={opacity:.23,backgroundImage:'radial-gradient(#91a5b9 1.4px,transparent 1.6px),linear-gradient(#6e80900d 1px,transparent 1px),linear-gradient(90deg,#6e80900d 1px,transparent 1px)',backgroundSize:'123px 123px',backgroundPosition:'30px 30px'};
const Pip=({opacity=1}:{opacity?:number})=> <div style={{position:'absolute',right:42,top:1185,width:286,height:286,borderRadius:'50%',border:'2px solid #a8a29d99',padding:8,boxSizing:'border-box',background:'#39363288',boxShadow:'inset 0 0 0 7px #aaaaaa20',opacity}}><div style={{width:'100%',height:'100%',borderRadius:'50%',overflow:'hidden',position:'relative'}}><div style={{position:'absolute',width:'100%',height:470,top:layout.pipTop}}><Source/></div></div></div>;
const loopSpots=[[0,170],[460,170],[460,600],[0,600]];
// S：绿色捷径出现的帧。红色流程和四个节点在它之前依次出现（S=125 时与原版节奏一致）
function Canvas({scene:s,S}:{scene:Extract<Scene,{type:'canvas'}>,S:number}){const f=useCurrentFrame();const draw=ramp(f,30,S-25);const shortcut=ramp(f,S,S+30);const step=(S-37)/4;return <AbsoluteFill style={board}><AbsoluteFill style={grid}/><Label {...s.label}/><div style={{position:'absolute',right:36,top:65,fontSize:12,color:'#919bab',letterSpacing:2}}>{s.corner}</div><div style={{position:'absolute',top:260,left:110,width:860,transform:`scale(${interpolate(f,[0,180],[.94,1],cl)})`,transformOrigin:'50% 25%'}}><div style={{fontSize:20,color:'#c1c8d2',letterSpacing:2}}>{s.kicker}</div><div style={{fontSize:53,fontWeight:850,marginTop:10}}><Rich text={s.title}/></div><svg width="860" height="830" style={{position:'absolute',top:105,left:0}}><ellipse cx="430" cy="355" rx="320" ry="285" stroke="#d85e5a" fill="none" strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-draw} opacity={1-shortcut*.65}/><path d="M430 28V560" stroke="#50da85" strokeWidth="5" strokeDasharray="532" strokeDashoffset={532*(1-shortcut)} style={{filter:'drop-shadow(0 0 9px #36e474)'}}/></svg><div style={{position:'relative',height:850,opacity:1-shortcut*.6}}>{s.loop.map((n,i)=><Node key={i} x={loopSpots[i][0]} y={loopSpots[i][1]} icon={n.icon} title={n.title} sub={n.sub} color="#db6961" show={10+i*step}/>)}</div><div style={{position:'absolute',top:450,left:135,width:590,boxSizing:'border-box',padding:'25px 28px',borderRadius:68,border:'2px solid #63db89',background:'linear-gradient(110deg,#235338,#172c24)',boxShadow:'0 0 35px #43db6940,inset 0 0 18px #48db7920',display:'flex',gap:21,alignItems:'center',opacity:shortcut,transform:`scale(${.9+.1*ease(f,S)})`}}><div style={{padding:15,borderRadius:24,background:'#5cde8244',display:'flex'}}><Icon name="spark" size={48}/></div><div><div style={{fontSize:38,fontWeight:850}}>{s.shortcut.title}</div><div style={{fontSize:23,color:'#a7bdb0',marginTop:4}}>{s.shortcut.sub}</div></div></div></div><Pip/>{!content.subtitles&&<Caption>{f<S||!s.captionAfter?s.caption:s.captionAfter}</Caption>}</AbsoluteFill>}

// 柱状图：柱子在各自的帧升起、金额滚动到终值；gap 帧出现最高和最低两根之间的金色倍数标注；
// shortcut 帧起整张图缩到上半屏，圆形头像淡出，人物从下半屏升上来
function Chart({scene:s,slot}:{scene:Extract<Scene,{type:'chart'}>,slot:Slot}){
	const f=useCurrentFrame();
	const k=f<slot.shortcut?0:ease(f,slot.shortcut);
	const vals=s.bars.map(b=>b.value), max=Math.max(...vals), lo=vals.indexOf(Math.min(...vals)), hi=vals.indexOf(max);
	const col=860/s.bars.length, barW=Math.min(150,col*.55), base=760, H=480;
	const x=(i:number)=>col*(i+.5), topOf=(i:number)=>base-H*vals[i]/max;
	const fmt=(v:number)=>(s.prefix??'$')+Math.round(v).toLocaleString('en-US');
	const g=ramp(f,slot.gap,slot.gap+15), lineY=topOf(hi)-80, pillY=(lineY+topOf(lo)-70)/2;
	return <AbsoluteFill style={board}><AbsoluteFill style={grid}/>
	{k>0&&<div style={{position:'absolute',left:0,right:0,top:830,bottom:0,overflow:'hidden',borderTop:'1.5px solid #ffffff30',transform:`translateY(${(1-k)*1090}px)`}}><div style={{position:'absolute',left:0,width:1080,height:1920,top:layout.halfTop}}><Source/></div></div>}
	<Label {...s.label}/><div style={{position:'absolute',right:36,top:65,fontSize:12,color:'#919bab',letterSpacing:2,opacity:1-k}}>{s.corner}</div>
	<div style={{position:'absolute',top:250,left:110,width:860,height:930,transform:`translateY(${-45*k}px) scale(${1-.34*k})`,transformOrigin:'50% 0'}}>
		<div style={{fontSize:20,color:'#c1c8d2',letterSpacing:2,opacity:ramp(f,0,12)}}>{s.kicker}</div>
		<div style={{fontSize:53,fontWeight:850,lineHeight:1.18,marginTop:10,opacity:ramp(f,4,16),transform:`translateY(${(1-ease(f,4))*20}px)`}}><Rich text={s.title}/></div>
		<div style={{position:'absolute',left:0,right:0,top:base,height:2,background:'#52616d'}}/>
		{s.bars.map((b,i)=>{const c=barColors[b.color],t=slot.bars[i],h=(base-topOf(i))*ease(f,t),n=1-Math.pow(1-ramp(f,t+3,t+40),3);return <React.Fragment key={i}>
			<div style={{position:'absolute',left:x(i)-barW/2,width:barW,top:base-h,height:h,borderRadius:'14px 14px 3px 3px',background:`linear-gradient(180deg,${c},${c}aa)`,boxShadow:`0 0 30px ${c}30`}}/>
			<div style={{position:'absolute',left:x(i)-200,width:400,top:base-h-64,textAlign:'center',fontSize:44,fontWeight:850,fontVariantNumeric:'tabular-nums',opacity:ramp(f,t+3,t+12)}}>{fmt(b.value*n)}</div>
			<div style={{position:'absolute',left:x(i)-200,width:400,top:base+18,textAlign:'center',opacity:.4+.6*ramp(f,t,t+10)}}><div style={{fontSize:36,fontWeight:900,color:c}}>{b.name}</div>{b.sub&&<div style={{fontSize:21,color:'#aebbc6',marginTop:6}}>{b.sub}</div>}</div>
		</React.Fragment>})}
		{s.gap&&<div style={{opacity:g}}><svg width="860" height="930" style={{position:'absolute',left:0,top:0}}><path d={`M${x(hi)} ${lineY+16}V${lineY}H${x(lo)}V${topOf(lo)-72}`} stroke={gold} strokeWidth="3" strokeDasharray="10 8" fill="none"/></svg><div style={{position:'absolute',left:x(lo)-160,width:320,top:pillY-34,display:'flex',justifyContent:'center'}}><div style={{padding:'10px 26px',borderRadius:40,background:'#2a2416',border:`2px solid ${gold}`,color:gold,fontSize:40,fontWeight:900,boxShadow:`0 0 26px ${gold}40`,transform:`scale(${.85+.15*ease(f,slot.gap)})`}}>{s.gap.text}</div></div></div>}
		<div style={{position:'absolute',top:890,left:0,fontSize:18,color:'#91a0ac'}}>{s.foot}</div>
	</div>
	{k<1&&<Pip opacity={1-k}/>}
	{!content.subtitles&&s.caption&&<Caption top={k>.5?layout.captionTop:1530}>{s.caption}</Caption>}</AbsoluteFill>}

// 时间线：2–4 个节点从上往下在各自的帧出现，竖线跟着连到新出现的节点；节点可用 tone 上色
function Timeline({scene:s,slot}:{scene:Extract<Scene,{type:'timeline'}>,slot:Slot}){
	const f=useCurrentFrame();
	const n=s.steps.length, gap=n>3?190:230, top0=200, dot=34;
	return <AbsoluteFill style={board}><AbsoluteFill style={grid}/><Label {...s.label}/><div style={{position:'absolute',right:36,top:65,fontSize:12,color:'#919bab',letterSpacing:2}}>{s.corner}</div>
	<div style={{position:'absolute',top:260,left:110,width:860,transform:`scale(${interpolate(f,[0,180],[.94,1],cl)})`,transformOrigin:'50% 25%'}}>
		<div style={{fontSize:20,color:'#c1c8d2',letterSpacing:2,opacity:ramp(f,0,12)}}>{s.kicker}</div>
		<div style={{fontSize:53,fontWeight:850,marginTop:10,opacity:ramp(f,4,16)}}><Rich text={s.title} color={tones[s.tone??'gold']}/></div>
		{s.steps.slice(1).map((_,i)=>{const t=slot.bars[i+1];return <div key={i} style={{position:'absolute',left:dot/2-2,width:4,top:top0+i*gap+dot,height:(gap-dot)*ramp(f,t-12,t+4),borderRadius:2,background:'linear-gradient(180deg,#8a9bad,#5d6d7d)'}}/>})}
		{s.steps.map((st,i)=>{const t=slot.bars[i],c=stepColors[st.tone??'plain'],y=top0+i*gap;return <React.Fragment key={i}>
			<div style={{position:'absolute',left:0,top:y,width:dot,height:dot,boxSizing:'border-box',borderRadius:'50%',border:`4px solid ${c}`,background:st.tone?c:'#0e141e',boxShadow:`0 0 18px ${c}55`,transform:`scale(${ease(f,t)})`}}/>
			<div style={{position:'absolute',left:70,top:y-26,width:650,boxSizing:'border-box',padding:'20px 28px',borderRadius:25,border:`1.5px solid ${c}66`,background:'linear-gradient(115deg,#27303ce6,#131923ee)',boxShadow:`0 0 22px ${c}15`,opacity:ramp(f,t,t+12),transform:`translateX(${(1-ease(f,t))*30}px)`}}>
				<div style={{fontSize:42,fontWeight:850,color:st.tone?c:'#fff'}}>{st.title}</div>{st.sub&&<div style={{fontSize:24,color:'#9ba6b4',marginTop:6}}>{st.sub}</div>}
			</div>
		</React.Fragment>})}
	</div><Pip/>{!content.subtitles&&s.caption&&<Caption>{s.caption}</Caption>}</AbsoluteFill>}

// 逐句字幕：跟着说话出现；画布镜头（canvas、timeline，以及缩到上半屏之前的 chart）里字幕在 1530，真人镜头在 layout.captionTop
function Subtitles({subs,timeline}:{subs:Sub[],timeline:Slot[]}){
	const f=useCurrentFrame();
	const sub=subs.find(s=>f>=s.from&&f<s.to);
	if(!sub) return null;
	const i=timeline.findIndex(t=>f>=t.from&&f<t.from+t.frames);
	const type=content.scenes[i]?.type;
	const canvas=type==='canvas'||type==='timeline'||(type==='chart'&&f<timeline[i].from+timeline[i].shortcut);
	return <AbsoluteFill style={{fontFamily:F,color:'#fff'}}><Caption top={canvas?1530:layout.captionTop}>{sub.text}</Caption></AbsoluteFill>;
}

const names={glass:'真人 · 磨砂重点卡',twoShots:'真人 · 两项说明',canvas:'画布 · 流程与捷径',chart:'画布 · 柱状图',timeline:'画布 · 时间线',clean:'真人 · 干净',outro:'真人 · 收束'};
const SceneView=({scene,slot}:{scene:Scene,slot:Slot})=>scene.type==='canvas'?<Canvas scene={scene} S={slot.shortcut}/>:scene.type==='chart'?<Chart scene={scene} slot={slot}/>:scene.type==='timeline'?<Timeline scene={scene} slot={slot}/>:<Talking scene={scene} slot={slot}/>;
export const GlassStudy=({videoFrames,timeline,subs}:Props)=> <AbsoluteFill><Clip.Provider value={{start:0,videoFrames}}><SceneView scene={content.scenes[0]} slot={timeline[0]}/></Clip.Provider><Subtitles subs={subs} timeline={timeline}/></AbsoluteFill>;
export const Demo=({videoFrames,timeline,subs}:Props)=> <AbsoluteFill style={{background:'#080b10'}}>{content.scenes.map((scene,i)=><Sequence key={i} from={timeline[i].from} durationInFrames={timeline[i].frames} name={`${i+1} ${names[scene.type]}`}><Clip.Provider value={{start:timeline[i].from,videoFrames}}><SceneView scene={scene} slot={timeline[i]}/></Clip.Provider></Sequence>)}<Subtitles subs={subs} timeline={timeline}/></AbsoluteFill>;
