"use client";

import { useEffect, useState } from "react";
import MysteryGame from "./MysteryGame";
import SecondCase from "./SecondCase";
import ThirdCase from "./ThirdCase";
import FourthCase from "./FourthCase";
import FifthCase from "./FifthCase";
import SixthCase from "./SixthCase";
import SeventhCase from "./SeventhCase";
import "./case-hub.css";

type CaseId = "hub" | "zx017" | "cryo07" | "blind031" | "ae047" | "pulse07" | "icf026" | "bv07";

const cases = [
  { id:"zx017" as const, no:"CASE 01", title:"消失的第七码", tag:"数据篡改 · 权限与时间线", desc:"结果发布前夜，首席医学官失踪，数据库中的007号受试者也被排除。", duration:"15–20 分钟", level:"入门", color:"#8d3b32" },
  { id:"cryo07" as const, no:"CASE 02", title:"零下七码", tag:"样本调包 · 物证与流转链", desc:"安慰剂组血样检出试验药物，关键冷冻箱又在凌晨异常升温七码。", duration:"20–25 分钟", level:"进阶", color:"#315b68" },
  { id:"blind031" as const, no:"CASE 03", title:"盲区来客", tag:"身份替访 · 盲态与访视动线", desc:"同一名受试者两周内长高七码。照片、药盒与门诊动线指向一场系统性替访。", duration:"25–30 分钟", level:"困难", color:"#50566f" },
  { id:"ae047" as const, no:"CASE 04", title:"沉默的七小时", tag:"不良事件瞒报 · 报告时限与因果判定", desc:"危急值电话上午八点就接通了，系统里的知晓时间却是下午三点。空白的七小时里，受试者又服下了一次药。", duration:"25–30 分钟", level:"困难", color:"#7a5a2c" },
  { id:"pulse07" as const, no:"CASE 05", title:"同一颗心跳", tag:"幽灵受试者 · 心电图与身份核验", desc:"七名受试者的基线心电图叠在一起严丝合缝，连那一簇伪影都在同一个位置。七个编号，只有一颗心跳。", duration:"25–30 分钟", level:"困难", color:"#2f6a55" },
  { id:"icf026" as const, no:"CASE 06", title:"晚到七天的签名", tag:"知情同意造假 · 签名、日期与版本", desc:"一辈子只会按手印的老人，同意书上却是一手行书。签名的日期，比他抽第一管研究血样晚了七天。", duration:"25–30 分钟", level:"困难", color:"#6b3f62" },
  { id:"bv07" as const, no:"CASE 07", title:"零点零七", tag:"主要终点偷换 · 统计计划与注册史", desc:"揭盲那晚 p=0.07，试验失败；三个月后的论文里 p=0.03，试验成功。数据一个没改，换掉的是终点。", duration:"30–35 分钟", level:"专家", color:"#2d4a7c" },
];

export default function CaseHub(){
  const [active,setActive]=useState<CaseId>("hub");
  const [scores,setScores]=useState<Record<string,number>>({});
  // localStorage is client-only; syncing it in an effect avoids an SSR hydration mismatch
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{try{setScores(JSON.parse(localStorage.getItem("mystery-scores")||"{}"))}catch{}},[]);
  function finish(id:string,score:number){const next={...scores,[id]:Math.max(scores[id]||0,score)};setScores(next);localStorage.setItem("mystery-scores",JSON.stringify(next))}
  if(active==="zx017")return <div><button className="hub-back" onClick={()=>setActive("hub")}>← 案件大厅</button><MysteryGame onFinish={s=>finish("zx017",s)}/></div>;
  if(active==="cryo07")return <div><button className="hub-back ice" onClick={()=>setActive("hub")}>← 案件大厅</button><SecondCase onFinish={s=>finish("cryo07",s)}/></div>;
  if(active==="blind031")return <div><button className="hub-back" onClick={()=>setActive("hub")}>← 案件大厅</button><ThirdCase onFinish={s=>finish("blind031",s)}/></div>;
  if(active==="ae047")return <div><button className="hub-back" onClick={()=>setActive("hub")}>← 案件大厅</button><FourthCase onFinish={s=>finish("ae047",s)}/></div>;
  if(active==="pulse07")return <div><button className="hub-back" onClick={()=>setActive("hub")}>← 案件大厅</button><FifthCase onFinish={s=>finish("pulse07",s)}/></div>;
  if(active==="icf026")return <div><button className="hub-back" onClick={()=>setActive("hub")}>← 案件大厅</button><SixthCase onFinish={s=>finish("icf026",s)}/></div>;
  if(active==="bv07")return <div><button className="hub-back" onClick={()=>setActive("hub")}>← 案件大厅</button><SeventhCase onFinish={s=>finish("bv07",s)}/></div>;
  return <main className="case-hub"><header><div className="hub-brand"><span>研</span><div><small>PHARMA CRIME ARCHIVE</small><h1>药研悬案局</h1></div></div><p>公开证据不会说谎。<br/>会说谎的是解释证据的人。</p></header><section className="hub-intro"><p>INVESTIGATION ARCHIVE · 调查档案</p><h2>选择一宗悬案</h2><span>阅读证物，连接线索，击破证词。只有完整证据链才能结案。</span></section><section className="case-shelf">{cases.map((c,i)=><button key={c.id} onClick={()=>setActive(c.id)} className="case-folder" style={{"--case":c.color} as React.CSSProperties}><div className="folder-index"><b>{c.no}</b><span>{String(i+1).padStart(2,"0")}</span></div><div className="folder-body"><div className="folder-top"><span>{c.tag}</span>{scores[c.id]?<mark>最高 {scores[c.id]} 分</mark>:<mark className="new">未结案</mark>}</div><h3>{c.title}</h3><p>{c.desc}</p><footer><span>预计 {c.duration}</span><span>难度 · {c.level}</span><b>调取案卷 →</b></footer></div></button>)}</section><footer className="hub-footer">所有案件均为虚构 · 不构成医学、投资或合规建议</footer></main>
}
