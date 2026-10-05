"use client";

import { useState } from "react";
import "./mystery.css";

type Tab = "brief" | "people" | "evidence" | "timeline" | "board" | "interrogate" | "close";
type Evidence = { id:string; title:string; type:string; time:string; summary:string; detail:string; source:string; key?:boolean };
type Suspect = { id:string; name:string; role:string; motive:string; alibi:string; initials:string; color:string };
type Deduction = { id:string; pair:[string,string]; title:string; text:string; unlock?:string };

const suspects: Suspect[] = [
  { id:"lin", name:"林乔", role:"首席医学官 · 失踪者", motive:"坚持推迟发布，并准备提交一份未公开报告。", alibi:"21:52 离开公司，此后手机关机。", initials:"林", color:"#315b50" },
  { id:"zhou", name:"周维", role:"生物统计负责人", motive:"负责最终分析，若数据有误将承担直接责任。", alibi:"声称整晚在会议室重跑分析。", initials:"周", color:"#6b566f" },
  { id:"xu", name:"许岚", role:"临床运营总监", motive:"试验延期将严重影响她的绩效与职业声誉。", alibi:"声称去服务器间处理打印故障。", initials:"许", color:"#8b493f" },
  { id:"chen", name:"陈策", role:"融资与战略负责人", motive:"公司现金仅够三个月，融资取决于结果发布。", alibi:"声称22点后一直与海外投资人通话。", initials:"陈", color:"#80642f" },
];

const evidence: Evidence[] = [
  { id:"audit", title:"数据库审计日志", type:"数字取证", time:"22:14—22:47", summary:"林乔离开公司后，其账号仍标记了007号受试者。", detail:"22:14 ZHOU.W 导出完整数据集\n22:31 LIN.Q 将受试者007标记为“重大方案违背”\n22:47 ADMIN 执行排除并重新生成分析集", source:"EDC审计追踪（只读副本）", key:true },
  { id:"access", title:"门禁记录", type:"现场记录", time:"21:52—23:18", summary:"许岚在关键操作前11分钟进入服务器间。", detail:"21:52 林乔刷卡离开办公区\n22:20 许岚进入服务器间\n22:49 许岚离开服务器间\n23:18 周维离开办公区", source:"物业门禁系统", key:true },
  { id:"sap", title:"统计分析计划 SAP v3.2", type:"制度文件", time:"锁库前签署", summary:"重大方案违背必须在锁库前由盲态委员会确认。", detail:"第7.4条：任何导致受试者被排除出符合方案集的重大方案违背，必须于数据库锁定前，由盲态医学审查委员会形成书面确认。锁库后不得追溯补记。", source:"文档管理系统", key:true },
  { id:"draft", title:"未发送的邮件草稿", type:"通信记录", time:"21:36", summary:"排除007后，主要终点会“刚好越过阈值”。", detail:"“如果把007排除出PP集，主要终点刚好越过预设阈值。但理由不能在锁库后补写。我不会在这版报告上签字。”——草稿保存于林乔工作电脑", source:"林乔邮箱本地缓存", key:true },
  { id:"print", title:"运维工单记录", type:"系统记录", time:"案发当日", summary:"当晚没有打印服务故障或重启记录。", detail:"过去72小时打印服务在线率100%。无故障告警，无重启，无许岚提交的工单。22:20—22:50服务器间环境与网络运行正常。", source:"IT运维平台", key:true },
  { id:"finance", title:"董事会现金流简报", type:"机密文件", time:"案发前2日", summary:"若发布延期，公司可能无法完成本轮融资。", detail:"可用现金预计维持13周。投资方的第二笔尽调款以“ZX-17二期主要终点达到预设阈值并按期披露”为先决条件。陈策在页边批注：不能延期。", source:"董事会资料室", key:true },
  { id:"call", title:"陈策的通话清单", type:"通信记录", time:"21:58—22:38", summary:"所谓连续海外会议，中间有17分钟空档。", detail:"21:58—22:07 呼出，新加坡（9分钟）\n22:08—22:25 无通话记录\n22:26—22:38 呼出，香港（12分钟）", source:"公司通讯账单" },
  { id:"badge", title:"临时访客卡日志", type:"现场记录", time:"22:09", summary:"陈策借走一张能进入临床办公区的访客卡。", detail:"前台记录：陈策以“投资人临时参观”为由签出V-03访客卡。该卡22:17进入临床办公区，22:29离开；未进入服务器间。", source:"前台访客系统" },
  { id:"result", title:"两版统计结果", type:"数据文件", time:"22:16 / 22:51", summary:"007是唯一严重恶化病例；排除后结果由未达标变为达标。", detail:"锁库版：有效率 58.7%，未达到60%阈值。\n重算版（排除007）：有效率 60.3%，达到阈值。\n007：用药后住院，主要终点评定为无应答。", source:"周维的分析目录", key:true },
  { id:"usb", title:"林乔办公室的U盘包装", type:"现场物证", time:"生产批次可查", summary:"包装为空，内含监管举报门户的手写地址。", detail:"抽屉内发现新拆封加密U盘包装；背面手写国家药监举报门户地址及材料清单。电脑记录显示21:44有加密存储设备接入并复制审计日志。", source:"办公室勘查" },
  { id:"taxi", title:"网约车电子行程", type:"外部记录", time:"22:03—22:41", summary:"林乔离开后前往机场附近酒店，而非遭到强制带走。", detail:"上车点：公司东门；下车点：临空商务酒店。行程由林乔本人账户下单，人脸确认支付。酒店登记显示其22:46入住。", source:"经本人律师授权提供" },
  { id:"message", title:"匿名即时消息", type:"恢复数据", time:"22:12", summary:"陈策要求许岚“按昨晚说的处理那一个病例”。", detail:"发送者 C：投资方只认明早那张表。按昨晚说的处理那一个病例，技术上的理由你来写。\n接收者 X：锁库了。\n发送者 C：所以别留下新的邮件。", source:"许岚手机已删除缓存", key:true },
];

