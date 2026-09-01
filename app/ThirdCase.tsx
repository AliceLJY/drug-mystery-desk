"use client";
import {useState} from "react";
import "./third-case.css";

type Tab="brief"|"people"|"evidence"|"visits"|"board"|"interview"|"close";
type E={id:string;title:string;kind:string;summary:string;detail:string};
type R={id:string;pair:[string,string];title:string;text:string;unlock?:string};
const people=[
 {id:"yan",name:"严澈",role:"主要研究者 PI",initial:"严",color:"#4f566d",note:"明星研究者，中心入组速度全国第一。坚持所有受试者均本人到访。"},
 {id:"su",name:"苏蔓",role:"研究协调员 CRC",initial:"苏",color:"#875447",note:"负责预约、药物发放和补贴登记，熟悉每位受试者的行程。"},
 {id:"fang",name:"方启明",role:"药房管理员",initial:"方",color:"#49665b",note:"保管随机药盒与盲底信封，声称从未获知任何人的分组。"},
 {id:"wen",name:"温宁",role:"医学监查员",initial:"温",color:"#76663d",note:"最早发现照片异常，却在报告中把它写成普通录入错误。"},
];
const ev:E[]=[
 {id:"photos",title:"三次访视留档照片",kind:"影像比对",summary:"同一编号C-031，三次照片可能不是同一个人。",detail:"V1：右眉上方有浅色疤痕，左耳垂无耳洞。\nV2：无眉部疤痕，左耳垂有穿孔痕迹。\nV3：佩戴口罩，但左手腕出现星形纹身。\n知情同意照片中的C-031：右眉有疤，无耳洞，无纹身。"},
 {id:"vitals",title:"生命体征原始导出",kind:"设备数据",summary:"C-031的身高在两周内增加了7厘米。",detail:"V1：身高163.2 cm，体重58.1 kg\nV2：身高170.1 cm，体重66.8 kg\nV3：身高165.0 cm，体重60.3 kg\n设备自动上传，不允许手工修改。成年受试者不可能在两周内产生此变化。"},
 {id:"idlog",title:"身份证核验登记",kind:"源文件",summary:"纸面每次均写“核验一致”，但门诊核验设备只有首次记录。",detail:"V1 08:43：身份证读卡成功，尾号2031\nV2：无读卡记录\nV3：无读卡记录\nCRC纸质表：三次均勾选“已核验原件”。"},
 {id:"payment",title:"交通补贴支付记录",kind:"财务记录",summary:"三次补贴分别进入三个不同收款账户。",detail:"V1 收款人：程某，账户尾号1172\nV2 收款人：刘某，账户尾号9038\nV3 收款人：赵某，账户尾号4415\n三笔备注均为“C-031交通补贴”，由苏蔓提交。"},
 {id:"route",title:"门诊动线录像索引",kind:"空间记录",summary:"替访者没有经过身份证核验台，而是从员工通道进入。",detail:"V2 08:51 一名女性由苏蔓刷员工卡带入侧门。\nV2 09:04 直接进入检查室2，绕过前台。\nV3 08:38 相同方式进入，人员体貌不同。\n访视结束后均从消防通道离开。"},
 {id:"drug",title:"回收药盒称重表",kind:"药物记录",summary:"三盒“剩余片数”相同，实际重量却呈固定差值。",detail:"盲态药片A比B每片重0.18 g。\nC-031 V1回收：登记余10片，实重32.4g\nV2回收：登记余10片，实重34.2g\nV3回收：登记余10片，实重32.4g\n盒体空重相同。V2药盒中的片剂类型与V1、V3不同。"},
 {id:"random",title:"随机药盒发放序列",kind:"盲态记录",summary:"C-031的药盒被两次“误发后更正”，均由方启明处理。",detail:"系统应发：031-A17\nV1 实发：031-A17\nV2 先扫描031-B04，7秒后撤销，改为031-A18\nV3 先扫描031-B11，5秒后撤销，改为031-A19\nB04、B11属于另一包装序列，但盲态下现场人员不应知道内容差异。"},
 {id:"envelope",title:"应急揭盲信封检查",kind:"物证检查",summary:"C-031盲底信封封口完整，但纸张有透光压痕。",detail:"封口蜡与签字完整，无开启痕迹。\n强光侧照可见内页数字“ACTIVE”反向压痕。\n药房台灯下发现一块可拆卸高亮透光板，表面留有信封纤维。"},
 {id:"calendar",title:"招募截止邮件",kind:"通信记录",summary:"中心若少一例完成者，将失去第一名奖金。",detail:"严澈邮件：本周必须保住32例完成访视，否则中心排名掉到第二，年度绩效奖全部取消。\n抄送：苏蔓、温宁。\nC-031本人在V1后因工作原因提出退出。"},
 {id:"chat",title:"删除的群聊片段",kind:"数字取证",summary:"苏蔓按“体重接近”寻找替访者，方启明提供药盒提示。",detail:"苏：明天那个临时来不了，找个体重接近的顶一下。\n方：别拿错，031走轻盒。\n苏：上次那个偏高太明显。\n严：数据别断，监查前补齐。\n群聊恢复时间早于V2访视一晚。"},
 {id:"monitor",title:"监查问题单历史版本",kind:"审计记录",summary:"温宁最初写了“疑似非本人访视”，随后改成“照片上传错误”。",detail:"16:22 初稿：C-031 V2体貌与V1显著不符，疑似非本人访视，建议立即冻结。\n17:06 终稿：留档照片可能上传错误，现场确认身份无误，后续核查。\n修改前，严澈与温宁通话18分钟。"},
 {id:"parking",title:"停车场缴费与本人证明",kind:"外部记录",summary:"真正的C-031在V2当天身处另一座城市。",detail:"V2当天 08:12，C-031本人车辆驶入距研究中心640公里的工业园。\n公司考勤与午间会议录像均可交叉印证。\n本人书面确认：只参加过V1，此后明确提出退出，未领取后续药物。"},
];
const rules:R[]=[
 {id:"multiple",pair:["photos","vitals"],title:"一个编号，三个人",text:"体貌特征与身高体重同时发生不可能的变化，C-031后续访视由不同替访者完成。",unlock:"parking"},
 {id:"bypass",pair:["idlog","route"],title:"被绕过的身份核验",text:"V2、V3没有读卡记录；苏蔓通过员工侧门带人直达检查室，使替访者避开前台。"},
 {id:"money",pair:["payment","parking"],title:"本人没有回来",text:"补贴流入不同账户，而本人在另一座城市；这不是照片上传错误，而是组织化替访。"},
 {id:"blind",pair:["drug","random"],title:"有人知道轻盒与重盒",text:"V2短暂扫描了不同序列，药盒重量也显示片剂类型改变。方启明能区分盲态包装。",unlock:"envelope"},
 {id:"peek",pair:["envelope","random"],title:"未拆封的揭盲",text:"方启明利用透光板读取未开启信封，从而获知“轻盒”对应的分组，并用撤销扫描掩盖选择。"},
 {id:"plan",pair:["calendar","chat"],title:"替访计划与动机",text:"为保住完成例数和绩效奖金，严澈要求数据不断，苏蔓招募替访者，方启明确保药盒符合既定分组。"},
 {id:"cover",pair:["monitor","calendar"],title:"被降级的重大违规",text:"温宁发现身份疑点后，在严澈施压下修改监查结论，使本应冻结的受试者继续留在分析集。"},
];
const statements=[
 {who:"苏蔓",quote:"后两次都核验过身份证，只是读卡设备偶尔没有同步。",answer:"route",ask:"哪份证据能证明访视者根本没有经过核验台？"},
 {who:"方启明",quote:"盲底信封从未拆封，所以任何人都不可能知道轻盒对应什么。",answer:"envelope",ask:"哪件物证说明“不拆封”也能窥视盲底？"},
 {who:"温宁",quote:"我从一开始就只认为是照片上传错误，没有提出过身份问题。",answer:"monitor",ask:"哪份记录保存了她被修改前的真实判断？"},
];
export default function ThirdCase({onFinish}:{onFinish:(n:number)=>void}){
 const [tab,setTab]=useState<Tab>("brief"),[found,setFound]=useState<string[]>(["photos","vitals","idlog","payment","route","drug","random","calendar","chat","monitor"]),[pick,setPick]=useState<string[]>([]),[solved,setSolved]=useState<string[]>([]),[si,setSi]=useState(0),[broken,setBroken]=useState<string[]>([]),[toast,setToast]=useState(""),[ans,setAns]=useState({visitor:"",organizer:"",blind:"",monitor:""}),[score,setScore]=useState<number|null>(null);
 const visible=ev.filter(x=>found.includes(x.id)), progress=Math.min(100,Math.round((solved.length+broken.length+found.length-10)/12*100));
 const msg=(x:string)=>{setToast(x);setTimeout(()=>setToast(""),2300)};
 function select(id:string){setPick(v=>v.includes(id)?v.filter(x=>x!==id):v.length<2?[...v,id]:[v[1],id])}
 function connect(){const r=rules.find(x=>x.pair.every(y=>pick.includes(y)));if(!r){msg("两份材料尚不足以形成排他性推论");return}if(solved.includes(r.id)){msg("该推论已经记录");return}setSolved([...solved,r.id]);if(r.unlock&&!found.includes(r.unlock))setFound([...found,r.unlock]);setPick([]);msg("推论成立："+r.title)}
 function challenge(id:string){const s=statements[si];if(id!==s.answer){msg("这份证据不能直接击破当前证词");return}setBroken([...broken,s.who]);msg("证词矛盾已确认");if(si<2)setTimeout(()=>setSi(si+1),600)}
 function finish(){const n=[ans.visitor==="substitute",ans.organizer==="yan-su",ans.blind==="light",ans.monitor==="cover"].filter(Boolean).length;const v=n*15+Math.min(35,solved.length*5)+Math.min(5,broken.length*2);setScore(v);onFinish(v)}
 const nav:[Tab,string][]=[["brief","案情"],["people","关系人"],["evidence","证据室"],["visits","访视图"],["board","推理板"],["interview","询问室"],["close","结案"]];
 return <main className="blind-app"><header className="blind-top"><div><small>SUBJECT IDENTITY TASKFORCE</small><h1>药研悬案局 <i>/ 第三案</i></h1></div><aside><span>BLIND-031</span><b>{progress}%</b><em><i style={{width:Math.max(3,progress)+"%"}}/></em></aside></header><nav className="blind-nav">{nav.map(([x,l],i)=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}><small>0{i+1}</small>{l}</button>)}</nav>
 {tab==="brief"&&<section className="blind-scene blind-brief"><p className="blind-kicker">CASE BLIND-031 · 受试者身份事件</p><h2>盲区来客</h2><p className="blind-lead">一名受试者在两周内“长高”了七码。中心坚持只是设备误差，但访视照片中的耳洞、疤痕与纹身，讲述着另一个故事。</p><div className="identity-card"><div>031</div><article><small>SUBJECT C-031</small><h3>身份一致性警报</h3><p>V1 · 163.2 cm　 V2 · 170.1 cm　 V3 · 165.0 cm</p></article><strong>＋7 cm</strong></div><div className="blind-cols"><article><h3>调查目标</h3><p>确认后续访视者身份，判断替访如何绕过核验，并查清随机盲态是否被人为突破。</p></article><article><h3>风险</h3><p>若身份与用药均不可信，C-031的安全性、疗效和依从性数据必须全部排除。</p></article></div><button className="blind-action" onClick={()=>setTab("evidence")}>调取身份材料 →</button></section>}
 {tab==="people"&&<section className="blind-scene"><Head k="PERSONS UNDER REVIEW" t="关系人" p="有人安排替访，有人选择药盒，也有人选择沉默。"/><div className="blind-people">{people.map(p=><article key={p.id}><div style={{background:p.color}}>{p.initial}</div><span>{p.role}</span><h3>{p.name}</h3><p>{p.note}</p></article>)}</div></section>}
 {tab==="evidence"&&<section className="blind-scene"><Head k={`IDENTITY EVIDENCE · ${visible.length}/12`} t="证据室" p="选择两份材料，验证身份、路径或盲态之间的联系。"/><div className="blind-bench"><div className="blind-cards">{visible.map((e,i)=><button className={pick.includes(e.id)?"picked":""} onClick={()=>select(e.id)} key={e.id}><span>D-{String(i+1).padStart(2,"0")} · {e.kind}</span><h3>{e.title}</h3><p>{e.summary}</p></button>)}</div><aside>{pick.length?pick.map(id=>{const e=ev.find(x=>x.id===id)!;return <article key={id}><small>{e.kind}</small><h3>{e.title}</h3><pre>{e.detail}</pre></article>}):<div className="blind-none">◎<p>请选择证据原件</p></div>}<button disabled={pick.length!==2} onClick={connect}>建立证据联系</button></aside></div></section>}
 {tab==="visits"&&<section className="blind-scene"><Head k="VISIT IDENTITY MATRIX" t="三次访视对照" p="同一个编号，不等于同一个人。"/><div className="visit-matrix"><header><span>特征</span><b>V1 · 本人</b><b>V2</b><b>V3</b></header>{[["身高","163.2 cm","170.1 cm","165.0 cm"],["右眉疤痕","有","无","口罩遮挡"],["左耳洞","无","有","不清晰"],["左腕纹身","无","无","星形"],["身份证读卡","成功","无记录","无记录"],["进入路径","正门","员工侧门","员工侧门"]].map(x=><div key={x[0]}>{x.map((y,i)=>i?<b key={i}>{y}</b>:<span key={i}>{y}</span>)}</div>)}</div><p className="matrix-note">问题不再是“数据有没有误差”，而是：谁让不同的人共享了同一个受试者编号？</p></section>}
 {tab==="board"&&<section className="blind-scene"><Head k="IDENTITY DEDUCTIONS" t="推理板" p={`${solved.length}/7 条推论成立`}/>{solved.length?<div className="blind-rules">{solved.map((id,i)=>{const r=rules.find(x=>x.id===id)!;return <article key={id}><b>{String(i+1).padStart(2,"0")}</b><div><small>IDENTITY LINK CONFIRMED</small><h3>{r.title}</h3><p>{r.text}</p></div></article>})}</div>:<Empty go={()=>setTab("evidence")} text="从体貌与设备原始数据开始，也许能先回答‘是不是同一个人’。"/>}</section>}
 {tab==="interview"&&<section className="blind-scene"><Head k="STATEMENT CHALLENGE" t="证词核验" p={`${broken.length}/3 处矛盾已确认`}/>{broken.includes(statements[si].who)&&si===2?<Empty go={()=>setTab("close")} text="三份证词均已被客观记录击破，可以准备结案。"/>:<div className="blind-talk"><aside><div style={{background:people.find(p=>p.name===statements[si].who)?.color}}>{people.find(p=>p.name===statements[si].who)?.initial}</div><h3>{statements[si].who}</h3></aside><article><small>STATEMENT {si+1}/3</small><blockquote>“{statements[si].quote}”</blockquote><h4>{statements[si].ask}</h4><div>{visible.map(e=><button onClick={()=>challenge(e.id)} key={e.id}><span>{e.kind}</span>{e.title}</button>)}</div></article></div>}</section>}
 {tab==="close"&&<section className="blind-scene"><Head k="SUBJECT INTEGRITY VERDICT" t="结案报告" p="指出违规链条，而不只是指出某一个人。"/>{score===null?<div className="blind-form"><Q n="01" t="V2与V3的到访者是谁？" v={ans.visitor} set={x=>setAns({...ans,visitor:x})} opts={[["same","C-031本人，只是测量误差"],["substitute","不同的替访者，共用C-031编号"],["twin","未登记的双胞胎"]]}/><Q n="02" t="谁组织并维持了替访？" v={ans.organizer} set={x=>setAns({...ans,organizer:x})} opts={[["su","苏蔓个人行为"],["yan-su","严澈要求保住完成例数，苏蔓负责招募与带入"],["wen","温宁安排替访"]]}/><Q n="03" t="盲态如何被突破？" v={ans.blind} set={x=>setAns({...ans,blind:x})} opts={[["database","入侵随机系统"],["light","利用透光板读取未拆封盲底，再按重量区分药盒"],["guess","仅凭副作用猜测"]]}/><Q n="04" t="温宁在事件中的作用是什么？" v={ans.monitor} set={x=>setAns({...ans,monitor:x})} opts={[["innocent","从未发现问题"],["leader","替访计划主谋"],["cover","发现重大疑点后受压修改报告，掩盖违规"]]}/><button disabled={Object.values(ans).some(x=>!x)} className="blind-action submit" onClick={finish}>提交完整性结论</button></div>:<div className="blind-report"><div><small>INTEGRITY SCORE</small><strong>{score}</strong><span>/100</span></div><h3>{score===100?"身份链与盲态链完整闭合":"仍有关键责任未厘清"}</h3><p>{score===100?"你证明了这不是一次孤立的身份疏漏，而是一套由招募压力驱动、跨岗位配合并被监查降级的系统性违规。":"重新比较身份核验、访视路径、药盒重量与监查历史版本。"}</p>{score===100&&<article><h4>封存真相</h4><p>C-031本人只参加过V1。严澈为保住中心完成例数和奖金，要求数据不断；苏蔓寻找不同替访者，通过员工侧门绕过身份核验，并把补贴付给不同账户。方启明用透光板读取未拆封盲底，以药片重量辨别分组，确保替访时继续发放既定类型。温宁发现体貌异常，却在严澈施压后把“疑似非本人访视”改成普通照片错误。</p></article>}<button onClick={()=>{setScore(null);setAns({visitor:"",organizer:"",blind:"",monitor:""})}}>重新提交</button></div>}</section>}
 <div className={toast?"blind-toast show":"blind-toast"}>{toast}</div></main>
}
function Head({k,t,p}:{k:string;t:string;p:string}){return <header className="blind-head"><div><small>{k}</small><h2>{t}</h2></div><p>{p}</p></header>}
function Empty({go,text}:{go:()=>void;text:string}){return <div className="blind-empty"><strong>◉</strong><h3>等待进一步核验</h3><p>{text}</p><button className="blind-action" onClick={go}>继续调查</button></div>}
function Q({n,t,v,set,opts}:{n:string;t:string;v:string;set:(x:string)=>void;opts:string[][]}){return <fieldset><legend><span>{n}</span>{t}</legend>{opts.map(x=><label className={v===x[0]?"on":""} key={x[0]}><input type="radio" checked={v===x[0]} onChange={()=>set(x[0])}/><i/>{x[1]}</label>)}</fieldset>}
