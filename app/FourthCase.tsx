"use client";
import {useState} from "react";
import "./fourth-case.css";

type Tab="brief"|"people"|"evidence"|"clock"|"board"|"interview"|"close";
type E={id:string;title:string;kind:string;summary:string;detail:string};
type R={id:string;pair:[string,string];title:string;text:string;unlock?:string};
const people=[
 {id:"jiang",name:"江砚",role:"主要研究者 PI",initial:"江",color:"#6b5330",note:"该适应症领域权威，本品关键注册试验国内牵头人。因果判定栏由他签署“与试验用药无关”。"},
 {id:"shao",name:"邵冉",role:"研究护士 / 发药人",initial:"邵",color:"#7d4a44",note:"03-14 上午接检验科电话的人，也是当天下午发药的人。后来填写了失访认定表。"},
 {id:"he",name:"何家树",role:"申办方医学总监",initial:"何",color:"#455a63",note:"负责严重程度与相关性复核，正在冲刺本品上市申请的递交节点。"},
 {id:"zhu",name:"祝小满",role:"院外会诊医师",initial:"祝",color:"#4c6152",note:"在院外医院写下手写会诊意见，建议按 SUSAR 上报。那页纸从未进入 EDC。"},
];
const ev:E[]=[
 {id:"crit",title:"危急值电话登记与录音索引",kind:"通信记录",summary:"检验科 08:14 已接通并口头告知，通话 96 秒。",detail:"03-14 08:14:33 中心检验科呼出至研究中心值班机\n通话时长 96 秒，接听工号 N-2207（邵冉）\n录音索引：ALT 7.4×ULN，TBIL 2.8×ULN，已口头报告，要求 30 分钟内回签\n回签栏：空白。"},
 {id:"edc",title:"EDC 不良事件审计轨迹",kind:"审计记录",summary:"同一条 AE 的知晓时间、严重程度、相关性全被改过。",detail:"03-14 15:20 创建：知晓时间 03-14 08:20，严重程度 severe，相关性 probable\n03-14 17:48 修改一：知晓时间改为 03-14 15:20（修改人 邵冉）\n03-15 09:02 修改二：知晓日期改为 03-15，严重程度改为 moderate，相关性改为 not related（修改人 何家树）\n三次修改理由栏统一填写“录入笔误”。"},
 {id:"dose",title:"给药与药物核销记录",kind:"药物记录",summary:"危急值之后 5 小时 26 分，受试者又服下当日剂量。",detail:"03-14 13:40 L-047 领取当日剂量并现场服用\n发药与监督服药签名：邵冉\n药物核销系统同步扣减 1 剂，无暂停给药记录\n方案 7.4 条：出现 3×ULN 以上转氨酶升高应立即暂停给药并启动评估。"},
 {id:"lab",title:"中心实验室原始报告",kind:"检验数据",summary:"转氨酶 7.4 倍、胆红素 2.8 倍，而 ALP 正常。",detail:"ALT 7.4×ULN　AST 5.9×ULN　TBIL 2.8×ULN　ALP 0.9×ULN\n肝细胞损伤型，同时满足 Hy's Law 三项判定条件\n该组合提示重度药物性肝损伤，死亡或需肝移植比例约 10%\n报告已自动标记“危急值”并触发电话告知流程。"},
 {id:"hist",title:"既往病史页与筛选期原件",kind:"源文件",summary:"“中度脂肪肝”在筛选期原始表里并不存在。",detail:"递交版病史页：既往中度脂肪肝（2019 年体检发现）\n筛选期纸质原件同一栏：空白，受试者签字确认无肝胆疾病史\n筛选期腹部超声：肝脏大小、形态、回声未见异常\n病史页电子版最后修改时间：03-19 22:07。"},
 {id:"outside",title:"院外医院出院小结",kind:"外部病历",summary:"03-18 入 ICU，03-23 死亡，死因急性肝衰竭。",detail:"03-18 22:05 急诊入院：深度黄疸、凝血功能障碍、肝性脑病 II 期\n03-23 06:40 死亡，直接死因：急性肝衰竭\n诊断栏：药物性肝损伤（考虑与近期临床试验用药相关，需申办方评估）\n家属已向研究中心送达出院小结与死亡证明复印件，签收人：邵冉。"},
 {id:"note",title:"祝小满会诊记录原件",kind:"手写源文件",summary:"末次用药后第七天发病，建议按 SUSAR 上报。",detail:"03-18 会诊意见（手写，签名 祝小满）：\n患者末次用药后第 7 天出现黄疸与转氨酶显著升高，用药与发病时间关系密切\n已排除病毒性肝炎、酒精因素及其他可疑合并用药\n建议判定为“很可能相关”，按 SUSAR 于 24 小时内上报\n该页未扫描进 EDC，原件留在院外医院病案室。"},
 {id:"report",title:"递交监管的 SAE 首次报告",kind:"上报文件",summary:"中度、无关、失访，首次知晓日期写的是 03-15。",detail:"严重程度：中度　　　相关性：与试验用药无关\n转归：失访　　　　　首次知晓日期：03-15\n递交时间：03-16 08:30（纸面上落在 24 小时时限内）\n判定依据栏：受试者既往中度脂肪肝，考虑基础疾病进展\n签署：江砚（研究者）／何家树（申办方医学总监）。"},
 {id:"coi",title:"顾问协议与递交里程碑",kind:"利益关系",summary:"两位签署人的收益都与“按期递交”直接绑定。",detail:"江砚与申办方顾问协议：年度顾问费及获批后学术推广酬金，未在本试验利益冲突声明中申报\n何家树绩效条款：本品上市申请于 Q2 内完成递交，触发里程碑奖金\n内部备忘：一例判定为相关的死亡病例将触发安全性数据库重评，递交至少推迟两个季度。"},
 {id:"sms",title:"删除的工作群消息",kind:"数字取证",summary:"有人要求别触发时钟，有人问下午发出去的药怎么办。",detail:"何：这例按非严重走，别触发 SUSAR 时钟。\n江：那判定栏需要一条既往肝病撑着。\n邵：下午那次药我已经发出去了，怎么写。\n何：给药记录照常，不要单独做说明。\n祝：会诊意见我已经写了，按相关报。\n（此条之后，祝小满被移出群组）"},
 {id:"sign",title:"电子签名与登录日志",kind:"系统日志",summary:"因果判定的签名来自申办方顾问会酒店网段。",detail:"03-19 23:41 江砚账号完成“研究者因果判定”电子签名\n登录 IP 归属：申办方总部所在城市，酒店会议中心网段\n同一时段该账号在研究中心内网无任何登录记录\n差旅审批：03-18 至 03-20 申办方年度顾问会，参会人含江砚、何家树。"},
 {id:"follow",title:"失访认定表与通话明细",kind:"随访记录",summary:"三次“未接通”拨的是同一个停机号。",detail:"失访认定表：03-20、03-21、03-22 三次电话联系未果，判定失访\n运营商明细：三次均拨往 138****6602，该号码 2025-11 起已停机\n知情同意书紧急联系人栏登记的家属号码 139****4417，通话明细中从未出现\n认定表签署：邵冉（填表）／江砚（核准）。"},
];
const rules:R[]=[
 {id:"delay",pair:["crit","edc"],title:"七小时的空白",text:"检验科 08:14 已接通并口头报告，EDC 首版也写着知晓时间 08:20；随后知晓时间被两次修改，一路后移到次日。"},
 {id:"harm",pair:["dose","crit"],title:"空白里发生了什么",text:"危急值知晓 5 小时 26 分后，受试者仍被发药并当场服用。延迟录入不是文书问题，而是让药物暴露又持续了一整天。"},
 {id:"hy",pair:["lab","outside"],title:"这从一开始就是重度",text:"转氨酶与胆红素同时升高而 ALP 正常，符合 Hy's Law；四天后急性肝衰竭死亡。“中度”与客观指标和最终转归都对不上。",unlock:"follow"},
 {id:"fake",pair:["hist","note"],title:"被补上的既往肝病",text:"筛选期原件与腹部超声均无肝病记录，病史页却在因果判定前夜被修改；而会诊原件写明用药与发病时间关系密切。",unlock:"sign"},
 {id:"signed",pair:["sign","coi"],title:"在顾问会上签下的“无关”",text:"因果判定于申办方年度顾问会期间、在酒店网段完成签署，签署人与申办方存在未申报的经济利益关系。"},
 {id:"clock",pair:["report","sms"],title:"被重算的报告时钟",text:"首次知晓日期后移一天，使 24 小时递交时限在纸面上成立；群消息里那句“别触发 SUSAR 时钟”说明这是有意为之。"},
 {id:"death",pair:["follow","outside"],title:"“失访”的真相",text:"三次随访电话拨的都是停机号，知情同意书登记的家属号码从未拨打，而死亡证明的签收人就在中心内部。"},
];
const statements=[
 {who:"邵冉",quote:"那天上午检验科根本没打通电话，我是下午才知道结果的。",answer:"crit",ask:"哪份记录能证明她上午就已经知晓了？"},
 {who:"何家树",quote:"肝衰竭发生在末次给药之后，属于试验之外的事件，与药物无关。",answer:"note",ask:"哪份原件对用药与发病的时间关系给出了专业判断？"},
 {who:"江砚",quote:"因果判定是我在中心独立完成的，那几天我没有和申办方接触。",answer:"sign",ask:"哪条日志说明了他签字时人在什么地方？"},
];
const timeline=[
 {d:"03-14",t:"08:14",o:"无记录",r:"检验科拨出危急值电话，接通 96 秒，接听工号 N-2207"},
 {d:"03-14",t:"13:40",o:"按方案常规给药",r:"危急值知晓 5 小时 26 分后，仍发放并监督服用当日剂量",gap:true},
 {d:"03-14",t:"15:20",o:"首次知晓不良事件",r:"EDC 首次录入，首版知晓时间写的是 08:20"},
 {d:"03-15",t:"09:02",o:"首次知晓日期（递交版）",r:"知晓日期第二次修改，由 03-14 改为 03-15"},
 {d:"03-18",t:"22:05",o:"受试者失访",r:"L-047 由家属送入院外医院 ICU，诊断急性肝衰竭"},
 {d:"03-19",t:"23:41",o:"PI 完成因果判定：与药物无关",r:"电子签名 IP 属申办方顾问会所在酒店网段"},
 {d:"03-23",t:"06:40",o:"无记录",r:"L-047 死亡，直接死因：急性肝衰竭",gap:true},
];
export default function FourthCase({onFinish}:{onFinish:(n:number)=>void}){
 const [tab,setTab]=useState<Tab>("brief"),[found,setFound]=useState<string[]>(["crit","edc","dose","lab","hist","outside","note","report","coi","sms"]),[pick,setPick]=useState<string[]>([]),[solved,setSolved]=useState<string[]>([]),[si,setSi]=useState(0),[broken,setBroken]=useState<string[]>([]),[toast,setToast]=useState(""),[ans,setAns]=useState({grade:"",gap:"",cause:"",outcome:""}),[score,setScore]=useState<number|null>(null);
 const visible=ev.filter(x=>found.includes(x.id)), progress=Math.min(100,Math.round((solved.length+broken.length+found.length-10)/12*100));
 const msg=(x:string)=>{setToast(x);setTimeout(()=>setToast(""),2300)};
 function select(id:string){setPick(v=>v.includes(id)?v.filter(x=>x!==id):v.length<2?[...v,id]:[v[1],id])}
 function connect(){const r=rules.find(x=>x.pair.every(y=>pick.includes(y)));if(!r){msg("两份材料尚不足以形成排他性推论");return}if(solved.includes(r.id)){msg("该推论已经记录");return}setSolved([...solved,r.id]);if(r.unlock&&!found.includes(r.unlock))setFound([...found,r.unlock]);setPick([]);msg("推论成立："+r.title)}
 function challenge(id:string){const s=statements[si];if(id!==s.answer){msg("这份证据不能直接击破当前证词");return}setBroken([...broken,s.who]);msg("证词矛盾已确认");if(si<2)setTimeout(()=>setSi(si+1),600)}
 function finish(){const n=[ans.grade==="severe",ans.gap==="dose",ans.cause==="directed",ans.outcome==="cover"].filter(Boolean).length;const v=n*15+Math.min(35,solved.length*5)+Math.min(5,broken.length*2);setScore(v);onFinish(v)}
 const nav:[Tab,string][]=[["brief","案情"],["people","关系人"],["evidence","证据室"],["clock","时限图"],["board","推理板"],["interview","询问室"],["close","结案"]];
 return <main className="vigil-app"><header className="vigil-top"><div><small>PHARMACOVIGILANCE TASKFORCE</small><h1>药研悬案局 <i>/ 第四案</i></h1></div><aside><span>AE-L047</span><b>{progress}%</b><em><i style={{width:Math.max(3,progress)+"%"}}/></em></aside></header><nav className="vigil-nav">{nav.map(([x,l],i)=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}><small>0{i+1}</small>{l}</button>)}</nav>
 {tab==="brief"&&<section className="vigil-scene vigil-brief"><p className="vigil-kicker">CASE AE-L047 · 严重不良事件瞒报</p><h2>沉默的七小时</h2><p className="vigil-lead">危急值电话在上午八点十四分接通。系统里，这条不良事件的知晓时间是下午三点二十。空白的七个小时里，受试者又服下了一次药。</p><div className="alert-card"><div>047</div><article><small>SUBJECT L-047 · 58F</small><h3>报告时限异常告警</h3><p>危急值 08:14　EDC 录入 15:20　院外死亡 03-23</p></article><strong>7:06</strong></div><div className="vigil-cols"><article><h3>调查目标</h3><p>还原事件的真实严重程度与转归，查清七小时空白期内发生了什么，并确认“与药物无关”这一判定是如何形成的。</p></article><article><h3>风险</h3><p>若一例相关死亡被降级并以失访结案，安全性数据库、获益风险评估与在研的上市申请全部建立在错误的基线上。</p></article></div><button className="vigil-action" onClick={()=>setTab("evidence")}>调取安全性材料 →</button></section>}
 {tab==="people"&&<section className="vigil-scene"><Head k="PERSONS UNDER REVIEW" t="关系人" p="有人接了电话，有人改了字段，有人写下了不会被扫描的那一页。"/><div className="vigil-people">{people.map(p=><article key={p.id}><div style={{background:p.color}}>{p.initial}</div><span>{p.role}</span><h3>{p.name}</h3><p>{p.note}</p></article>)}</div></section>}
 {tab==="evidence"&&<section className="vigil-scene"><Head k={`SAFETY EVIDENCE · ${visible.length}/12`} t="证据室" p="选择两份材料，验证时限、因果或转归之间的联系。"/><div className="vigil-bench"><div className="vigil-cards">{visible.map((e,i)=><button className={pick.includes(e.id)?"picked":""} onClick={()=>select(e.id)} key={e.id}><span>S-{String(i+1).padStart(2,"0")} · {e.kind}</span><h3>{e.title}</h3><p>{e.summary}</p></button>)}</div><aside>{pick.length?pick.map(id=>{const e=ev.find(x=>x.id===id)!;return <article key={id}><small>{e.kind}</small><h3>{e.title}</h3><pre>{e.detail}</pre></article>}):<div className="vigil-none">◎<p>请选择证据原件</p></div>}<button disabled={pick.length!==2} onClick={connect}>建立证据联系</button></aside></div></section>}
 {tab==="clock"&&<section className="vigil-scene"><Head k="REPORTING CLOCK · 24H" t="时限图" p="左边是递交给监管的版本，右边是客观记录留下的版本。"/><div className="clock-line">{timeline.map(x=><article key={x.d+x.t} className={x.gap?"gap":""}><header><b>{x.d}</b><span>{x.t}</span></header><div className="official"><small>官方记录</small><p>{x.o}</p></div><div className="real"><small>客观记录</small><p>{x.r}</p></div></article>)}</div><p className="clock-note">SUSAR 的 24 小时时钟从“研究者首次知晓”起算。所以只要把知晓时间往后推，超时就消失了——但暴露没有消失。</p></section>}
 {tab==="board"&&<section className="vigil-scene"><Head k="SAFETY DEDUCTIONS" t="推理板" p={`${solved.length}/7 条推论成立`}/>{solved.length?<div className="vigil-rules">{solved.map((id,i)=>{const r=rules.find(x=>x.id===id)!;return <article key={id}><b>{String(i+1).padStart(2,"0")}</b><div><small>SAFETY LINK CONFIRMED</small><h3>{r.title}</h3><p>{r.text}</p></div></article>})}</div>:<Empty go={()=>setTab("evidence")} text="从那通电话和审计轨迹开始，也许能先回答“他们到底什么时候知道的”。"/>}</section>}
 {tab==="interview"&&<section className="vigil-scene"><Head k="STATEMENT CHALLENGE" t="证词核验" p={`${broken.length}/3 处矛盾已确认`}/>{broken.includes(statements[si].who)&&si===2?<Empty go={()=>setTab("close")} text="三份证词均已被客观记录击破，可以准备结案。"/>:<div className="vigil-talk"><aside><div style={{background:people.find(p=>p.name===statements[si].who)?.color}}>{people.find(p=>p.name===statements[si].who)?.initial}</div><h3>{statements[si].who}</h3></aside><article><small>STATEMENT {si+1}/3</small><blockquote>“{statements[si].quote}”</blockquote><h4>{statements[si].ask}</h4><div>{visible.map(e=><button onClick={()=>challenge(e.id)} key={e.id}><span>{e.kind}</span>{e.title}</button>)}</div></article></div>}</section>}
 {tab==="close"&&<section className="vigil-scene"><Head k="SAFETY REPORTING VERDICT" t="结案报告" p="指出被改写的是哪几个字段，以及那七小时的代价。"/>{score===null?<div className="vigil-form"><Q n="01" t="这起事件的真实严重程度与转归是什么？" v={ans.grade} set={x=>setAns({...ans,grade:x})} opts={[["moderate","中度不良事件，受试者失访"],["severe","符合 Hy's Law 的重度药物性肝损伤，受试者已死亡"],["baseline","既往脂肪肝急性进展，与试验无关"]]}/><Q n="02" t="08:14 到 15:20 这七小时里，最关键的事实是什么？" v={ans.gap} set={x=>setAns({...ans,gap:x})} opts={[["clerical","只是录入延迟，对受试者没有实际影响"],["dose","危急值已被知晓的情况下，受试者又服用了当日剂量"],["unreachable","检验科始终未能联系上研究中心"]]}/><Q n="03" t="“与试验用药无关”这一判定是怎么形成的？" v={ans.cause} set={x=>setAns({...ans,cause:x})} opts={[["independent","研究者基于既往病史的独立医学判断"],["directed","申办方指示定性，PI 在顾问会期间签署，并事后补录既往肝病作为依据"],["ethics","伦理委员会集体审议后的结论"]]}/><Q n="04" t="把转归写成“失访”意味着什么？" v={ans.outcome} set={x=>setAns({...ans,outcome:x})} opts={[["true","确实无法联系到受试者"],["cover","用停机号完成三次拨打的形式，回避必须上报的死亡结局"],["withdraw","受试者本人主动退出了研究"]]}/><button disabled={Object.values(ans).some(x=>!x)} className="vigil-action submit" onClick={finish}>提交安全性结论</button></div>:<div className="vigil-report"><div><small>VIGILANCE SCORE</small><strong>{score}</strong><span>/100</span></div><h3>{score===100?"时限链与因果链完整闭合":"仍有关键责任未厘清"}</h3><p>{score===100?"你证明了这不是一次迟报，而是一条从接电话、发药、改字段到签字的完整链条——每一环都有人知道自己在做什么。":"重新比较通话登记、审计轨迹、筛选期原件与随访通话明细。"}</p>{score===100&&<article><h4>封存真相</h4><p>03-14 08:14 检验科已电话报告危急值，接听人邵冉未回签；13:40 她仍向 L-047 发放并监督服用当日剂量。EDC 首版如实记下知晓时间 08:20，随后被两次修改，最终后移到 03-15，使 24 小时 SUSAR 时限在纸面上成立。何家树将严重程度由 severe 改为 moderate、相关性由 probable 改为 not related；江砚在申办方年度顾问会期间于酒店网段签署因果判定，判定依据是一条在前一夜才补录进病史页的“既往中度脂肪肝”。祝小满写下“用药与发病时间关系密切、建议按 SUSAR 上报”的会诊意见后被移出群组，那页原件从未扫描进 EDC。03-23 L-047 因急性肝衰竭死亡，死亡证明由邵冉签收；三次“失访”随访电话拨的都是同一个停机号，知情同意书上登记的家属号码从未被拨打。</p></article>}<button onClick={()=>{setScore(null);setAns({grade:"",gap:"",cause:"",outcome:""})}}>重新提交</button></div>}</section>}
 <div className={toast?"vigil-toast show":"vigil-toast"}>{toast}</div></main>
}
function Head({k,t,p}:{k:string;t:string;p:string}){return <header className="vigil-head"><div><small>{k}</small><h2>{t}</h2></div><p>{p}</p></header>}
function Empty({go,text}:{go:()=>void;text:string}){return <div className="vigil-empty"><strong>◉</strong><h3>等待进一步核验</h3><p>{text}</p><button className="vigil-action" onClick={go}>继续调查</button></div>}
function Q({n,t,v,set,opts}:{n:string;t:string;v:string;set:(x:string)=>void;opts:string[][]}){return <fieldset><legend><span>{n}</span>{t}</legend>{opts.map(x=><label className={v===x[0]?"on":""} key={x[0]}><input type="radio" checked={v===x[0]} onChange={()=>set(x[0])}/><i/>{x[1]}</label>)}</fieldset>}