const deductions: Deduction[] = [
  { id:"impossible", pair:["audit","access"], title:"幽灵账号", text:"林乔21:52已经离开，22:31不可能亲自操作。许岚则在操作发生时位于服务器间。", unlock:"print" },
  { id:"illegal", pair:["sap","draft"], title:"锁库后的越线操作", text:"林乔明确知道规则并拒绝签字；007的排除理由是在锁库后补写，程序上无效。", unlock:"result" },
  { id:"lie", pair:["access","print"], title:"不存在的打印故障", text:"许岚进入服务器间的理由是假的。关键时段内打印服务没有故障，也没有工单。", unlock:"message" },
  { id:"motive", pair:["finance","message"], title:"指令与动机", text:"陈策面临融资死线，并直接要求许岚处理007。许岚是操作者，陈策是指使者。" },
  { id:"notvictim", pair:["usb","taxi"], title:"失踪者的真实计划", text:"林乔主动复制审计证据并入住酒店。他不是被灭口，而是在律师协助下准备向监管机构举报。" },
  { id:"manipulated", pair:["result","sap"], title:"被制造的“达标”", text:"007并非预先确认的可排除病例。删除唯一严重恶化病例后，结果才从58.7%变为60.3%。" },
];

const testimony = [
  { id:"xu", who:"许岚", quote:"我在服务器间只是重启打印服务，完全没有登录临床数据库。", answer:"print", prompt:"哪份证据能直接击穿她的解释？" },
  { id:"chen", who:"陈策", quote:"22点以后我一直在和海外投资人通话，不可能联系或指使任何人。", answer:"call", prompt:"哪份证据说明他的不在场证明并不完整？" },
];

