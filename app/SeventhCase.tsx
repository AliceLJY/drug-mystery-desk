"use client";
import {useState} from "react";
import "./seventh-case.css";

type Tab="brief"|"people"|"evidence"|"registry"|"board"|"interview"|"close";
type E={id:string;title:string;kind:string;summary:string;detail:string};
type R={id:string;pair:[string,string];title:string;text:string;unlock?:string};
const people=[
 {id:"cen",name:"岑嘉言",role:"申办方首席医学官 CMO",initial:"岑",color:"#2d4a7c",note:"BV-07-301 试验的总负责人。论文的通讯作者是他，公司那份“达到主要终点”的公告，署的也是他的名字。"},
 {id:"xie",name:"谢暮",role:"试验统计师",initial:"谢",color:"#5a4f7a",note:"统计分析计划（SAP）的执笔人。揭盲那晚，是她第一个看到了那个 p 值。"},
 {id:"tang",name:"唐叙白",role:"牵头 PI · 论文第一作者",initial:"唐",color:"#6b5a3a",note:"全国牵头中心的主要研究者。论文正文里那句“按预设的主要终点”，署的是他的名字。"},
 {id:"song",name:"宋知微",role:"期刊独立审稿人",initial:"宋",color:"#3f6b5e",note:"她在审稿意见里只追问了一件事：注册记录里那个 2021 年的主要终点，去哪了？"},
];
const ev:E[]=[
 {id:"paper",title:"期刊论文：主要终点结果",kind:"发表论文",summary:"论文写着：按预设主要终点，p=0.03，试验成功。",detail:"《BV-07 降低心衰患者临床事件风险：一项多中心随机对照试验》\n主要终点（文中称“预设”）：12 个月内心衰住院或 eGFR 下降≥40% 的复合终点\nHR 0.82（95% CI 0.69–0.98），p=0.03\n结论：“BV-07 达到了主要终点。”\n第一作者：唐叙白　　通讯作者：岑嘉言"},
 {id:"tlr",title:"揭盲顶线结果备忘录",kind:"内部备忘",summary:"揭盲当晚的备忘录：原主要终点 p=0.07，试验没有成功。",detail:"揭盲时间：2024-05-10（周五）20:14　　收件人：岑嘉言\n按 SAP v1.0 预设的主要终点：12 个月内心血管死亡或心衰住院\nHR 0.87（95% CI 0.75–1.01），p=0.07\n结论：未达到主要终点（双侧 α=0.05）\n起草：谢暮"},
 {id:"reg",title:"注册平台当前页面",kind:"公开注册",summary:"当前登记的主要终点，和论文一字不差；最后更新于 2024-05-22。",detail:"ClinicalTrials.gov · BV-07-301 当前版本\n主要终点：12 个月内心衰住院或 eGFR 下降≥40% 的复合终点\n页面显示：最后更新 2024-05-22\n页面底部有“历史版本”链接，默认不展开"},
 {id:"sap",title:"统计分析计划 SAP v1.0 / v2.0",kind:"统计文件",summary:"v2.0 换掉了主要终点，首页签发日期写着 2024-04-30——揭盲前十天。",detail:"SAP v1.0（2021-03-15）主要终点：12 个月内心血管死亡或心衰住院\nSAP v2.0 修订说明：“根据外部证据与监管沟通，优化主要终点定义”\nv2.0 主要终点：心衰住院或 eGFR 下降≥40%\n首页签发日期：2024-04-30　　签发人：岑嘉言、谢暮"},
 {id:"proto",title:"方案修订与伦理备案",kind:"伦理文件",summary:"方案里的主要终点，直到论文发表后才改，理由是“与已发表文章保持一致”。",detail:"伦理备案：方案第 4 版（2023-02），主要终点为心血管死亡或心衰住院\n方案第 5 版（改为新复合终点）递交日期：2024-09-03\n伦理批准：2024-09-20\n修订理由一栏：“与已发表文章保持一致”"},
 {id:"meta",title:"SAP v2.0 文件属性与签字记录",kind:"数字取证",summary:"文件创建于 05-11 凌晨，两个电子签名都在 05-12 深夜。",detail:"文件 BV07-301_SAP_v2.0.docx\n创建时间：2024-05-11 01:47（作者：谢暮）\n最后修改：2024-05-12 22:30\n电子签名系统：岑嘉言 05-12 22:41 签署，谢暮 05-12 22:47 签署\n首页“签发日期 2024-04-30”为手动键入的文本"},
 {id:"dmc",title:"数据监查委员会会议纪要",kind:"会议纪要",summary:"2023 年底的 DMC 纪要里，主要终点还是心血管死亡或心衰住院。",detail:"DMC 第 6 次会议（2023-11-20）纪要摘录\n“主要终点（心血管死亡或心衰住院）事件数已达计划的 82%。”\n“建议按原方案继续，不做调整。”\n全文未出现任何与 eGFR 有关的终点"},
 {id:"chat",title:"揭盲当晚的内部消息",kind:"数字取证",summary:"揭盲四个小时后，有人提议“换个终点跑一下”。",detail:"05-11 00:32 岑嘉言：0.07……董事会周一要结果。\n05-11 00:41 岑嘉言：心衰住院加 eGFR 那个复合终点，跑一下看看。\n05-11 01:18 谢暮：0.03。\n05-11 01:20 岑嘉言：SAP 补一个 v2，日期放到揭盲前。注册那边我让人改。\n05-11 01:26 谢暮：……好。"},
 {id:"stock",title:"公告与股价时间线",kind:"市场数据",summary:"揭盲后第 12 天早上七点，公司宣布试验成功，股价当日涨 37%。",detail:"2024-05-10 揭盲（未公告）\n2024-05-22 07:00 公告：“BV-07-301 达到主要终点”\n当日股价 +37%\n2024-05-28 完成 18 亿元定向增发，发行价按公告后的股价区间确定"},
 {id:"review",title:"审稿意见与作者回复",kind:"期刊审稿",summary:"审稿人问旧终点去哪了，作者答：注册记录早期“录入有误”。",detail:"审稿人宋知微：“注册历史显示，2021 年登记的主要终点为心血管死亡或心衰住院。请说明终点何时、为何变更。”\n作者回复（唐叙白、岑嘉言）：“终点变更已在揭盲前完成，见 SAP v2.0（2024-04-30）。注册记录早期版本存在录入错误，已于 2024 年 5 月更正。”\n编辑决定：接收"},
 {id:"history",title:"注册平台历史版本对比",kind:"公开注册",summary:"三年三个版本，主要终点只改过一次——揭盲后第 12 天。",detail:"版本 1（2021-04-02）主要终点：12 个月内心血管死亡或心衰住院\n版本 2（2022-08-17）主要终点不变，仅更新招募状态\n版本 3（2024-05-22 06:12）主要终点改为：心衰住院或 eGFR 下降≥40%\n修改说明：“更正录入错误”\n提交账号：bv07-cmo"},
 {id:"letter",title:"谢暮写给期刊的信",kind:"举报材料",summary:"统计师亲笔：v2.0 是揭盲之后写的，日期是按指示填的。",detail:"致期刊编辑部（2024-11-04）：\n“我是 BV-07-301 的试验统计师。SAP v2.0 写于 2024-05-11 凌晨，也就是揭盲之后；首页的日期，是按指示填写的。”\n“按原预设主要终点，结果是 p=0.07。这项试验没有达到主要终点。”\n“我愿意提交原始分析程序和运行日志。”"},
];
const rules:R[]=[
 {id:"swap",pair:["paper","tlr"],title:"两个 p 值，两个终点",text:"揭盲当晚按原预设主要终点算出 p=0.07，试验没有成功；论文里的 p=0.03 属于另一个终点。两个数字都是真的——被换掉的是终点。"},
 {id:"edited",pair:["reg","stock"],title:"宣布成功那天改过的注册页",text:"当前注册页的最后更新日期是 05-22，正是公司宣布“达到主要终点”的那一天。注册记录就在宣布成功的当天被改过——改了什么，只有历史版本知道。",unlock:"history"},
 {id:"backdate",pair:["sap","meta"],title:"倒签的统计分析计划",text:"SAP v2.0 首页印着 2024-04-30，文件却创建于揭盲后的凌晨，两个签名都落在 05-12 深夜。那个日期是手动键入的，往前倒签了十二天。"},
 {id:"oldend",pair:["dmc","proto"],title:"一直没变过的主要终点",text:"2023 年底的 DMC 纪要、伦理备案的方案第 4 版，主要终点都是“心血管死亡或心衰住院”；方案直到论文发表后才改，理由是“与已发表文章保持一致”。"},
 {id:"order",pair:["chat","tlr"],title:"先看结果，再选终点",text:"20:14 收到 p=0.07；00:41 提议换一个终点“跑一下看看”；01:18 跑出 0.03；01:20 下令把新 SAP 的日期放到揭盲前。顺序是：先看到结果，再挑选终点。"},
 {id:"liar",pair:["review","history"],title:"不是录入错误",text:"作者回复说早期注册“录入有误”；可同一个终点在 2021、2022 年两次登记都没变过，唯一的一次修改发生在揭盲后第 12 天、公告前 48 分钟，提交它的是 CMO 的账号。",unlock:"letter"},
 {id:"insider",pair:["letter","chat"],title:"那个回了“好”的人",text:"谢暮在信里承认：v2.0 写于揭盲之后，日期按指示填写。揭盲当晚的消息里，那句“……好”正是她回的。现在，她愿意交出原始程序和日志。"},
];
const statements=[
 {who:"唐叙白",quote:"论文里的主要终点就是方案预设的，从试验一开始我们就是这么定的。",answer:"dmc",ask:"哪份会议纪要说明，试验进行期间的主要终点根本不是这个？"},
 {who:"谢暮",quote:"SAP v2.0 在 4 月 30 日就签发了，比揭盲早十天。我只是照着它跑的分析。",answer:"meta",ask:"哪份记录能证明，这份 SAP 文件真正的创建与签署时间？"},
 {who:"岑嘉言",quote:"注册记录里那个旧终点，只是工作人员早年的一次录入错误。",answer:"history",ask:"哪份记录说明，这根本不是一次“录入错误”？"},
];
const arms=[
 {n:"原预设主要终点",d:"心血管死亡或心衰住院 · SAP v1.0",hr:0.87,lo:0.75,hi:1.01,p:"0.07",fail:true},
 {n:"论文中的“主要终点”",d:"心衰住院或 eGFR 下降≥40% · SAP v2.0",hr:0.82,lo:0.69,hi:0.98,p:"0.03",fail:false},
];
const px=(h:number)=>Math.log(h/0.6)/Math.log(1.1/0.6)*100;
const ticks=[0.6,0.7,0.8,0.9,1.0,1.1];
const hist=[
 {d:"2021-04-02",t:"注册版本 1",e:"主要终点：12 个月内心血管死亡或心衰住院",k:"ver",lock:true},
 {d:"2022-08-17",t:"注册版本 2",e:"主要终点不变，仅更新招募状态",k:"ver",lock:true},
 {d:"2024-04-30",t:"SAP v2.0 首页所印的“签发日期”",e:"这只是印在首页的日期——它是否真实，要看文件本身",k:"claim",after:"倒签：文件实际创建于 05-11 01:47，两个签名都在 05-12 深夜"},
 {d:"2024-05-10",t:"揭盲",e:"原预设主要终点 p=0.07，未达到",k:"fail"},
 {d:"2024-05-22",t:"注册版本 3 · 当前版本",e:"主要终点：心衰住院或 eGFR 下降≥40%",k:"ver now",more:"06:12 提交 · 修改说明“更正录入错误” · 提交账号 bv07-cmo"},
 {d:"2024-05-22",t:"公告：“达到主要终点”",e:"07:00 发布，股价当日 +37%",k:"news"},
];
export default function SeventhCase({onFinish}:{onFinish:(n:number)=>void}){
 const [tab,setTab]=useState<Tab>("brief"),[found,setFound]=useState<string[]>(["paper","tlr","reg","sap","proto","meta","dmc","chat","stock","review"]),[pick,setPick]=useState<string[]>([]),[solved,setSolved]=useState<string[]>([]),[si,setSi]=useState(0),[broken,setBroken]=useState<string[]>([]),[toast,setToast]=useState(""),[ans,setAns]=useState({p:"",sap:"",reg:"",why:""}),[score,setScore]=useState<number|null>(null);
 const visible=ev.filter(x=>found.includes(x.id)), progress=Math.min(100,Math.round((solved.length+broken.length+found.length-10)/12*100)), open=found.includes("history");
 const msg=(x:string)=>{setToast(x);setTimeout(()=>setToast(""),2300)};
 function select(id:string){setPick(v=>v.includes(id)?v.filter(x=>x!==id):v.length<2?[...v,id]:[v[1],id])}
 function connect(){const r=rules.find(x=>x.pair.every(y=>pick.includes(y)));if(!r){msg("两份材料尚不足以形成排他性推论");return}if(solved.includes(r.id)){msg("该推论已经记录");return}const fresh=!!r.unlock&&!found.includes(r.unlock);setSolved([...solved,r.id]);if(fresh)setFound([...found,r.unlock!]);setPick([]);msg("推论成立："+r.title+(fresh?" · 新材料入柜":""))}
 function challenge(id:string){const s=statements[si];if(broken.includes(s.who))return;if(id!==s.answer){msg("这份证据不能直接击破当前证词");return}setBroken([...broken,s.who]);msg("证词矛盾已确认");if(si<2)setTimeout(()=>setSi(si+1),600)}
 function finish(){const n=[ans.p==="swap",ans.sap==="backdated",ans.reg==="true",ans.why==="money"].filter(Boolean).length;const v=n*15+Math.min(35,solved.length*5)+Math.min(5,broken.length*2);setScore(v);onFinish(v)}
 const nav:[Tab,string][]=[["brief","案情"],["people","关系人"],["evidence","证据室"],["registry","注册史"],["board","推理板"],["interview","询问室"],["close","结案"]];
 const who=people.find(p=>p.name===statements[si].who);
 return <main className="reg-app"><header className="reg-top"><div><small>RESEARCH INTEGRITY DESK</small><h1>药研悬案局 <i>/ 第七案</i></h1></div><aside><span>BV07-301</span><b>{progress}%</b><em><i style={{width:Math.max(3,progress)+"%"}}/></em></aside></header><nav className="reg-nav">{nav.map(([x,l],i)=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}><small>0{i+1}</small>{l}</button>)}</nav>
 {tab==="brief"&&<section className="reg-scene reg-brief"><p className="reg-kicker">CASE BV07-301 · 主要终点偷换</p><h2>零点零七</h2><p className="reg-lead">揭盲那晚，统计师把结果发给首席医学官：p=0.07，差一点点，试验没有成功。十二天后，公司宣布试验“达到主要终点”；三个月后论文发表，p=0.03。没有人篡改数据——被换掉的，是终点本身。</p><div className="reg-alert"><div>0.07</div><article><small>BV-07 · PIVOTAL PHASE III · N=4,120</small><h3>主要终点一致性审查</h3><p>揭盲 p=0.07　论文 p=0.03　注册更新 05-22</p></article><strong>0.03</strong></div><div className="reg-cols"><article><h3>调查目标</h3><p>查清论文里的“预设主要终点”是什么时候定下的、注册记录为什么改过，以及这一切是在揭盲之前还是之后发生的。</p></article><article><h3>风险</h3><p>先看结果、再挑终点，任何一个失败的试验都能“成功”。医生据此开药，患者据此用药，投资人据此出钱——而这项试验，原本已经失败了。</p></article></div><button className="reg-action" onClick={()=>setTab("evidence")}>调取试验档案 →</button></section>}
 {tab==="people"&&<section className="reg-scene"><Head k="PERSONS UNDER REVIEW" t="关系人" p="有人在凌晨换掉了终点，有人回了一个“好”字。"/><div className="reg-people">{people.map(p=><article key={p.id}><div style={{background:p.color}}>{p.initial}</div><span>{p.role}</span><h3>{p.name}</h3><p>{p.note}</p></article>)}</div></section>}
 {tab==="evidence"&&<section className="reg-scene"><Head k={`TRIAL EVIDENCE · ${visible.length}/12`} t="证据室" p="选择两份材料，检验终点、日期与版本之间的联系。"/><div className="reg-bench"><div className="reg-cards">{visible.map((e,i)=><button className={pick.includes(e.id)?"picked":""} onClick={()=>select(e.id)} key={e.id}><span>T-{String(i+1).padStart(2,"0")} · {e.kind}</span><h3>{e.title}</h3><p>{e.summary}</p></button>)}</div><aside>{pick.length?pick.map(id=>{const e=ev.find(x=>x.id===id)!;return <article key={id}><small>{e.kind}</small><h3>{e.title}</h3><pre>{e.detail}</pre></article>}):<div className="reg-none">◎<p>请选择证据原件</p></div>}<button disabled={pick.length!==2} onClick={connect}>建立证据联系</button></aside></div></section>}
 {tab==="registry"&&<section className="reg-scene"><Head k="REGISTRY HISTORY · CLINICALTRIALS.GOV" t="注册史" p="同一项试验，两个“主要终点”。上面是结果，下面是它们出现的时间。"/><div className="forest"><div className="forest-axis">{ticks.map(t=><span key={t} style={{left:px(t)+"%"}}>{t.toFixed(1)}</span>)}</div>{arms.map(a=><div className={"forest-row"+(a.fail?" fail":" pass")} key={a.n}><header><b>{a.n}</b><span>{a.d}</span></header><div className="forest-plot"><i className="forest-one" style={{left:px(1)+"%"}}/><i className="forest-ci" style={{left:px(a.lo)+"%",width:(px(a.hi)-px(a.lo))+"%"}}/><i className="forest-pt" style={{left:px(a.hr)+"%"}}/></div><footer><span>HR {a.hr.toFixed(2)}（{a.lo.toFixed(2)}–{a.hi.toFixed(2)}）</span><strong>p={a.p}</strong></footer></div>)}<div className="forest-dir"><span style={{right:(100-px(1))+"%"}}>← 越靠左，越有利于 BV-07</span></div><p className="forest-cap">置信区间越过 1.0，就是没有证明有效。原主要终点的上限是 1.01——差了 0.01，也就是那个 0.07。</p></div><div className="reg-hist">{hist.map(h=>{const locked=!!h.lock&&!open,struck=!!h.after&&solved.includes("backdate");return <article key={h.d+h.t} className={h.k+(locked?" locked":"")+(struck?" struck":"")}><b>{h.d}</b><div><h4>{h.t}</h4><p>{locked?"历史版本默认不展开——先弄清这一页在哪一天被改过，再来调取。":struck?h.after:h.e}</p>{h.more&&open&&<small>{h.more}</small>}</div></article>})}</div><p className="reg-note">{open?"三年三个版本，主要终点只改过一次：揭盲后第 12 天，公告前 48 分钟。":"注册页只显示当前版本，旧版本要专门调取。"}</p></section>}
 {tab==="board"&&<section className="reg-scene"><Head k="INTEGRITY DEDUCTIONS" t="推理板" p={`${solved.length}/7 条推论成立`}/>{solved.length?<div className="reg-rules">{solved.map((id,i)=>{const r=rules.find(x=>x.id===id)!;return <article key={id}><b>{String(i+1).padStart(2,"0")}</b><div><small>INTEGRITY LINK CONFIRMED</small><h3>{r.title}</h3><p>{r.text}</p></div></article>})}</div>:<Empty go={()=>setTab("evidence")} text="从两个数字开始：揭盲那晚的 0.07，和论文里的 0.03，算的是同一件事吗？"/>}</section>}
 {tab==="interview"&&<section className="reg-scene"><Head k="STATEMENT CHALLENGE" t="证词核验" p={`${broken.length}/3 处矛盾已确认`}/>{broken.includes(statements[si].who)&&si===2?<Empty go={()=>setTab("close")} text="三份证词均已被客观记录击破，可以准备结案。"/>:<div className="reg-talk"><aside><div style={{background:who?.color}}>{who?.initial}</div><h3>{statements[si].who}</h3></aside><article><small>STATEMENT {si+1}/3</small><blockquote>“{statements[si].quote}”</blockquote><h4>{statements[si].ask}</h4><div>{visible.map(e=><button onClick={()=>challenge(e.id)} key={e.id}><span>{e.kind}</span>{e.title}</button>)}</div></article></div>}</section>}
 {tab==="close"&&<section className="reg-scene"><Head k="RESEARCH INTEGRITY VERDICT" t="结案报告" p="说清楚：0.03 是怎么来的，日期为什么要倒签，注册页又为什么在那天被改。"/>{score===null?<div className="reg-form"><Q n="01" t="论文里的 p=0.03 是怎么来的？" v={ans.p} set={x=>setAns({...ans,p:x})} opts={[["swap","数据没动：揭盲后换了一个能显著的终点，再把它称为“预设主要终点”"],["data","有人篡改了原始数据，把 0.07 改成了 0.03"],["more","补充随访增加了事件数，统计效力提高后结果变得显著"]]}/><Q n="02" t="SAP v2.0 首页上的“2024-04-30”是什么？" v={ans.sap} set={x=>setAns({...ans,sap:x})} opts={[["real","真实的签发日期：终点确实在揭盲前十天就改好了"],["draft","讨论稿的日期，正式版本只是晚了几天走完流程"],["backdated","倒签的日期：文件写于揭盲后的凌晨，日期是按指示手动填上的"]]}/><Q n="03" t="注册记录里那个旧终点是怎么回事？" v={ans.reg} set={x=>setAns({...ans,reg:x})} opts={[["typo","早期的录入错误，后来按实际情况更正"],["true","它就是真正的预设终点：两次登记未变，揭盲后第 12 天、公告前 48 分钟才被改掉"],["other","登记的是另一项姊妹试验的终点，被误填到了本试验"]]}/><Q n="04" t="是什么推动了这次终点偷换？" v={ans.why} set={x=>setAns({...ans,why:x})} opts={[["science","科学理由：新终点在医学上更合理，更能反映药物获益"],["money","董事会等着结果，公告让股价单日涨 37%，六天后完成 18 亿元定增"],["fda","监管机构在沟通中要求修改终点"]]}/><button disabled={Object.values(ans).some(x=>!x)} className="reg-action submit" onClick={finish}>提交审查结论</button></div>:<div className="reg-report"><div><small>INTEGRITY SCORE</small><strong>{score}</strong><span>/100</span></div><h3>{score===100?"先有结果，后有终点":"仍有关键环节未厘清"}</h3><p>{score===100?"你证明了：数据一个都没改，改掉的是“我们事先要证明什么”。":"重新比较揭盲备忘录、SAP 文件属性、注册历史版本与内部消息的时间顺序。"}</p>{score===100&&<article><h4>封存真相</h4><p>2024-05-10 周五 20:14，BV-07-301 揭盲：按 SAP v1.0 预设的主要终点“心血管死亡或心衰住院”，HR 0.87，置信区间上限 1.01，p=0.07，试验没有成功。四个小时后，首席医学官岑嘉言在消息里说“董事会周一要结果”，提议把心衰住院与 eGFR 下降拼成一个新的复合终点“跑一下看看”。01:18，统计师谢暮回复：0.03。两分钟后，岑嘉言要求补一份 SAP v2，“日期放到揭盲前”。01:47 文件被创建，首页手动键入了“2024-04-30”，两个电子签名都落在 05-12 深夜。05-22 06:12，CMO 账号把注册平台上已经两次登记未变的主要终点改掉，修改说明写着“更正录入错误”；48 分钟后，公司宣布试验“达到主要终点”，股价当日上涨 37%，六天后完成 18 亿元定增。论文由唐叙白署名第一作者发表，审稿人宋知微追问旧终点的去向，得到的回答是“录入错误”；方案则直到九月才改，理由是“与已发表文章保持一致”。同年十一月，那个在凌晨回了“……好”的人给期刊写了一封信。</p></article>}<button onClick={()=>{setScore(null);setAns({p:"",sap:"",reg:"",why:""})}}>重新提交</button></div>}</section>}
 <div className={toast?"reg-toast show":"reg-toast"}>{toast}</div></main>
}
function Head({k,t,p}:{k:string;t:string;p:string}){return <header className="reg-head"><div><small>{k}</small><h2>{t}</h2></div><p>{p}</p></header>}
function Empty({go,text}:{go:()=>void;text:string}){return <div className="reg-empty"><strong>◉</strong><h3>等待进一步核验</h3><p>{text}</p><button className="reg-action" onClick={go}>继续调查</button></div>}
function Q({n,t,v,set,opts}:{n:string;t:string;v:string;set:(x:string)=>void;opts:string[][]}){return <fieldset><legend><span>{n}</span>{t}</legend>{opts.map(x=><label className={v===x[0]?"on":""} key={x[0]}><input type="radio" checked={v===x[0]} onChange={()=>set(x[0])}/><i/>{x[1]}</label>)}</fieldset>}
