"use client";

import { useEffect, useState } from "react";
import MysteryGame from "./MysteryGame";
import SecondCase from "./SecondCase";
import ThirdCase from "./ThirdCase";
import "./case-hub.css";

type CaseId = "hub" | "zx017" | "cryo07" | "blind031";

const cases = [
  { id:"zx017" as const, no:"CASE 01", title:"消失的第七码", tag:"数据篡改 · 权限与时间线", desc:"结果发布前夜，首席医学官失踪，数据库中的007号受试者也被排除。", duration:"15–20 分钟", level:"入门", color:"#8d3b32" },
  { id:"cryo07" as const, no:"CASE 02", title:"零下七码", tag:"样本调包 · 物证与流转链", desc:"安慰剂组血样检出试验药物，关键冷冻箱又在凌晨异常升温七码。", duration:"20–25 分钟", level:"进阶", color:"#315b68" },
  { id:"blind031" as const, no:"CASE 03", title:"盲区来客", tag:"身份替访 · 盲态与访视动线", desc:"同一名受试者两周内长高七码。照片、药盒与门诊动线指向一场系统性替访。", duration:"25–30 分钟", level:"困难", color:"#50566f" },
];

export default function CaseHub(){
  const [active,setActive]=useState<CaseId>("hub");
  const [scores,setScores]=useState<Record<string,number>>({});
  useEffect(()=>{try{setScores(JSON.parse(localStorage.getItem("mystery-scores")||"{}"))}catch{}},[]);
  function finish(id:string,score:number){const next={...scores,[id]:Math.max(scores[id]||0,score)};setScores(next);localStorage.setItem("mystery-scores",JSON.stringify(next))}
  if(active==="zx017")return <div><button className="hub-back" onClick={()=>setActive("hub")}>← 案件大厅</button><MysteryGame/></div>;
  if(active==="cryo07")return <div><button className="hub-back ice" onClick={()=>setActive("hub")}>← 案件大厅</button><SecondCase onFinish={s=>finish("cryo07",s)}/></div>;
  if(active==="blind031")return <div><button className="hub-back" onClick={()=>setActive("hub")}>← 案件大厅</button><ThirdCase onFinish={s=>finish("blind031",s)}/></div>;
  return <main className="case-hub"><header><div className="hub-brand"><span>研</span><div><small>PHARMA CRIME ARCHIVE</small><h1>药研悬案局</h1></div></div><p>公开证据不会说谎。<br/>会说谎的是解释证据的人。</p></header><section className="hub-intro"><p>INVESTIGATION ARCHIVE · 调查档案</p><h2>选择一宗悬案</h2><span>阅读证物，连接线索，击破证词。只有完整证据链才能结案。</span></section><section className="case-shelf">{cases.map((c,i)=><button key={c.id} onClick={()=>setActive(c.id)} className="case-folder" style={{"--case":c.color} as React.CSSProperties}><div className="folder-index"><b>{c.no}</b><span>{String(i+1).padStart(2,"0")}</span></div><div className="folder-body"><div className="folder-top"><span>{c.tag}</span>{scores[c.id]?<mark>最高 {scores[c.id]} 分</mark>:<mark className="new">未结案</mark>}</div><h3>{c.title}</h3><p>{c.desc}</p><footer><span>预计 {c.duration}</span><span>难度 · {c.level}</span><b>调取案卷 →</b></footer></div></button>)}</section><footer className="hub-footer">所有案件均为虚构 · 不构成医学、投资或合规建议</footer></main>
}