export default function MysteryGame({onFinish}:{onFinish?:(n:number)=>void}={}) {
  const [tab,setTab]=useState<Tab>("brief");
  const [found,setFound]=useState<string[]>(["audit","access","sap","draft","finance","call","badge","usb","taxi"]);
  const [selected,setSelected]=useState<string[]>([]);
  const [solved,setSolved]=useState<string[]>([]);
  const [toast,setToast]=useState("");
  const [statement,setStatement]=useState(0);
  const [challenged,setChallenged]=useState<string[]>([]);
  const [accuse,setAccuse]=useState({operator:"",mastermind:"",method:"",missing:""});
  const [report,setReport]=useState<{score:number;correct:number}|null>(null);
  const visible=evidence.filter(e=>found.includes(e.id));
  const progress=Math.round(((found.length-9)+solved.length+challenged.length)/11*100);
  const selectedEvidence=selected.map(id=>evidence.find(e=>e.id===id)!).filter(Boolean);
  const current=testimony[statement];
  const notify=(s:string)=>{setToast(s); window.setTimeout(()=>setToast(""),2600)};

  function inspect(id:string){ setSelected(v=>v.includes(id)?v.filter(x=>x!==id):v.length<2?[...v,id]:[v[1],id]); }
  function deduce(){
    if(selected.length!==2){notify("请在线索库中选择两份证据");return}
    const d=deductions.find(x=>x.pair.every(p=>selected.includes(p)));
    if(!d){notify("这两条线索暂时无法形成可验证的推论");return}
    if(solved.includes(d.id)){notify("这条推论已经记录在案");return}
    setSolved(v=>[...v,d.id]); if(d.unlock&&!found.includes(d.unlock))setFound(v=>[...v,d.unlock!]);
    setSelected([]); notify(`推论成立：${d.title}`);
  }
  function challenge(id:string){
    if(id===current.answer){setChallenged(v=>[...v,current.id]);notify("指证成功：证词出现关键矛盾");if(statement<testimony.length-1)setTimeout(()=>setStatement(statement+1),700)}
    else notify("这份证据无法直接反驳这句话");
  }
  function closeCase(){
    const checks=[accuse.operator==="xu",accuse.mastermind==="chen",accuse.method==="account",accuse.missing==="voluntary"];
    const correct=checks.filter(Boolean).length; const bonus=Math.min(30,solved.length*5)+challenged.length*5;
    const score=correct*15+bonus;
    setReport({correct,score});
    onFinish?.(score);
  }
  const nav:[Tab,string,string][]=[["brief","案情","01"],["people","关系人","02"],["evidence","证物柜","03"],["timeline","时间线","04"],["board","推理板","05"],["interrogate","询问室","06"],["close","结案","07"]];

  return <main className="mystery-app">
    <header className="m-top"><div className="brand"><span className="seal">研</span><div><small>PHARMA CRIME ARCHIVE</small><h1>药研悬案局</h1></div></div><div className="case-status"><span>案卷 ZX-017</span><b>调查进度 {Math.max(0,progress)}%</b><i><em style={{width:`${Math.max(4,progress)}%`}}/></i></div></header>
    <nav className="m-nav">{nav.map(([id,label,no])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}><small>{no}</small>{label}{id==="board"&&solved.length?<mark>{solved.length}</mark>:null}</button>)}</nav>

    {tab==="brief"&&<section className="scene brief-scene"><div className="chapter">第一案</div><p className="kicker">CASE ZX-017 · 2026年4月17日</p><h2>消失的第七码</h2><p className="lead">新药 ZX-17 的Ⅱ期结果发布前夜，首席医学官失踪，数据库中的007号受试者也被排除。公司说这只是一次“例行数据清理”。</p><div className="brief-grid"><article className="incident"><h3>案情通报</h3><p>明早九点，公司将向投资人宣布试验达到主要终点。但一份锁库后的审计日志显示，结果可能被人为改变。</p><blockquote>“找到谁动了数据，也要找到是谁让他这么做。”</blockquote></article><article className="objectives"><h3>你的任务</h3><ol><li><span>01</span>确认007号记录由谁操作</li><li><span>02</span>找出幕后指使者与动机</li><li><span>03</span>判断林乔失踪的真实原因</li><li><span>04</span>还原被篡改的数据结论</li></ol></article></div><button className="action" onClick={()=>setTab("evidence")}>打开证物柜 <span>→</span></button></section>}

    {tab==="people"&&<section className="scene"><div className="scene-head"><div><p className="kicker">PERSONS OF INTEREST</p><h2>四名关系人</h2></div><p>每个人都只说了一部分真话。</p></div><div className="suspect-grid">{suspects.map(s=><article className="suspect" key={s.id}><div className="portrait" style={{background:s.color}}>{s.initials}<span/></div><div><p className="role">{s.role}</p><h3>{s.name}</h3><dl><dt>可能动机</dt><dd>{s.motive}</dd><dt>自述行踪</dt><dd>{s.alibi}</dd></dl></div></article>)}</div></section>}

    {tab==="evidence"&&<section className="scene"><div className="scene-head"><div><p className="kicker">EVIDENCE LOCKER · {visible.length}/12</p><h2>证物柜</h2></div><p>点击卡片选为推理材料，一次可选两份。</p></div><div className="evidence-layout"><div className="evidence-list">{visible.map((e,i)=><button key={e.id} onClick={()=>inspect(e.id)} className={`e-card ${selected.includes(e.id)?"selected":""}`}><span className="e-no">E-{String(i+1).padStart(2,"0")}</span><span className="e-type">{e.type}</span>{e.key&&<i>关键</i>}<h3>{e.title}</h3><p>{e.summary}</p><small>{e.time}</small></button>)}</div><aside className="reader">{selectedEvidence.length?<>{selectedEvidence.map(e=><article key={e.id}><p className="kicker">{e.type} · {e.time}</p><h3>{e.title}</h3><pre>{e.detail}</pre><footer>来源：{e.source}</footer></article>)}<button className="action full" onClick={deduce}>{selected.length===2?"连接两份证据":"再选择一份证据"}</button></>:<div className="reader-empty"><b>⌕</b><p>选择一份证据查看原件<br/>选择两份证据尝试建立推论</p></div>}</aside></div></section>}

    {tab==="timeline"&&<section className="scene"><div className="scene-head"><div><p className="kicker">NIGHT OF THE INCIDENT</p><h2>案发夜时间线</h2></div></div><div className="time-list">{[
      ["21:36","林乔保存未发送邮件","拒绝在排除007后的报告上签字","draft"],["21:44","加密U盘接入","林乔复制审计资料","usb"],["21:52","林乔离开公司","此后未再次刷卡进入","access"],["22:12","匿名消息发出","要求“处理那一个病例”","message"],["22:20","许岚进入服务器间","声称处理打印故障","access"],["22:31","LIN.Q 标记007违规","林乔此时已在前往酒店的车上","audit"],["22:47","007被排除","系统重算主要终点","result"],["22:49","许岚离开服务器间","前后停留29分钟","access"],
    ].map(x=><button key={x[0]} className={!found.includes(x[3])?"locked":""} onClick={()=>found.includes(x[3])&&setTab("evidence")}><time>{x[0]}</time><i/><div><b>{found.includes(x[3])?x[1]:"尚未查明"}</b><p>{found.includes(x[3])?x[2]:"需要解锁相关证据"}</p></div></button>)}</div></section>}

    {tab==="board"&&<section className="scene board-scene"><div className="scene-head"><div><p className="kicker">DEDUCTION BOARD</p><h2>推理板</h2></div><p>{solved.length}/6 条关键推论成立</p></div>{solved.length?<div className="deductions">{solved.map((id,i)=>{const d=deductions.find(x=>x.id===id)!;return <article key={id}><span>{String(i+1).padStart(2,"0")}</span><div><p className="kicker">DEDUCTION CONFIRMED</p><h3>{d.title}</h3><p>{d.text}</p><div className="chips">{d.pair.map(p=><button key={p} onClick={()=>{setSelected([p]);setTab("evidence")}}>{evidence.find(e=>e.id===p)?.title}</button>)}</div></div></article>})}</div>:<div className="empty-board"><div>?</div><h3>推理板还是空的</h3><p>前往证物柜，选择两份有关联的证据并尝试连接。</p><button className="action" onClick={()=>setTab("evidence")}>开始推理</button></div>}</section>}

    {tab==="interrogate"&&<section className="scene interrogation"><div className="scene-head"><div><p className="kicker">INTERROGATION ROOM</p><h2>证词指证</h2></div><p>{challenged.length}/2 处谎言已击破</p></div>{challenged.includes(current.id)&&statement===testimony.length-1?<div className="interview-done"><b>询问结束</b><p>两人的不在场证明都出现裂缝。现在可以继续拼合证据链，或提交结案报告。</p><button className="action" onClick={()=>setTab("close")}>前往结案</button></div>:<div className="interview"><aside><div className="portrait big" style={{background:suspects.find(s=>s.id===current.id)?.color}}>{suspects.find(s=>s.id===current.id)?.initials}</div><h3>{current.who}</h3><p>{suspects.find(s=>s.id===current.id)?.role}</p></aside><article><span>证词 {statement+1}/2</span><blockquote>“{current.quote}”</blockquote><h4>{current.prompt}</h4><div className="challenge-list">{visible.map(e=><button key={e.id} onClick={()=>challenge(e.id)}><small>{e.type}</small>{e.title}</button>)}</div></article></div>}</section>}

    {tab==="close"&&<section className="scene close-scene"><div className="scene-head"><div><p className="kicker">FINAL ACCUSATION</p><h2>提交结案报告</h2></div><p>事实、方法、动机，缺一不可。</p></div>{!report?<div className="verdict-form"><Question no="01" title="谁实际操作并排除了007？" value={accuse.operator} set={v=>setAccuse({...accuse,operator:v})} options={[["zhou","周维"],["xu","许岚"],["lin","林乔"],["chen","陈策"]]}/><Question no="02" title="谁是幕后指使者？" value={accuse.mastermind} set={v=>setAccuse({...accuse,mastermind:v})} options={[["zhou","周维"],["xu","许岚"],["lin","林乔"],["chen","陈策"]]}/><Question no="03" title="数据是怎样被改变的？" value={accuse.method} set={v=>setAccuse({...accuse,method:v})} options={[["account","借用林乔账号，在锁库后补记违规并排除病例"],["statistics","周维修改了统计公式"],["hack","外部黑客入侵数据库"]]}/><Question no="04" title="林乔为什么失踪？" value={accuse.missing} set={v=>setAccuse({...accuse,missing:v})} options={[["voluntary","主动避开公司，保存证据并准备举报"],["kidnap","遭到公司人员绑架"],["escape","因亲自篡改数据而逃跑"]]}/><button className="action submit" disabled={Object.values(accuse).some(v=>!v)} onClick={closeCase}>封存并提交报告</button></div>:<div className="report"><div className="score"><small>CASE SCORE</small><strong>{report.score}</strong><span>/ 100</span></div><h3>{report.correct===4?"结案：证据链完整":"结案：仍有疑点"}</h3><p>{report.correct===4?"你识破了锁库后的数据操纵，也没有把主动举报者误判为逃犯。":"你还原了部分事实，但有关键环节与现有证据不符。"}</p><div className="truth"><h4>案件真相</h4><p>融资负责人陈策为了让试验结果越过60%的披露阈值，指使许岚进入服务器间，利用林乔未退出的会话，把唯一严重恶化的007号病例追溯标记为方案违背并排除。林乔发现计划后拒绝签字，复制审计材料，在律师安排下入住机场酒店，准备向监管机构举报。周维导出的锁库版数据保留了未被修改的结果：58.7%，主要终点并未达到预设阈值。</p></div><button className="secondary" onClick={()=>{setReport(null);setAccuse({operator:"",mastermind:"",method:"",missing:""})}}>重新作答</button></div>}</section>}
    <div className={`toast ${toast?"show":""}`}>{toast}</div>
  </main>
}

function Question({no,title,value,set,options}:{no:string;title:string;value:string;set:(v:string)=>void;options:string[][]}){return <fieldset><legend><span>{no}</span>{title}</legend>{options.map(([v,l])=><label key={v} className={value===v?"picked":""}><input type="radio" checked={value===v} onChange={()=>set(v)}/><i/>{l}</label>)}</fieldset>}
