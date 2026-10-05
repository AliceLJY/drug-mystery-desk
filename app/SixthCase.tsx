"use client";
import {useState} from "react";
import "./sixth-case.css";

type Tab="brief"|"people"|"evidence"|"versions"|"board"|"interview"|"close";
type E={id:string;title:string;kind:string;summary:string;detail:string};
type R={id:string;pair:[string,string];title:string;text:string;unlock?:string};
const people=[
 {id:"ling",name:"凌秋",role:"临床研究协调员 CRC",initial:"凌",color:"#6b4766",note:"中心 12 的 CRC，负责知情同意文件的版本管理与归档。L-12-026 的谈话记录，是她填写的。"},
 {id:"pan",name:"潘志远",role:"主要研究者 PI",initial:"潘",color:"#55606e",note:"神经内科副主任，中心入组排名第二。同意书“研究者签名”一栏，签的是他的名字。"},
 {id:"dong",name:"凌冬",role:"公正见证人",initial:"冬",color:"#7a5a3a",note:"见证人登记表上，她的身份是“受试者住院期间结识的朋友”。"},
 {id:"lu",name:"陆青禾",role:"受试者家属 · 举报人",initial:"陆",color:"#3e5e63",note:"受试者陆长庚的女儿。父亲住院期间，她几乎每天都在病房陪护。"},
];
const ev:E[]=[
 {id:"icf",title:"知情同意书签字页",kind:"知情同意",summary:"受试者签名是一手流畅的行书，签署日期写着 03-18。",detail:"受试者 L-12-026 · 陆长庚，男，74 岁\n受试者签名：“陆长庚”——行书，三字连笔，一气呵成\n签署日期：03-18\n公正见证人：凌冬　　研究者：潘志远\n页脚版本号：v2.0（02-10）"},
 {id:"hosp",title:"住院护理评估与既往文件",kind:"病历",summary:"“文盲，不能读写”。他以往签过的每一份文件，按的都是手印。",detail:"03-05 入院护理评估：文化程度——文盲，不能读写\n本次及既往住院的手术同意书、授权委托书共 4 份：均以右手拇指指印代替签名\n旁注：“患者不识字，由女儿逐条读给患者听”\n近亲属联系人：女儿 陆青禾"},
 {id:"sample",title:"中心实验室样本接收记录",kind:"样本记录",summary:"第一管研究血样，03-11 一早就送到了实验室。",detail:"受试者编号 L-12-026 · 访视：基线（V1）\n采样 03-11 07:40　　实验室接收 03-11 14:22\n检测项目：基线血药浓度、药物基因组学（CYP2C19 基因分型）\n两项均为研究专用检测，不属于常规临床诊疗"},
 {id:"versions",title:"伦理批件与版本更新通知",kind:"伦理文件",summary:"第 3 版自 03-01 起强制使用，新增了一条严重风险。",detail:"伦理批件：知情同意书 v3.0 于 02-26 批准，03-01 起所有新入组受试者必须使用\nv3.0 主要变更：新增“罕见但严重的出血风险，包括颅内出血”；新增基因检测与样本保存十年的告知\n申办方 02-27 通知：各中心立即回收、销毁旧版空白同意书\n中心 12 回执：“已收到，已回收”，签收人 凌秋"},
 {id:"note",title:"知情同意谈话记录",kind:"源文件",summary:"记录写着 03-18 上午由潘志远在病房谈话，受试者当场签字。",detail:"谈话时间：03-18 10:00　　地点：神经内科病房 12 床\n谈话医师：潘志远　　记录人：凌秋\n“已向受试者充分说明研究目的、过程与风险，受试者表示理解并自愿参加，当场签署知情同意书”\n谈话持续时间一栏：空白"},
 {id:"drug",title:"随机与给药记录",kind:"药物记录",summary:"03-11 当天他就完成随机、服下首剂；三天后开始牙龈出血。",detail:"03-11 07:15 IWRS 随机，随机号 R-0418（操作人 凌秋）\n03-11 18:30 首剂 HX-301，护士执行签名\n给药前核查表“知情同意书已签署”：已勾选，核查人 凌秋\n03-14 主诉刷牙后牙龈出血不止，记录为“轻度，与研究药物可能相关”"},
 {id:"pi",title:"PI 外出会诊与派车记录",kind:"出勤记录",summary:"03-18 全天，潘志远都在外院会诊。",detail:"03-18 外院会诊申请单：会诊医师 潘志远\n医院派车记录：07:50 出发，18:20 返院\n当日 HIS 中无其本人开具的任何医嘱、病历或签名\n同日本院门诊、病房均无其排班"},
 {id:"witness",title:"见证人登记与员工档案",kind:"人事档案",summary:"“公正见证人”凌冬，是 CRC 凌秋的妹妹。",detail:"见证人登记表：凌冬，身份“受试者住院期间结识的朋友”\nSMO 员工档案：凌秋，紧急联系人 凌冬，关系：妹妹\n凌冬为本院行政楼外包保洁员，负责区域含研究资料室所在楼层\nGCP：公正见证人应独立于试验，不得受研究人员影响"},
 {id:"call",title:"家属举报信",kind:"举报材料",summary:"父亲不识字、只会按手印；03-18 她整天都在病房，没有人来签过字。",detail:"陆青禾致伦理委员会：\n“我父亲不识字，签什么都是按手印。”\n“入院时只听说是医院的新药，免费。没人说过这是试验，更没人说过会出血。”\n“3 月 18 日我在病房陪了一整天，没有任何人来让他签过东西。”\n“那个叫凌冬的见证人，我们全家没有一个人认识。”"},
 {id:"mail",title:"CRC 与 PI 的往来消息",kind:"数字取证",summary:"有人说“老人一看到就不签了”，有人回“旧版先用着”。",detail:"02-28 凌秋：v3 加了颅内出血那条，今天拿新版给两位老人看，一看到这条就都不签了。\n02-28 潘志远：旧版空白的还有吗？先用着，伦理那边我来解释。\n03-10 凌秋：陆老先生明早先随机、抽血，同意书我后面补。\n03-17 凌秋：后天监查要来查他的同意书。\n03-17 潘志远：明天补好。日期就写当天，别往前倒签——补签顶多算一次方案偏离。"},
 {id:"handwriting",title:"笔迹鉴定意见",kind:"司法鉴定",summary:"同意书上的“陆长庚”三个字，出自 CRC 凌秋之手。",detail:"检材：知情同意书受试者签名“陆长庚”\n比对样本一：受试者既往文件——均为指印，无签名可比\n比对样本二：凌秋书写的谈话记录、样本标签与周报\n“长”字末笔回锋、“庚”字广字头与下部连写的方式，与凌秋书写习惯一致\n鉴定意见：倾向认定检材签名为凌秋书写"},
 {id:"access",title:"病房门禁与资料室刷卡记录",kind:"门禁记录",summary:"03-18 下午，凌秋和凌冬先后刷卡进了研究资料室。",detail:"03-18 病房门禁：当日进入 12 床病室的，仅有床位护士与家属陆青禾（07:30 入，21:10 出）\n研究资料室：14:05 凌秋工卡进入；14:11 凌冬工卡进入；16:40 两人先后离开\n资料室档案柜内，至今仍存有 v2.0 空白知情同意书 6 份\n当日研究资料室无其他人员进入"},
];
const rules:R[]=[
 {id:"cantwrite",pair:["icf","hosp"],title:"不识字的人签不出行书",text:"护理评估写着“文盲，不能读写”，他以往签的每一份文件都是手印；同意书上却是三字连笔的行书。这个名字不是他写的。",unlock:"handwriting"},
 {id:"late",pair:["icf","sample"],title:"晚到七天的签名",text:"研究专用的血样 03-11 一早就已采集，同意书上的签署日期却是 03-18。第一项研究操作做完整整七天之后，才有了这份“同意”。"},
 {id:"hide",pair:["versions","mail"],title:"被藏起来的那条风险",text:"v3.0 自 03-01 起强制使用，多出来的正是颅内出血风险；消息里说“老人一看到就不签了”“旧版先用着”。用旧版本不是疏忽，是为了不让他看到那一条。"},
 {id:"harm",pair:["drug","call"],title:"他不知道自己在冒什么险",text:"03-11 服下首剂，03-14 就开始牙龈出血；家属却说，从来没人告诉过他这是试验，更没人说过会出血。没有告诉他的风险，已经开始出现。"},
 {id:"absent",pair:["note","pi"],title:"不在场的谈话医师",text:"谈话记录写着 03-18 上午十点潘志远在病房谈话，而那天他 07:50 就随车去了外院，傍晚才回。那场谈话从来没有发生过。"},
 {id:"stranger",pair:["witness","call"],title:"家属不认识的“朋友”",text:"见证人登记为“住院期间结识的朋友”，其实是 CRC 凌秋的妹妹；家属全家都不认识她，还说那天根本没人来病房签过字。那么，签名和见证究竟发生在哪里？",unlock:"access"},
 {id:"room",pair:["handwriting","access"],title:"资料室里的两个半小时",text:"03-18 下午，凌秋和凌冬先后刷卡进入存放着旧版空白同意书的资料室，待了两个半小时；那天病房里没有任何研究人员。签名是凌秋写的，见证是凌冬签的——都在那间资料室里。"},
];
const statements=[
 {who:"潘志远",quote:"知情同意谈话是我在病房亲自做的，老人是当着我的面签的字。",answer:"pi",ask:"哪份记录说明，他说的那一天根本不在医院？"},
 {who:"凌冬",quote:"我是陆老先生住院时认识的朋友，跟做研究的那些人没有任何关系。",answer:"witness",ask:"哪份档案说明，这位“公正见证人”和研究团队是什么关系？"},
 {who:"凌秋",quote:"那个签名是陆老先生自己写的，我从来没有替任何人签过字。",answer:"handwriting",ask:"哪份材料说明，这个签名出自谁的手？"},
];
const days=[{d:"03-11",t:"随机 · 研究采血 · 首剂",c:"hot"},{d:"03-12",t:"服药"},{d:"03-13",t:"服药"},{d:"03-14",t:"牙龈出血",c:"hot"},{d:"03-15",t:"服药"},{d:"03-16",t:"服药"},{d:"03-17",t:"得知监查将至"},{d:"03-18",t:"签名日期",c:"sign"}];
const diffs=[
 {s:"研究目的",a:"评估 HX-301 预防卒中复发的疗效与安全性",b:"同 v2.0",k:""},
 {s:"研究过程",a:"随机分组，口服研究药物 12 个月，定期抽血随访",b:"同 v2.0；新增：基线抽血进行药物基因组学检测（CYP2C19）",k:"changed"},
 {s:"可能的风险",a:"胃肠道不适；轻微皮下瘀斑",b:"胃肠道不适；轻微皮下瘀斑；新增：罕见但严重的出血风险，包括颅内出血",k:"key"},
 {s:"生物样本",a:"检测完成后即销毁",b:"新增：剩余样本可保存十年用于后续研究，由受试者选择同意或不同意",k:"changed"},
 {s:"签署方式",a:"受试者本人签名；不能书写者按指印，由公正见证人在场见证朗读",b:"同 v2.0",k:""},
 {s:"生效日期",a:"02-10 起",b:"03-01 起，所有新入组受试者必须使用",k:"changed"},
];
export default function SixthCase({onFinish}:{onFinish:(n:number)=>void}){
 const [tab,setTab]=useState<Tab>("brief"),[found,setFound]=useState<string[]>(["icf","hosp","sample","versions","note","drug","pi","witness","call","mail"]),[pick,setPick]=useState<string[]>([]),[solved,setSolved]=useState<string[]>([]),[si,setSi]=useState(0),[broken,setBroken]=useState<string[]>([]),[toast,setToast]=useState(""),[ans,setAns]=useState({sign:"",delay:"",version:"",witness:""}),[score,setScore]=useState<number|null>(null);
 const visible=ev.filter(x=>found.includes(x.id)), progress=Math.min(100,Math.round((solved.length+broken.length+found.length-10)/12*100));
 const msg=(x:string)=>{setToast(x);setTimeout(()=>setToast(""),2300)};
 function select(id:string){setPick(v=>v.includes(id)?v.filter(x=>x!==id):v.length<2?[...v,id]:[v[1],id])}
 function connect(){const r=rules.find(x=>x.pair.every(y=>pick.includes(y)));if(!r){msg("两份材料尚不足以形成排他性推论");return}if(solved.includes(r.id)){msg("该推论已经记录");return}const fresh=!!r.unlock&&!found.includes(r.unlock);setSolved([...solved,r.id]);if(fresh)setFound([...found,r.unlock!]);setPick([]);msg("推论成立："+r.title+(fresh?" · 新材料入柜":""))}
 function challenge(id:string){const s=statements[si];if(broken.includes(s.who))return;if(id!==s.answer){msg("这份证据不能直接击破当前证词");return}setBroken([...broken,s.who]);msg("证词矛盾已确认");if(si<2)setTimeout(()=>setSi(si+1),600)}
 function finish(){const n=[ans.sign==="crc",ans.delay==="after",ans.version==="hide",ans.witness==="sister"].filter(Boolean).length;const v=n*15+Math.min(35,solved.length*5)+Math.min(5,broken.length*2);setScore(v);onFinish(v)}
 const nav:[Tab,string][]=[["brief","案情"],["people","关系人"],["evidence","证据室"],["versions","版本对照"],["board","推理板"],["interview","询问室"],["close","结案"]];
 const who=people.find(p=>p.name===statements[si].who);
 return <main className="ink-app"><header className="ink-top"><div><small>HUMAN SUBJECT PROTECTION OFFICE</small><h1>药研悬案局 <i>/ 第六案</i></h1></div><aside><span>ICF-L026</span><b>{progress}%</b><em><i style={{width:Math.max(3,progress)+"%"}}/></em></aside></header><nav className="ink-nav">{nav.map(([x,l],i)=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}><small>0{i+1}</small>{l}</button>)}</nav>
 {tab==="brief"&&<section className="ink-scene ink-brief"><p className="ink-kicker">CASE ICF-L026 · 知情同意造假</p><h2>晚到七天的签名</h2><p className="ink-lead">七十四岁的陆长庚不识字，一辈子签什么都按手印。可他的知情同意书上，是一手漂亮的行书。签名旁边的日期，比他抽第一管研究血样晚了整整七天。</p><div className="ink-alert"><div>026</div><article><small>SUBJECT L-12-026 · 74M</small><h3>知情同意稽查异常</h3><p>首次研究操作 03-11　签署日期 03-18　版本 v2.0</p></article><strong>+7天</strong></div><div className="ink-cols"><article><h3>调查目标</h3><p>查清这个签名出自谁手、为什么晚了七天，以及他在同意之前究竟有没有被告知全部风险。</p></article><article><h3>风险</h3><p>没有真实有效的知情同意，就不该有任何研究操作。他的每一管血、每一剂药，都发生在“同意”之前。</p></article></div><button className="ink-action" onClick={()=>setTab("evidence")}>调取知情同意档案 →</button></section>}
 {tab==="people"&&<section className="ink-scene"><Head k="PERSONS UNDER REVIEW" t="关系人" p="有人在资料室里写下了一个名字，有人在旁边签下了“见证”。"/><div className="ink-people">{people.map(p=><article key={p.id}><div style={{background:p.color}}>{p.initial}</div><span>{p.role}</span><h3>{p.name}</h3><p>{p.note}</p></article>)}</div></section>}
 {tab==="evidence"&&<section className="ink-scene"><Head k={`CONSENT EVIDENCE · ${visible.length}/12`} t="证据室" p="选择两份材料，检验签名、日期与版本之间的联系。"/><div className="ink-bench"><div className="ink-cards">{visible.map((e,i)=><button className={pick.includes(e.id)?"picked":""} onClick={()=>select(e.id)} key={e.id}><span>C-{String(i+1).padStart(2,"0")} · {e.kind}</span><h3>{e.title}</h3><p>{e.summary}</p></button>)}</div><aside>{pick.length?pick.map(id=>{const e=ev.find(x=>x.id===id)!;return <article key={id}><small>{e.kind}</small><h3>{e.title}</h3><pre>{e.detail}</pre></article>}):<div className="ink-none">◎<p>请选择证据原件</p></div>}<button disabled={pick.length!==2} onClick={connect}>建立证据联系</button></aside></div></section>}
 {tab==="versions"&&<section className="ink-scene"><Head k="ICF VERSION COMPARE" t="版本对照" p="左边是他签的那一版，右边是他本该签的那一版。"/><div className="ver-days">{days.map((x,i)=><div key={x.d} className={x.c||""}><b>{x.d}</b><span>{x.t}</span>{i>0&&<i>第 {i} 天</i>}</div>)}</div><p className="ver-gap">研究采血与首剂都在 03-11；签名日期是 03-18。这七天里，他一直在服用一种他并未“同意”的研究药物。</p><div className="ver-table"><div className="ver-row ver-th"><span>章节</span><span>v2.0 · 他签的版本（02-10）</span><span>v3.0 · 03-01 起必须使用</span></div>{diffs.map(x=><div key={x.s} className={"ver-row "+x.k}><span>{x.s}</span><p>{x.a}</p><p>{x.b}</p></div>)}</div><p className="ver-note">签署方式一栏两个版本写的都一样：不能书写的受试者，按指印，由公正见证人在场朗读并见证。——而他的同意书上，是一手行书。</p></section>}
 {tab==="board"&&<section className="ink-scene"><Head k="CONSENT DEDUCTIONS" t="推理板" p={`${solved.length}/7 条推论成立`}/>{solved.length?<div className="ink-rules">{solved.map((id,i)=>{const r=rules.find(x=>x.id===id)!;return <article key={id}><b>{String(i+1).padStart(2,"0")}</b><div><small>CONSENT LINK CONFIRMED</small><h3>{r.title}</h3><p>{r.text}</p></div></article>})}</div>:<Empty go={()=>setTab("evidence")} text="从签字页本身开始：一个不识字的老人，签得出这样的名字吗？"/>}</section>}
 {tab==="interview"&&<section className="ink-scene"><Head k="STATEMENT CHALLENGE" t="证词核验" p={`${broken.length}/3 处矛盾已确认`}/>{broken.includes(statements[si].who)&&si===2?<Empty go={()=>setTab("close")} text="三份证词均已被客观记录击破，可以准备结案。"/>:<div className="ink-talk"><aside><div style={{background:who?.color}}>{who?.initial}</div><h3>{statements[si].who}</h3></aside><article><small>STATEMENT {si+1}/3</small><blockquote>“{statements[si].quote}”</blockquote><h4>{statements[si].ask}</h4><div>{visible.map(e=><button onClick={()=>challenge(e.id)} key={e.id}><span>{e.kind}</span>{e.title}</button>)}</div></article></div>}</section>}
 {tab==="close"&&<section className="ink-scene"><Head k="CONSENT VERDICT" t="结案报告" p="说清楚：谁写下了这个名字，签名为什么晚了七天，他又少知道了什么。"/>{score===null?<div className="ink-form"><Q n="01" t="同意书上“陆长庚”这三个字是谁写的？" v={ans.sign} set={x=>setAns({...ans,sign:x})} opts={[["self","陆长庚本人：住院期间学会了写自己的名字"],["crc","CRC 凌秋：她在资料室里替一个不识字的老人写下了名字"],["daughter","女儿陆青禾代签，事后又反悔举报"]]}/><Q n="02" t="03-18 这个签名日期说明了什么？" v={ans.delay} set={x=>setAns({...ans,delay:x})} opts={[["typo","笔误，签字其实发生在 03-11 当天"],["recon","03-18 是正常的再次知情同意，因为方案有了更新"],["after","研究采血与首剂都在 03-11，同意书是七天后、监查来之前补出来的"]]}/><Q n="03" t="为什么偏偏用了已经作废的 v2.0？" v={ans.version} set={x=>setAns({...ans,version:x})} opts={[["hide","v3.0 写进了颅内出血风险，有人担心老人看到后拒绝参加，于是继续使用旧版本"],["stock","新版本还没印好，只能先用旧的"],["ethics","伦理委员会特批这家中心继续使用旧版本"]]}/><Q n="04" t="“公正见证人”凌冬在这件事里是什么角色？" v={ans.witness} set={x=>setAns({...ans,witness:x})} opts={[["friend","受试者住院期间结识的朋友，确实在场见证"],["family","家属委托的代理人，代表家属在场见证"],["sister","CRC 凌秋的妹妹，从未见过受试者，在资料室里补签了“见证”"]]}/><button disabled={Object.values(ans).some(x=>!x)} className="ink-action submit" onClick={finish}>提交稽查结论</button></div>:<div className="ink-report"><div><small>CONSENT SCORE</small><strong>{score}</strong><span>/100</span></div><h3>{score===100?"一份从未发生过的同意":"仍有关键环节未厘清"}</h3><p>{score===100?"你证明了这份同意书上的每一个要素——签名、日期、版本、见证——都是事后在资料室里补出来的。":"重新比较签字页、护理评估、版本更新通知与门禁记录。"}</p>{score===100&&<article><h4>封存真相</h4><p>v3.0 知情同意书自 03-01 起强制使用，新增了颅内出血风险。两位老人看到这一条后拒绝参加，凌秋与潘志远决定继续使用本该回收的 v2.0。03-10，凌秋在消息里说“陆老先生明早先随机、抽血，同意书我后面补”。03-11 一早，不识字的陆长庚完成随机和研究采血，当晚服下首剂；给药前核查表上，“知情同意书已签署”一栏由凌秋勾选。03-14 他开始牙龈出血——正是旧版本没有写的那类风险。03-17 得知监查将至，潘志远交代：明天补好，日期就写当天，别往前倒签——补签顶多算一次方案偏离。他们宁可让人发现“晚了七天”，也不能让人发现那根本不是他签的。03-18，潘志远全天在外院会诊；下午两点，凌秋和在行政楼做保洁的妹妹凌冬先后刷卡进入研究资料室，用柜里剩下的 v2.0 空白同意书，替一个一辈子只会按手印的老人写下了三字连笔的“陆长庚”，凌冬以“住院期间结识的朋友”身份签下见证，谈话记录则写成当天上午由潘志远在病房完成。那一天，陆青禾在病房陪了父亲一整天，没有任何人来过。</p></article>}<button onClick={()=>{setScore(null);setAns({sign:"",delay:"",version:"",witness:""})}}>重新提交</button></div>}</section>}
 <div className={toast?"ink-toast show":"ink-toast"}>{toast}</div></main>
}
function Head({k,t,p}:{k:string;t:string;p:string}){return <header className="ink-head"><div><small>{k}</small><h2>{t}</h2></div><p>{p}</p></header>}
function Empty({go,text}:{go:()=>void;text:string}){return <div className="ink-empty"><strong>◉</strong><h3>等待进一步核验</h3><p>{text}</p><button className="ink-action" onClick={go}>继续调查</button></div>}
function Q({n,t,v,set,opts}:{n:string;t:string;v:string;set:(x:string)=>void;opts:string[][]}){return <fieldset><legend><span>{n}</span>{t}</legend>{opts.map(x=><label className={v===x[0]?"on":""} key={x[0]}><input type="radio" checked={v===x[0]} onChange={()=>set(x[0])}/><i/>{x[1]}</label>)}</fieldset>}
