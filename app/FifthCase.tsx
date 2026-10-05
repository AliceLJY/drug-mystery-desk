"use client";
import {useState} from "react";
import "./fifth-case.css";

type Tab="brief"|"people"|"evidence"|"ecg"|"board"|"interview"|"close";
type E={id:string;title:string;kind:string;summary:string;detail:string};
type R={id:string;pair:[string,string];title:string;text:string;unlock?:string};
const people=[
 {id:"qin",name:"秦露",role:"临床研究协调员 CRC",initial:"秦",color:"#2f6a55",note:"SMO 派驻中心 07 的唯一一名 CRC，负责筛选登记、心电图采集、样本处理与补助发放。第三季度，她一个人完成了七例入组。"},
 {id:"gu",name:"顾成章",role:"主要研究者 PI",initial:"顾",color:"#5b4a3a",note:"心内科主任，门诊量全院第一，同时担任四项试验的主要研究者。七份入选确认书上，都是他的电子签名。"},
 {id:"ye",name:"叶嘉",role:"SMO 项目经理",initial:"叶",color:"#4a5568",note:"负责中心 07 的入组进度。启动五个月只入组两例，这家中心在季度会上被点了名。"},
 {id:"bai",name:"白芷",role:"心电核心实验室判读医师",initial:"白",color:"#7d4a5a",note:"她在判读第七份基线心电图时停了下来，把前六份调出来，叠在了一起。"},
];
const ev:E[]=[
 {id:"alert",title:"心电核心实验室警示函",kind:"外部判读",summary:"七份基线心电图逐点重合，连同一簇伪影都在同一个位置。",detail:"中心 07 · 受试者 S07-011 至 S07-017 · 基线 12 导联心电图\n七份记录两两逐点相关系数均为 1.0000\n心率均为 76 次/分，QTcF 均为 413 ms，电轴均为 +72°\nV1 导联均呈 rSr′ 形态；第 4 个心搏之后，同一位置出现一簇肌电干扰伪影\n判读意见：不同个体之间不可能出现这种一致性，请中心核实。"},
 {id:"lab",title:"中心实验室血液检测汇总",kind:"检验数据",summary:"七个人的血常规几乎一模一样，而且都像同一位地贫携带者。",detail:"七人筛选期血常规：Hb 119–121 g/L，MCV 64.8–65.2 fL，MCH 20.1–20.3 pg，铁蛋白正常\n小细胞低色素而不缺铁，符合地中海贫血携带者的特征\n七人之间的差异，全部落在同一份样本重复测定的波动范围之内\n其中五人登记为男性，血红蛋白低于男性参考下限 130 g/L，恰好落在女性正常范围\n七份报告的异常值一律勾选“无临床意义”，签名：顾成章。"},
 {id:"pk",title:"血药浓度汇总",kind:"药代数据",summary:"随机到试验药组的四个人，每一个时间点都测不到药。",detail:"应稽查要求，由独立揭盲统计师核对，不向中心披露其他受试者的分组\n七人中四人随机至试验药组（KV-218 片），三人在安慰剂组\n四名试验药组受试者第 2、4、8 周谷浓度：全部低于定量下限\n全试验其余试验药组受试者：谷浓度中位数 38.6 ng/mL，低于定量下限者不足 2%。"},
 {id:"kits",title:"药物发放与回收记录",kind:"药物记录",summary:"七个人的依从性全是 100%，返还的药板一格不剩。",detail:"截至第 8 周访视，七人共返还药盒 14 盒（每人 2 盒，每盒 28 片），药板全部为空\n依从性：七人均为 100%（全试验平均 86%）\n七人从未漏服、从未超窗，也从未报告过任何不良事件\n药物回收清点与销毁交接签名：均为秦露。"},
 {id:"his",title:"医院 HIS 与身份核验",kind:"身份核验",summary:"七个人在医院系统里没有一次挂号，三个身份证号连校验位都不成立。",detail:"七人在本院 HIS 中均无挂号、门诊病历、检查或收费记录\n七个身份证号中，三个第 18 位校验码不成立，属于无效号码\n其余四个号码经实名核验，登记姓名与筛选表上的姓名均不一致\n筛选表上的“门诊转介医生”一栏，七份全部空白。"},
 {id:"log",title:"中心筛选入组日志",kind:"入组记录",summary:"五个月只入组两例，随后三个周六下午入组了七例。",detail:"中心 07 启动后五个月：筛选 10 例，入组 2 例\n08-02、08-09、08-16 三个周六下午：筛选 7 例、入组 7 例，筛选失败率 0%（全试验平均 41%）\n心内科门诊周六停诊\n此后七人的每一次随访都落在理想访视日当天，零超窗、零失访\n筛选登记与访视记录填写人：秦露。"},
 {id:"pisign",title:"PI 签名日志与差旅审批",kind:"签名记录",summary:"三个筛选日他都在外地，七份入选确认在九分钟内签完。",detail:"08-02、08-09、08-16：顾成章的差旅审批显示在外地参加学术会议并授课\n七份“研究者入选确认”电子签名：08-18（周一）08:10–08:19，九分钟内连续完成\n签名时，七人均已完成随机并领取首剂药物\n中心授权分工表：入选标准评估只授权给 PI 与两名副研究者，CRC 无此授权。"},
 {id:"smo",title:"SMO 入组激励方案与绩效邮件",kind:"合同与邮件",summary:"每入组一例奖励 1500 元，季度入组满六例才能转正。",detail:"SMO 内部激励方案：CRC 每完成一例入组奖励 1500 元，季度“入组之星”另奖 5000 元\n秦露试用期考核条件：第三季度独立完成入组不少于 6 例\n叶嘉 07-28 邮件：“07 中心再这样下去，申办方就要关中心了，你的岗位也一起没了。”\n第三季度，秦露以 7 例入组获评“入组之星”。"},
 {id:"pay",title:"受试者补助发放明细",kind:"财务记录",summary:"七个人的交通与营养补助，打进了同一张银行卡。",detail:"七人累计补助 23,800 元，按访视由医院财务代发\n七人登记的收款账户为同一张借记卡，尾号 6170\n开户人：秦某英，开户地与秦露的户籍地相同\n本中心另外两名受试者，均为本人账户收款。"},
 {id:"real",title:"同机对照心电图",kind:"对照记录",summary:"同一台机器记录的其他人，没有一份长得一样。",detail:"同一台心电图机、同一季度记录的 11 名受试者（含本中心另外两名受试者及其他试验的受试者）\n心率 58–94 次/分，电轴 −12° 至 +81°，形态各不相同\n11 份记录中，没有一份出现 V1 导联 rSr′，也没有那一簇伪影\n设备年度计量校准合格，导联线与滤波参数无异常。"},
 {id:"health",title:"秦露入职体检报告",kind:"体检档案",summary:"她自己的心电图里也有那个 rSr′，血常规也是同一种地贫。",detail:"应调查要求由 SMO 人事提供 · 秦露，女，29 岁 · 体检机构出具\n心电图：窦性心律 68 次/分，V1 导联 rSr′，电轴 +73°，QTcF 411 ms\n血常规：Hb 120 g/L，MCV 65.0 fL，MCH 20.2 pg\n既往史：自述 α 地中海贫血携带者（婚检时发现）\n这份心电图由体检机构的另一台设备采集，没有伪影。"},
 {id:"device",title:"心电图机内部日志",kind:"设备日志",summary:"那天下午只采集过一次心电图，却被另存了七次。",detail:"08-16（周六）14:02 采集 12 导联心电图一份，患者信息栏为“临时”，操作员工号 C-0716（秦露）\n14:09–14:51 该记录被“编辑患者信息后另存”7 次，每次间隔 7 分钟\n每次另存都修改了姓名、受试者编号，并把采集日期改为各自的基线访视日\n15:03 七份记录一并上传至心电核心实验室\n当天设备再无其他采集；内部日志不可由操作员删除。"},
];
const rules:R[]=[
 {id:"body",pair:["alert","lab"],title:"七个编号，同一个身体",text:"七份心电图逐点重合，七份血样之间的差异，没有超出同一份样本重复测定的波动。不同的人不可能一致到这种程度——这七组数据来自同一个人。而七个人的心电图和血样，经手的也都是同一个人。",unlock:"health"},
 {id:"ghost",pair:["his","log"],title:"从未走进医院的七个人",text:"七个人在医院系统里没有一次挂号，三个身份证号根本无效；他们的筛选全都发生在心内科停诊的周六下午。没人见过他们，因为他们从来没有来过。"},
 {id:"drug",pair:["pk","kits"],title:"空药板与零浓度",text:"返还的药板一格不剩，依从性 100%；可四名试验药组受试者在每个时间点都测不到药。提供血样的人从未服药——那些药板是被人一格一格按空的。"},
 {id:"machine",pair:["real","alert"],title:"不是机器的问题",text:"同一台机器记录的其他人各不相同，也没有那簇伪影。这七份图不仅形态相同，连伪影都在同一位置——它们根本就是同一份记录。",unlock:"device"},
 {id:"self",pair:["device","health"],title:"她给自己做了一份心电图",text:"那份“临时”记录由工号 C-0716 采集，形态与秦露本人的体检心电图一致：rSr′、电轴、QTc 都对得上。七个人血里的那种地贫，也是她的。"},
 {id:"money",pair:["smo","pay"],title:"七份补助，一张银行卡",text:"每入组一例奖励 1500 元，季度满六例才能转正；七名受试者的补助全部打进同一张卡，开户人与秦露同姓同乡。"},
 {id:"absent",pair:["pisign","log"],title:"没有人在场的周六",text:"三个筛选日 PI 都在外地，入选确认是周一早上九分钟内补签的，签字时七个人早已随机发药。周六下午的中心里，只有 CRC 一个人。"},
];
const statements=[
 {who:"叶嘉",quote:"公司从来不按入组数给 CRC 发奖金，我也没给过她任何入组压力。",answer:"smo",ask:"哪份材料说明，入组数量直接关系到她的收入和去留？"},
 {who:"顾成章",quote:"每一例入选标准，我都是当面评估过受试者本人才签的字。",answer:"pisign",ask:"哪份记录说明，他签字时不可能见过这些受试者？"},
 {who:"秦露",quote:"七位受试者的心电图，都是我在他们各自访视那天一个一个现场做的。",answer:"device",ask:"哪份记录说明，这七份心电图其实来自同一次采集？"},
];
const strips=[{no:"S07-011",d:"08-02"},{no:"S07-012",d:"08-02"},{no:"S07-013",d:"08-09"},{no:"S07-014",d:"08-09"},{no:"S07-015",d:"08-16"},{no:"S07-016",d:"08-16"},{no:"S07-017",d:"08-16"}];
const inks=["#2f6a55","#9a4432","#3c4f7c","#7a5a2c","#6b3f5e","#315b68","#1d2b25"];
// 合成 V1 导联：P 波—QRS（rS，或带 r′ 的 rSr′）—T 波；art=true 时在第 4 个心搏后加一簇肌电干扰
function ecg(hr:number,notch:boolean,art:boolean){
 const rr=6000/hr,pts:number[][]=[[0,30]];
 const qrs=notch?[[21,30],[23,25],[26,44],[29,21],[31,30]]:[[21,30],[23,25],[26,44],[29,30]];
 const noise=[[64,30],[65,24],[66,36],[67,25],[68,35],[69,26],[70,34],[71,27],[72,33],[74,30]];
 for(let i=0;6+i*rr+76<560;i++){
  const b=Math.round(6+i*rr);
  const beat=[[0,30],[4,28],[8,27],[12,29],[15,30],...qrs,[36,30],[42,28],[48,27],[54,29],[58,30],...(art&&i===3?noise:[])];
  for(const [dx,y] of beat)pts.push([b+dx,y]);
 }
 pts.push([560,30]);
 return "M"+pts.map(([x,y])=>x+" "+y).join(" L");
}
const SAME=ecg(76,true,true),OTHER=ecg(64,false,false),SELF=ecg(68,true,false),ART=(Math.round(6+3*6000/76)+69)/560*100;
export default function FifthCase({onFinish}:{onFinish:(n:number)=>void}){
 const [tab,setTab]=useState<Tab>("brief"),[found,setFound]=useState<string[]>(["alert","lab","pk","kits","his","log","pisign","smo","pay","real"]),[pick,setPick]=useState<string[]>([]),[solved,setSolved]=useState<string[]>([]),[si,setSi]=useState(0),[broken,setBroken]=useState<string[]>([]),[toast,setToast]=useState(""),[merged,setMerged]=useState(false),[ans,setAns]=useState({who:"",drug:"",pi:"",motive:""}),[score,setScore]=useState<number|null>(null);
 const visible=ev.filter(x=>found.includes(x.id)), progress=Math.min(100,Math.round((solved.length+broken.length+found.length-10)/12*100));
 const msg=(x:string)=>{setToast(x);setTimeout(()=>setToast(""),2300)};
 function select(id:string){setPick(v=>v.includes(id)?v.filter(x=>x!==id):v.length<2?[...v,id]:[v[1],id])}
 function connect(){const r=rules.find(x=>x.pair.every(y=>pick.includes(y)));if(!r){msg("两份材料尚不足以形成排他性推论");return}if(solved.includes(r.id)){msg("该推论已经记录");return}const fresh=!!r.unlock&&!found.includes(r.unlock);setSolved([...solved,r.id]);if(fresh)setFound([...found,r.unlock!]);setPick([]);msg("推论成立："+r.title+(fresh?" · 新材料入柜":""))}
 function challenge(id:string){const s=statements[si];if(broken.includes(s.who))return;if(id!==s.answer){msg("这份证据不能直接击破当前证词");return}setBroken([...broken,s.who]);msg("证词矛盾已确认");if(si<2)setTimeout(()=>setSi(si+1),600)}
 function finish(){const n=[ans.who==="self",ans.drug==="never",ans.pi==="lapse",ans.motive==="quota"].filter(Boolean).length;const v=n*15+Math.min(35,solved.length*5)+Math.min(5,broken.length*2);setScore(v);onFinish(v)}
 const nav:[Tab,string][]=[["brief","案情"],["people","关系人"],["evidence","证据室"],["ecg","心电图"],["board","推理板"],["interview","询问室"],["close","结案"]];
 const who=people.find(p=>p.name===statements[si].who);
 return <main className="pulse-app"><header className="pulse-top"><div><small>CLINICAL DATA INTEGRITY UNIT</small><h1>药研悬案局 <i>/ 第五案</i></h1></div><aside><span>PULSE-07</span><b>{progress}%</b><em><i style={{width:Math.max(3,progress)+"%"}}/></em></aside></header><nav className="pulse-nav">{nav.map(([x,l],i)=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}><small>0{i+1}</small>{l}</button>)}</nav>
 {tab==="brief"&&<section className="pulse-scene pulse-brief"><p className="pulse-kicker">CASE PULSE-07 · 幽灵受试者</p><h2>同一颗心跳</h2><p className="pulse-lead">心电核心实验室的判读医师把七份基线心电图叠在一起。七条曲线严丝合缝，连那一簇肌电干扰都落在同一个位置。七名受试者，七个编号，只有一颗心跳。</p><div className="pulse-alert"><div>07</div><article><small>SITE 07 · S07-011 — S07-017</small><h3>心电数据一致性警示</h3><p>七份基线心电图　相关系数 1.0000　伪影位置一致</p></article><strong>×7</strong></div><div className="pulse-cols"><article><h3>调查目标</h3><p>查明这七名受试者是否真实存在、这些心电图和血样究竟来自谁，以及没有人看见的那三个周六下午，中心里发生了什么。</p></article><article><h3>风险</h3><p>如果七名“受试者”进入主分析，四个从未服药的试验药组数据会稀释疗效，三个不存在的安慰剂组数据会污染对照——整家中心的数据都可能被剔除。</p></article></div><button className="pulse-action" onClick={()=>setTab("evidence")}>调取核查材料 →</button></section>}
 {tab==="people"&&<section className="pulse-scene"><Head k="PERSONS UNDER REVIEW" t="关系人" p="有人在周六下午打开了心电图机，有人在周一早上补签了名字。"/><div className="pulse-people">{people.map(p=><article key={p.id}><div style={{background:p.color}}>{p.initial}</div><span>{p.role}</span><h3>{p.name}</h3><p>{p.note}</p></article>)}</div></section>}
 {tab==="evidence"&&<section className="pulse-scene"><Head k={`INTEGRITY EVIDENCE · ${visible.length}/12`} t="证据室" p="选择两份材料，检验身份、数据与签名之间的联系。"/><div className="pulse-bench"><div className="pulse-cards">{visible.map((e,i)=><button className={pick.includes(e.id)?"picked":""} onClick={()=>select(e.id)} key={e.id}><span>D-{String(i+1).padStart(2,"0")} · {e.kind}</span><h3>{e.title}</h3><p>{e.summary}</p></button>)}</div><aside>{pick.length?pick.map(id=>{const e=ev.find(x=>x.id===id)!;return <article key={id}><small>{e.kind}</small><h3>{e.title}</h3><pre>{e.detail}</pre></article>}):<div className="pulse-none">◎<p>请选择证据原件</p></div>}<button disabled={pick.length!==2} onClick={connect}>建立证据联系</button></aside></div></section>}
 {tab==="ecg"&&<section className="pulse-scene"><Head k="ECG OVERLAY · LEAD V1" t="心电图比对" p="七名受试者的基线心电图，按 V1 导联排开。高亮处是那一簇肌电干扰。"/><div className="ecg-board"><div className="ecg-paper tall"><svg viewBox="0 0 560 210" preserveAspectRatio="none" aria-hidden="true"><g transform="translate(0 75)">{strips.map((s,i)=><path key={s.no} className="ecg-trace" style={{transform:`translateY(${merged?0:(i-3)*26}px)`}} d={SAME} stroke={inks[i]}/>)}</g></svg><i className="ecg-art" style={{left:ART+"%"}}><span>同一簇伪影</span></i></div><div className="ecg-legend">{strips.map((s,i)=><span key={s.no}><i style={{background:inks[i]}}/>{s.no} · {s.d}</span>)}</div><button className="pulse-action" onClick={()=>setMerged(!merged)}>{merged?"← 分开查看":"把七份叠在一起 →"}</button><p className="ecg-cap">{merged?"七条曲线完全重合，只剩最上面那一条的颜色。七个人的心电图可以都正常，却不可能一模一样——它几乎和指纹一样因人而异。":"七名受试者，三个不同的日期，同样的心率、同样的 rSr′，同一个位置的一簇伪影。"}</p></div><h3 className="ecg-sub">对照记录</h3><div className="ecg-refs"><article><header><b>S07-003</b><span>同机对照 · 本中心真实受试者</span><em>64 次/分 · QTcF 401 ms · 电轴 +38°</em></header><div className="ecg-paper"><svg viewBox="0 0 560 60" preserveAspectRatio="none" aria-hidden="true"><path className="ecg-trace" d={OTHER} stroke="#3c4f4a"/></svg></div></article>{found.includes("health")?<article className="self"><header><b>秦露</b><span>入职体检 · 另一台设备采集</span><em>68 次/分 · QTcF 411 ms · 电轴 +73°</em></header><div className="ecg-paper"><svg viewBox="0 0 560 60" preserveAspectRatio="none" aria-hidden="true"><path className="ecg-trace" d={SELF} stroke="#9a4432"/></svg></div></article>:<article className="locked"><header><b>？</b><span>尚未调取</span></header><p>先弄清这七份数据为什么一模一样，也许就知道该去调谁的心电图。</p></article>}</div></section>}
 {tab==="board"&&<section className="pulse-scene"><Head k="INTEGRITY DEDUCTIONS" t="推理板" p={`${solved.length}/7 条推论成立`}/>{solved.length?<div className="pulse-rules">{solved.map((id,i)=>{const r=rules.find(x=>x.id===id)!;return <article key={id}><b>{String(i+1).padStart(2,"0")}</b><div><small>INTEGRITY LINK CONFIRMED</small><h3>{r.title}</h3><p>{r.text}</p></div></article>})}</div>:<Empty go={()=>setTab("evidence")} text="从核心实验室那封警示函开始：七份一模一样的心电图，和七份几乎一模一样的血样，说明了什么？"/>}</section>}
 {tab==="interview"&&<section className="pulse-scene"><Head k="STATEMENT CHALLENGE" t="证词核验" p={`${broken.length}/3 处矛盾已确认`}/>{broken.includes(statements[si].who)&&si===2?<Empty go={()=>setTab("close")} text="三份证词均已被客观记录击破，可以准备结案。"/>:<div className="pulse-talk"><aside><div style={{background:who?.color}}>{who?.initial}</div><h3>{statements[si].who}</h3></aside><article><small>STATEMENT {si+1}/3</small><blockquote>“{statements[si].quote}”</blockquote><h4>{statements[si].ask}</h4><div>{visible.map(e=><button onClick={()=>challenge(e.id)} key={e.id}><span>{e.kind}</span>{e.title}</button>)}</div></article></div>}</section>}
 {tab==="close"&&<section className="pulse-scene"><Head k="DATA INTEGRITY VERDICT" t="结案报告" p="说清楚这七个人是谁，药去了哪里，以及谁让这一切畅通无阻。"/>{score===null?<div className="pulse-form"><Q n="01" t="这七名受试者的数据来自谁？" v={ans.who} set={x=>setAns({...ans,who:x})} opts={[["self","七人并不存在：七份心电图和七管血样都来自 CRC 秦露本人"],["family","秦露动员亲属顶替入组：七人真实存在，只是不符合入选标准"],["device","七人是真实患者，心电图机故障让七份记录被同一份覆盖"]]}/><Q n="02" t="四名试验药组受试者为什么测不到药？" v={ans.drug} set={x=>setAns({...ans,drug:x})} opts={[["fast","药物代谢太快，到谷浓度采血时已经测不出来"],["never","根本没有人服药：药板是被人按空的，血样来自一个从未服药的人"],["swap","试验药在运输途中被调包，四个人吃下的其实是安慰剂"]]}/><Q n="03" t="PI 顾成章在这件事里是什么角色？" v={ans.pi} set={x=>setAns({...ans,pi:x})} opts={[["victim","完全被下属蒙在鼓里：他按流程审核了每一份材料，不应承担责任"],["mastermind","幕后主使：是他授意 CRC 伪造受试者，以保住中心的入组排名"],["lapse","不是主谋，却是失守的关口：从未见过受试者，让无授权的 CRC 代做入选判断，再九分钟补签七份"]]}/><Q n="04" t="推动这场造假的力量来自哪里？" v={ans.motive} set={x=>setAns({...ans,motive:x})} opts={[["sponsor","申办方授意中心虚报入组，以赶上上市申请的递交进度"],["quota","按例计酬的入组奖励和转正考核，加上关中心的压力；七份补助也进了同一张卡"],["belief","她相信试验药有效，想帮这项试验尽快拿到阳性结果"]]}/><button disabled={Object.values(ans).some(x=>!x)} className="pulse-action submit" onClick={finish}>提交核查结论</button></div>:<div className="pulse-report"><div><small>INTEGRITY SCORE</small><strong>{score}</strong><span>/100</span></div><h3>{score===100?"七个编号，一个人":"仍有关键环节未厘清"}</h3><p>{score===100?"你证明了这七个人从未存在过：每一份心电图、每一管血、每一块空药板，都出自同一双手。":"重新比较心电图、血常规、医院挂号记录与心电图机内部日志。"}</p>{score===100&&<article><h4>封存真相</h4><p>中心 07 启动五个月只入组两例，在季度会上被点名后，SMO 项目经理叶嘉在邮件里把关中心与秦露的岗位绑在了一起，而她的转正条件是季度入组满六例。08-02、08-09、08-16 三个周六下午，心内科停诊，PI 顾成章在外地开会，秦露一个人“筛选”了七名受试者：三个身份证号连校验位都不成立，七个人在医院系统里没有一次挂号。08-16 下午 14:02，她以“临时”患者的身份给自己做了一份心电图，随后七次修改患者信息另存，每次间隔七分钟，并把日期改成各自的基线访视日；七份血样同样抽自她本人——一位 α 地贫携带者，所以五名“男性受试者”的血红蛋白都落在女性正常范围。她把每一盒返还的药板一格格按空，依从性因此是完美的 100%，而四名“试验药组受试者”的血里从未出现过药物。七个人的 23,800 元补助打进了同一张开户人姓秦的银行卡，她本人拿到了七例入组奖励和季度“入组之星”。顾成章在周一早上九分钟内补签了七份入选确认——签字时，七个人都已经领到了第一盒药。</p></article>}<button onClick={()=>{setScore(null);setAns({who:"",drug:"",pi:"",motive:""})}}>重新提交</button></div>}</section>}
 <div className={toast?"pulse-toast show":"pulse-toast"}>{toast}</div></main>
}
function Head({k,t,p}:{k:string;t:string;p:string}){return <header className="pulse-head"><div><small>{k}</small><h2>{t}</h2></div><p>{p}</p></header>}
function Empty({go,text}:{go:()=>void;text:string}){return <div className="pulse-empty"><strong>◉</strong><h3>等待进一步核验</h3><p>{text}</p><button className="pulse-action" onClick={go}>继续调查</button></div>}
function Q({n,t,v,set,opts}:{n:string;t:string;v:string;set:(x:string)=>void;opts:string[][]}){return <fieldset><legend><span>{n}</span>{t}</legend>{opts.map(x=><label className={v===x[0]?"on":""} key={x[0]}><input type="radio" checked={v===x[0]} onChange={()=>set(x[0])}/><i/>{x[1]}</label>)}</fieldset>}
