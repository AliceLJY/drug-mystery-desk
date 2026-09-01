"use client";
import {useState} from "react";
import "./second-case.css";

type Tab="brief"|"people"|"lab"|"chain"|"board"|"interview"|"close";
type Ev={id:string;title:string;kind:string;summary:string;detail:string;code?:string};
type Rule={id:string;pair:string[];title:string;text:string;unlock?:string};
const people=[
 {id:"qiao",name:"乔雨",role:"中心实验室样本管理员",initial:"乔",note:"负责收件、扫码、入库。声称异常样本到达时封签完整。",color:"#365c65"},
 {id:"he",name:"何峻",role:"项目监查员 CRA",initial:"何",note:"案发前夜突然要求取回一盒备份样本，理由是核对运输偏差。",color:"#765e3f"},
 {id:"meng",name:"孟遥",role:"研究中心护士",initial:"孟",note:"完成受试者采血、离心和贴签，坚称样本离开操作台前没有混淆。",color:"#6d4d65"},
 {id:"luo",name:"罗启",role:"生物分析负责人",initial:"罗",note:"负责药物浓度检测，首次结果将直接影响团队的下一期合同。",color:"#75443d"},
];
const all:Ev[]=[
 {id:"assay",title:"异常检测报告",kind:"检测数据",code:"PK-2047",summary:"安慰剂受试者P-014检出高浓度CX-9。",detail:"样本标签：P-014 / V3 / 2H\n检测值：CX-9 286 ng/mL\n安慰剂组同期其余样本：低于定量下限\n复测剩余样本：279 ng/mL\n结论：非偶发仪器读数。"},
 {id:"manifest",title:"医院交接清单",kind:"流转文件",code:"BAG 41",summary:"P-014的2H样本装在运输袋41，封签尾号771。",detail:"11:22 完成离心\n11:31 孟遥复核标签并装入运输袋41\n袋内：P-012、P-013、P-014、P-015各时点共16管\n封签编号：SC-882771\n11:36 快递员签收。"},
 {id:"courier",title:"冷链运输记录",kind:"温度记录",code:"TRIP 663",summary:"全程2–8℃，重量和封签在途中均无异常。",detail:"11:36 医院取件：1.84 kg / 封签771\n13:02 中转扫描：1.84 kg / 外观正常\n14:18 实验室签收：1.84 kg / 封签771\n温度范围：3.7–5.2℃，无超温报警。"},
 {id:"receipt",title:"实验室收件照片",kind:"现场照片",code:"14:18:32",summary:"照片中的封签尾号看起来并不是771。",detail:"收件台自动相机拍摄：运输袋41外观完好。\n放大后封签号码可辨为 SC-882717。\n收件登记却手工录入“SC-882771，与清单一致”。\n两个号码使用相同型号封签。"},
 {id:"labels",title:"备用标签领用表",kind:"耗材记录",code:"LOT L24",summary:"何峻曾领用P-014整套备用标签，尚未归还。",detail:"案发前3日 16:40\n领用人：何峻（CRA）\n内容：P-014所有访视时点备用条码标签一套\n用途：处理打印模糊偏差\n研究中心没有对应偏差报告。"},
 {id:"tube",title:"试管批号对照",kind:"物证鉴定",code:"L23 / L24",summary:"异常管属于实验室批次，而非研究中心批次。",detail:"研究中心当月采血管：批次 L23，灰色磨砂盖，标签距管底18mm。\n异常P-014管：批次 L24，亮面盖，标签距管底11mm。\nL24仅由中心实验室质控室使用。"},
 {id:"freezer",title:"冷冻箱温度曲线",kind:"设备日志",code:"FZ-02",summary:"凌晨升温7分钟，但不足以使样本解冻。",detail:"02:13 门开启\n02:15 温度 -78℃升至-63℃\n02:20 门关闭\n02:27 恢复 -75℃\n验证报告：该箱满载情况下需门开23分钟，样本芯温才超过-60℃。"},
 {id:"access",title:"夜间门禁与摄像头",kind:"现场记录",code:"02:07–02:24",summary:"乔雨进入冷冻库，但始终没有接近样本接收区。",detail:"02:07 乔雨刷卡进入冷冻库\n02:12 摄像头：在FZ-02前清点架位\n02:24 离开\n收件区与质控室摄像头：该时段无人进入。"},
 {id:"layout",title:"实验室平面与传递窗",kind:"空间证据",code:"ZONE B",summary:"质控室可通过传递窗把样本放上收件台。",detail:"质控室与收件区相邻，中间有单向传递窗。\n传递窗从质控室一侧开启不需要门禁记录。\n收件台相机仅在袋子放上电子秤后拍照。\nL24采血管与空白封签存放于质控室。"},
 {id:"qc",title:"质控样本配制记录",kind:"实验记录",code:"QC-H 300",summary:"罗启当天配制了浓度接近异常值的高质控样本。",detail:"09:10 罗启配制CX-9高浓度质控样本：300 ng/mL\n容器：L24批次采血管\n计划用量12管，实际登记11管\n差异：少1管，未填写报废记录。"},
 {id:"email",title:"合同续签邮件",kind:"通信记录",code:"D-5",summary:"罗启的实验室需要出现“可分析的阳性样本”。",detail:"申办方邮件：如本周队列仍全部低于定量下限，将考虑把后续生物分析转给其他供应商。\n罗启转发批注：至少需要证明方法能在真实样本里检出，否则团队会被裁。"},
 {id:"scan",title:"扫码枪离线缓存",kind:"数字取证",code:"14:11",summary:"运输袋正式签收前，P-014标签已在质控室扫码。",detail:"14:11:08 设备 QC-SCAN-2 扫描 P-014/V3/2H\n14:11:11 扫描备用封签 SC-882717\n14:18:44 收件台登记运输袋41\nQC-SCAN-2固定安装在质控室，不可移动。"},
];
const rules:Rule[]=[
 {id:"seal",pair:["manifest","receipt"],title:"被替换的封签",text:"医院封签是771，实验室照片却是717。途中重量不变，替换更可能发生在正式签收前。",unlock:"layout"},
 {id:"fake",pair:["tube","labels"],title:"不是原始采血管",text:"异常管来自实验室L24批次，又贴有何峻领走的P-014备用标签；它并非医院采集的原管。",unlock:"scan"},
 {id:"window",pair:["layout","scan"],title:"签收前的七码",text:"P-014标签和717封签在14:11已于质控室扫码，随后可经传递窗放到收件台，避开门禁。"},
 {id:"source",pair:["qc","assay"],title:"浓度指纹",text:"异常值286 ng/mL接近当天300 ng/mL高质控样本，且质控记录刚好少了一管。"},
 {id:"motive",pair:["qc","email"],title:"制造阳性的动机",text:"罗启面临合同与裁员压力，并直接掌握少掉的一管高浓度质控样本。"},
 {id:"red",pair:["freezer","access"],title:"七码烟幕",text:"乔雨确实开启冷冻箱，但7分钟不足以解冻样本；她的活动区域也无法完成签收前调包。"},
 {id:"route",pair:["courier","receipt"],title:"运输途中没有调包",text:"途中重量、温度和外观一致；异常号码首次出现在实验室收件照片中。"},
];
const statements=[
 {who:"乔雨",quote:"冷冻箱那次升温肯定让样本出了问题。当晚只有我进过冷冻库。",answer:"freezer",why:"哪份证据能证明“升温”不足以破坏样本？"},
 {who:"何峻",quote:"我领的备用标签当天就交给实验室了，而且没有任何人使用过。",answer:"scan",why:"哪份证据证明标签在正式签收前已经被使用？"},
 {who:"罗启",quote:"异常管和其他医院样本完全一样，质控材料不可能混进去。",answer:"tube",why:"哪份物证直接否定“完全一样”？"},
];
export default function SecondCase({onFinish}:{onFinish:(s:number)=>void}){
 const [tab,setTab]=useState<Tab>("brief"),[found,setFound]=useState<string[]>(["assay","manifest","courier","receipt","labels","tube","freezer","access","qc","email"]),[pick,setPick]=useState<string[]>([]),[solved,setSolved]=useState<string[]>([]),[say,setSay]=useState(0),[broken,setBroken]=useState<string[]>([]),[toast,setToast]=useState(""),[ans,setAns]=useState({who:"",where:"",how:"",cold:""}),[score,setScore]=useState<number|null>(null);
 const visible=all.filter(e=>found.includes(e.id));const progress=Math.min(100,Math.round((solved.length+broken.length+(found.length-10))/12*100));
 const note=(x:string)=>{setToast(x);setTimeout(()=>setToast(""),2400)};
 function connect(){const r=rules.find(r=>r.pair.every(x=>pick.includes(x)));if(!r){note("物证之间尚未形成可靠的因果链");return}if(solved.includes(r.id)){note("这条推论已经归档");return}setSolved([...solved,r.id]);if(r.unlock&&!found.includes(r.unlock))setFound([...found,r.unlock]);setPick([]);note("推论成立："+r.title)}
 function choose(id:string){setPick(v=>v.includes(id)?v.filter(x=>x!==id):v.length<2?[...v,id]:[v[1],id])}
 function challenge(id:string){const s=statements[say];if(id!==s.answer){note("它不能直接反驳这句话");return}setBroken([...broken,s.who]);note("证词击破");if(say<2)setTimeout(()=>setSay(say+1),600)}
 function finish(){const n=[ans.who==="luo",ans.where==="qc",ans.how==="swap",ans.cold==="decoy"].filter(Boolean).length;const val=n*15+Math.min(35,solved.length*5)+Math.min(5,broken.length*2);setScore(val);onFinish(val)}
 const nav:[Tab,string][]=[["brief","案情"],["people","关系人"],["lab","物证台"],["chain","流转链"],["board","推理板"],["interview","询问室"],["close","结案"]];
 return <main className="ice-app"><header className="ice-top"><div><small>BIOLOGICAL EVIDENCE UNIT</small><h1>药研悬案局 <i>/ 第二案</i></h1></div><aside><span>CRYO-07</span><b>{progress}%</b><em><i style={{width:Math.max(3,progress)+"%"}}/></em></aside></header><nav className="ice-nav">{nav.map(([x,l],i)=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}><small>0{i+1}</small>{l}</button>)}</nav>
 {tab==="brief"&&<section className="ice-scene ice-brief"><p className="ice-kicker">CASE CRYO-07 · 样本完整性事件</p><h2>零下七码</h2><p className="ice-lead">安慰剂受试者的血样里，检出了不可能存在的试验药物。凌晨，一台保存关键样本的冷冻箱又恰好升温了七分钟。</p><div className="alert"><b>异常报告</b><span>受试者 P-014 · 安慰剂组</span><strong>286 <small>ng/mL CX-9</small></strong><p>理论值：低于定量下限</p></div><div className="ice-columns"><article><h3>调查委托</h3><p>申办方要求在数据库解盲前确认：这是受试者违规服药、实验室污染，还是样本被人为替换？</p></article><article><h3>结案条件</h3><ul><li>确定异常样本的真实来源</li><li>找出调包发生的地点与方法</li><li>识别“升温七码”的真实意义</li><li>锁定操作者与动机</li></ul></article></div><button className="ice-action" onClick={()=>setTab("lab")}>进入物证实验室 →</button></section>}
 {tab==="people"&&<section className="ice-scene"><Head k="PERSONS & MOTIVES" t="关系人档案" p="流程上的每一双手，都可能改变一支样本。"/><div className="ice-people">{people.map(p=><article key={p.id}><div style={{background:p.color}}>{p.initial}</div><span>{p.role}</span><h3>{p.name}</h3><p>{p.note}</p></article>)}</div></section>}
 {tab==="lab"&&<section className="ice-scene"><Head k={`EVIDENCE BENCH · ${visible.length}/12`} t="物证台" p="选中两份物证，尝试建立可验证的联系。"/><div className="bench"><div className="samples">{visible.map((e,i)=><button className={pick.includes(e.id)?"picked":""} onClick={()=>choose(e.id)} key={e.id}><span>S-{String(i+1).padStart(2,"0")} · {e.kind}</span>{e.code&&<i>{e.code}</i>}<h3>{e.title}</h3><p>{e.summary}</p></button>)}</div><aside>{pick.length?pick.map(id=>{const e=all.find(x=>x.id===id)!;return <article key={id}><span>{e.kind}</span><h3>{e.title}</h3><pre>{e.detail}</pre></article>}):<div className="no-sample">＋<p>选择物证查看鉴定详情</p></div>}<button disabled={pick.length!==2} onClick={connect}>连接两份物证</button></aside></div></section>}
 {tab==="chain"&&<section className="ice-scene"><Head k="CHAIN OF CUSTODY" t="样本流转链" p="寻找原始样本离开可信流转链的那一刻。"/><div className="custody">{[["11:31","医院装袋","封签 771","manifest"],["11:36","快递取件","1.84 kg","courier"],["13:02","中转扫描","温度与重量正常","courier"],["14:11","质控室异常扫码","P-014 / 封签717","scan"],["14:18","实验室正式签收","照片为封签717","receipt"],["次日","浓度检测","286 ng/mL","assay"]].map((x,i)=><article className={!found.includes(x[3])?"hidden-step":""} key={x[0]}><time>{x[0]}</time><b>{found.includes(x[3])?x[1]:"待查节点"}</b><span>{found.includes(x[3])?x[2]:"尚无记录"}</span>{i<5&&<i>→</i>}</article>)}</div><div className="custody-note">运输袋从医院出发时是 <b>771</b>，到实验室相机下却成了 <b>717</b>。谁有机会在正式签收之前制造一个“看似完整”的袋子？</div></section>}
 {tab==="board"&&<section className="ice-scene"><Head k="FORENSIC DEDUCTIONS" t="物证推理板" p={`${solved.length}/7 条推论成立`}/>{solved.length?<div className="ice-rules">{solved.map((id,i)=>{const r=rules.find(x=>x.id===id)!;return <article key={id}><b>{String(i+1).padStart(2,"0")}</b><div><span>VERIFIED CONNECTION</span><h3>{r.title}</h3><p>{r.text}</p></div></article>})}</div>:<div className="ice-empty"><strong>⌁</strong><h3>尚未建立物证联系</h3><p>在物证台选中两份材料并连接。</p><button className="ice-action" onClick={()=>setTab("lab")}>前往物证台</button></div>}</section>}
 {tab==="interview"&&<section className="ice-scene"><Head k="STATEMENT EXAMINATION" t="证词核验" p={`${broken.length}/3 份证词已纠正`}/>{broken.includes(statements[say].who)&&say===2?<div className="ice-empty"><strong>✓</strong><h3>询问完成</h3><p>口供只能提供方向，最终结论必须由物证支持。</p></div>:<div className="ice-talk"><aside><div style={{background:people.find(p=>p.name===statements[say].who)?.color}}>{people.find(p=>p.name===statements[say].who)?.initial}</div><h3>{statements[say].who}</h3></aside><article><small>STATEMENT {say+1}/3</small><blockquote>“{statements[say].quote}”</blockquote><h4>{statements[say].why}</h4><div>{visible.map(e=><button onClick={()=>challenge(e.id)} key={e.id}><span>{e.kind}</span>{e.title}</button>)}</div></article></div>}</section>}
 {tab==="close"&&<section className="ice-scene"><Head k="INCIDENT CONCLUSION" t="样本完整性结案报告" p="不要被最醒目的异常带偏。"/>{score===null?<div className="ice-form"><Q n="01" t="谁制造了异常样本？" v={ans.who} set={x=>setAns({...ans,who:x})} opts={[["qiao","乔雨"],["he","何峻"],["meng","孟遥"],["luo","罗启"]]}/><Q n="02" t="替换最可能发生在哪里？" v={ans.where} set={x=>setAns({...ans,where:x})} opts={[["hospital","研究中心采血台"],["courier","冷链运输途中"],["qc","实验室质控室与收件台之间"],["freezer","冷冻库内"]]}/><Q n="03" t="异常样本是怎样产生的？" v={ans.how} set={x=>setAns({...ans,how:x})} opts={[["dose","受试者私下服药"],["swap","用高浓度质控管贴备用标签，重做封签后替换"],["carryover","仪器残留导致偶发污染"]]}/><Q n="04" t="冷冻箱升温七码意味着什么？" v={ans.cold} set={x=>setAns({...ans,cold:x})} opts={[["cause","造成药物浓度异常的直接原因"],["decoy","真实事件，但不足以损伤样本，是误导调查的烟幕"],["delete","设备故障删除了温度数据"]]}/><button className="ice-action submit" disabled={Object.values(ans).some(x=>!x)} onClick={finish}>提交结案报告</button></div>:<div className="ice-report"><div><small>FORENSIC SCORE</small><strong>{score}</strong><span>/100</span></div><h3>{score===100?"完整结案":"证据链尚有缺口"}</h3><p>{score===100?"你避开了低温异常这个诱饵，并准确还原了样本在可信流转链之外被替换的方式。":"最终指控或推理板仍有未被证实的环节。你可以重新检查封签、管材批次与扫码时间。"}</p>{score===100&&<article><h4>封存结论</h4><p>完整真相已写入结案卷宗。为避免旁观者被剧透，本页只在满分后显示：罗启利用质控室的一管高浓度质控样本和何峻遗留的备用标签，制作假P-014样本，再以尾号717的封签重组运输袋，经传递窗送上收件台。冷冻箱升温确有其事，但既无法造成这种浓度，也与调包空间无关。</p></article>}<button onClick={()=>{setScore(null);setAns({who:"",where:"",how:"",cold:""})}}>重新提交</button></div>}</section>}
 <div className={toast?"ice-toast show":"ice-toast"}>{toast}</div></main>
}
function Head({k,t,p}:{k:string;t:string;p:string}){return <header className="ice-head"><div><small>{k}</small><h2>{t}</h2></div><p>{p}</p></header>}
function Q({n,t,v,set,opts}:{n:string;t:string;v:string;set:(x:string)=>void;opts:string[][]}){return <fieldset><legend><span>{n}</span>{t}</legend>{opts.map(x=><label className={v===x[0]?"on":""} key={x[0]}><input type="radio" checked={v===x[0]} onChange={()=>set(x[0])}/><i/>{x[1]}</label>)}</fieldset>}
