"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CaseFile,
  EvidencePayload,
  EvidenceSnapshot,
  JudgmentDirection,
  LabelRecord,
  TrialRecord,
} from "./types";

const STORAGE_KEY = "drug-mystery-cases-v1";

const STATUS_LABELS: Record<string, string> = {
  RECRUITING: "招募中",
  NOT_YET_RECRUITING: "尚未招募",
  ACTIVE_NOT_RECRUITING: "进行中，停止招募",
  COMPLETED: "已完成",
  TERMINATED: "已终止",
  WITHDRAWN: "已撤回",
  SUSPENDED: "已暂停",
  ENROLLING_BY_INVITATION: "邀请入组",
  UNKNOWN: "状态未知",
};

const DIRECTION_META: Record<JudgmentDirection, { label: string; symbol: string }> = {
  up: { label: "信心上调", symbol: "↑" },
  down: { label: "信心下调", symbol: "↓" },
  same: { label: "判断不变", symbol: "→" },
};

function uid() {
  return crypto.randomUUID();
}

function plusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createSeedCase(): CaseFile {
  return {
    id: uid(),
    title: "GLP-1 的第二人生",
    condition: "Obesity",
    intervention: "semaglutide",
    question: "公开登记里，司美格鲁肽在肥胖相关研究中的下一次可核变化会是什么？",
    prediction: "未来 30 天内，至少一项相关研究会更新招募状态、预计完成时间或结果登记。",
    confidence: 55,
    reviewDate: plusDays(30),
    changeConditions: "研究状态改变；研究最后更新时间改变；出现新的公开标签版本。",
    status: "active",
    createdAt: new Date().toISOString(),
    snapshots: [],
    judgments: [],
  };
}

function shortDate(value: string | null | undefined) {
  if (!value) return "—";
  if (/^\d{4}$/.test(value)) return value;
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");
    return `${year}年${Number(month)}月`;
  }
  const normalized = /^\d{8}$/.test(value)
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return normalized;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function dateTime(value: string | undefined) {
  if (!value) return "尚未取证";
  const date = new Date(value);
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function phaseLabel(phases: string[]) {
  if (!phases.length) return "未标阶段";
  return phases.map((phase) => phase.replaceAll("_", " ")).join(" · ");
}

function compareSnapshots(previous?: EvidenceSnapshot, current?: EvidenceSnapshot) {
  if (!current) {
    return { baseline: false, count: 0, items: [] as string[] };
  }
  if (!previous) {
    return {
      baseline: true,
      count: current.trials.length + current.labels.length,
      items: ["已建立首份证据基线"],
    };
  }

  const items: string[] = [];
  const oldTrials = new Map(previous.trials.map((trial) => [trial.id, trial]));
  const newTrials = new Map(current.trials.map((trial) => [trial.id, trial]));
  const oldLabels = new Map(previous.labels.map((label) => [label.setId, label]));

  current.trials.forEach((trial) => {
    const old = oldTrials.get(trial.id);
    if (!old) {
      items.push(`新增研究 ${trial.id}`);
    } else if (old.status !== trial.status) {
      items.push(`${trial.id}：${STATUS_LABELS[old.status] ?? old.status} → ${STATUS_LABELS[trial.status] ?? trial.status}`);
    } else if (old.lastUpdated !== trial.lastUpdated) {
      items.push(`${trial.id} 更新了公开登记`);
    }
  });
  previous.trials.forEach((trial) => {
    if (!newTrials.has(trial.id)) items.push(`${trial.id} 不再出现在本轮前 12 条结果中`);
  });
  current.labels.forEach((label) => {
    const old = oldLabels.get(label.setId);
    if (!old) {
      items.push(`出现新的标签记录：${label.brandNames[0] || label.genericNames[0] || label.id}`);
    } else if (old.id !== label.id || old.version !== label.version) {
      items.push(`${label.brandNames[0] || label.genericNames[0] || label.setId} 标签版本更新`);
    }
  });

  return { baseline: false, count: items.length, items };
}

function confidenceTone(value: number) {
  if (value >= 70) return "high";
  if (value <= 35) return "low";
  return "medium";
}

function TrialCard({ trial }: { trial: TrialRecord }) {
  return (
    <article className="evidence-card">
      <div className="evidence-card-topline">
        <span className={`status-dot status-${trial.status.toLowerCase()}`} />
        <span>{STATUS_LABELS[trial.status] ?? trial.status}</span>
        <span className="source-id">{trial.id}</span>
      </div>
      <h4>{trial.title}</h4>
      <p className="evidence-meta">
        {phaseLabel(trial.phases)} · {trial.sponsor}
      </p>
      <dl className="mini-facts">
        <div><dt>最后更新</dt><dd>{shortDate(trial.lastUpdated)}</dd></div>
        <div><dt>预计完成</dt><dd>{shortDate(trial.completionDate)}</dd></div>
        <div><dt>入组</dt><dd>{trial.enrollment ?? "—"}</dd></div>
        <div><dt>地点</dt><dd>{trial.locationCount || "—"}</dd></div>
      </dl>
      <a href={trial.sourceUrl} target="_blank" rel="noreferrer">查看原始登记 ↗</a>
    </article>
  );
}

function LabelCard({ label }: { label: LabelRecord }) {
  return (
    <article className="evidence-card label-card">
      <div className="evidence-card-topline">
        <span className="document-mark">FDA</span>
        <span>{shortDate(label.effectiveTime)}</span>
        {label.version ? <span className="source-id">版本 {label.version}</span> : null}
      </div>
      <h4>{label.brandNames.join(" / ") || label.genericNames.join(" / ") || "未命名标签"}</h4>
      <p className="evidence-meta">{label.genericNames.join(" · ") || "通用名未匹配"}</p>
      {label.manufacturerNames.length || label.applicationNumbers.length ? (
        <p className="evidence-meta">
          {[label.manufacturerNames[0], label.applicationNumbers[0]].filter(Boolean).join(" · ")}
        </p>
      ) : null}
      {label.indications ? <p className="label-excerpt">{label.indications}</p> : <p className="empty-copy">本条未返回适应证摘录。</p>}
      {label.boxedWarning ? <p className="boxed-warning"><strong>黑框警示摘录：</strong>{label.boxedWarning}</p> : null}
      <a href={label.sourceUrl} target="_blank" rel="noreferrer">查看原始 JSON ↗</a>
    </article>
  );
}

export default function InvestigationDesk() {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [showNewCase, setShowNewCase] = useState(false);
  const [showJudgment, setShowJudgment] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? (JSON.parse(saved) as CaseFile[]) : [];
        const initial = parsed.length ? parsed : [createSeedCase()];
        setCases(initial);
        setSelectedId(initial[0].id);
      } catch {
        const initial = [createSeedCase()];
        setCases(initial);
        setSelectedId(initial[0].id);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  }, [cases, hydrated]);

  const selected = cases.find((item) => item.id === selectedId) ?? cases[0];
  const latest = selected?.snapshots.at(-1);
  const previous = selected?.snapshots.at(-2);
  const diff = useMemo(() => compareSnapshots(previous, latest), [previous, latest]);

  async function refreshEvidence() {
    if (!selected || loading) return;
    setLoading(true);
    setNotice("正在核对两个公开证据源…");
    try {
      const response = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: selected.condition,
          intervention: selected.intervention,
        }),
      });
      const payload = (await response.json()) as EvidencePayload & { error?: string };
      if (!response.ok) throw new Error(payload.error || "取证失败");

      const snapshot: EvidenceSnapshot = { ...payload, id: uid() };
      setCases((current) => current.map((item) =>
        item.id === selected.id
          ? { ...item, snapshots: [...item.snapshots, snapshot] }
          : item,
      ));
      const sourceFailures = Object.values(payload.sources).filter((source) => !source.ok).length;
      setNotice(sourceFailures ? `已保存快照，但有 ${sourceFailures} 个来源暂时不可用。` : "证据快照已保存，可以和上一次比较了。");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "取证失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }

  function addCase(formData: FormData) {
    const confidence = Number(formData.get("confidence"));
    const newCase: CaseFile = {
      id: uid(),
      title: String(formData.get("title") || "未命名悬案").trim(),
      condition: String(formData.get("condition") || "").trim(),
      intervention: String(formData.get("intervention") || "").trim(),
      question: String(formData.get("question") || "").trim(),
      prediction: String(formData.get("prediction") || "").trim(),
      confidence: Number.isFinite(confidence) ? confidence : 50,
      reviewDate: String(formData.get("reviewDate") || plusDays(30)),
      changeConditions: String(formData.get("changeConditions") || "").trim(),
      status: "active",
      createdAt: new Date().toISOString(),
      snapshots: [],
      judgments: [],
    };
    setCases((current) => [newCase, ...current]);
    setSelectedId(newCase.id);
    setShowNewCase(false);
    setNotice("新悬案已建立。第一次取证会成为基线。");
  }

  function addJudgment(formData: FormData) {
    if (!selected) return;
    const direction = String(formData.get("direction")) as JudgmentDirection;
    const confidence = Number(formData.get("confidence"));
    const note = String(formData.get("note") || "").trim();
    const judgment = {
      id: uid(),
      createdAt: new Date().toISOString(),
      direction,
      confidence,
      note,
    };
    setCases((current) => current.map((item) =>
      item.id === selected.id
        ? { ...item, confidence, judgments: [...item.judgments, judgment] }
        : item,
    ));
    setShowJudgment(false);
    setNotice("改判理由已写进案卷。");
  }

  if (!hydrated || !selected) {
    return <main className="boot-state" role="status">正在打开案卷桌…</main>;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">PERSONAL EVIDENCE DESK · 公开证据案卷</p>
          <h1>药研悬案局</h1>
        </div>
        <div className="topbar-actions">
          <span className="local-badge"><i /> 本机保存</span>
          <button className="secondary-button" onClick={() => setShowNewCase(true)}>＋ 新建悬案</button>
        </div>
      </header>

      <p className="safety-strip">
        本工具只用于公开证据导航与个人判断复盘，不提供诊断、用药建议、疗效或风险结论。
      </p>

      <div className="desk-grid">
        <aside className="case-rail" aria-label="悬案列表">
          <div className="section-heading">
            <span>进行中的悬案</span>
            <small>{cases.filter((item) => item.status === "active").length}</small>
          </div>
          <div className="case-list">
            {cases.map((item, index) => {
              const itemLatest = item.snapshots.at(-1);
              return (
                <button
                  key={item.id}
                  className={`case-tab ${item.id === selected.id ? "active" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="case-number">CASE {String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                  <span>{item.condition} · {item.intervention || "未指定药物"}</span>
                  <small>{itemLatest ? `上次取证 ${dateTime(itemLatest.fetchedAt)}` : "等待首次取证"}</small>
                </button>
              );
            })}
          </div>
          <div className="rail-note">
            <strong>案卷原则</strong>
            <p>只记录可追溯变化。没有变化，就不制造结论。</p>
          </div>
        </aside>

        <section className="case-workspace">
          <div className="case-header">
            <div>
              <p className="eyebrow">ACTIVE CASE · {selected.condition}</p>
              <h2>{selected.title}</h2>
              <p className="case-question">{selected.question}</p>
            </div>
            <button className="primary-button" onClick={refreshEvidence} disabled={loading}>
              {loading ? "正在核对…" : latest ? "重新取证" : "建立证据基线"}
            </button>
          </div>

          <div className="case-metrics">
            <div className="metric confidence-metric">
              <span>当前置信度</span>
              <strong className={`confidence-${confidenceTone(selected.confidence)}`}>{selected.confidence}%</strong>
              <div className="confidence-track" aria-label={`当前置信度 ${selected.confidence}%`}>
                <i style={{ width: `${selected.confidence}%` }} />
              </div>
            </div>
            <div className="metric"><span>复核日</span><strong>{shortDate(selected.reviewDate)}</strong></div>
            <div className="metric"><span>证据快照</span><strong>{selected.snapshots.length}</strong></div>
            <div className="metric"><span>改判次数</span><strong>{selected.judgments.length}</strong></div>
          </div>

          <section className="prediction-sheet">
            <div>
              <span className="sheet-label">我的预测</span>
              <p>{selected.prediction}</p>
            </div>
            <div>
              <span className="sheet-label">什么会让我改判</span>
              <p>{selected.changeConditions || "尚未写下明确条件。"}</p>
            </div>
          </section>

          {latest ? (
            <section className={`diff-panel ${diff.count ? "has-changes" : "no-changes"}`} aria-live="polite">
              <div className="diff-icon">{diff.baseline ? "◎" : diff.count ? "Δ" : "="}</div>
              <div>
                <strong>{diff.baseline ? "首份基线已经建立" : diff.count ? `发现 ${diff.count} 项可核变化` : "与上一份快照相比，没有可核变化"}</strong>
                <p>{diff.baseline ? "下一次取证开始比较新增、状态与标签版本。" : diff.count ? diff.items.slice(0, 3).join("；") : "已照实保存本轮检查，不额外制造新闻。"}</p>
              </div>
            </section>
          ) : (
            <section className="empty-evidence">
              <span>01</span>
              <div><strong>先留下一份今天的证据</strong><p>第一次取证不会判断输赢，只建立以后可以比较的基线。</p></div>
            </section>
          )}

          <div className="evidence-heading">
            <div><p className="eyebrow">EVIDENCE LANES</p><h3>两条证据轨</h3></div>
            <span>{latest ? `取证于 ${dateTime(latest.fetchedAt)}` : "尚无快照"}</span>
          </div>

          <div className="evidence-lanes">
            <section className="evidence-lane">
              <header>
                <div><span className="lane-index">A</span><div><strong>ClinicalTrials.gov</strong><small>公开试验登记</small></div></div>
                <span className={`source-health ${latest?.sources.clinicalTrials.ok ? "ok" : ""}`}>{latest ? latest.sources.clinicalTrials.message : "等待取证"}</span>
              </header>
              {latest?.trials.length ? latest.trials.slice(0, 6).map((trial) => <TrialCard key={trial.id} trial={trial} />) : <p className="lane-empty">{latest ? "本轮没有匹配研究。" : "建立基线后显示研究状态、阶段与更新时间。"}</p>}
              {latest?.sources.clinicalTrials.url ? <a className="source-link" href={latest.sources.clinicalTrials.url} target="_blank" rel="noreferrer">打开本轮原始查询 ↗</a> : null}
            </section>

            <section className="evidence-lane">
              <header>
                <div><span className="lane-index">B</span><div><strong>openFDA</strong><small>公开药品标签</small></div></div>
                <span className={`source-health ${latest?.sources.openFda.ok ? "ok" : ""}`}>{latest ? latest.sources.openFda.message : "等待取证"}</span>
              </header>
              {latest?.labels.length ? latest.labels.slice(0, 4).map((label) => <LabelCard key={label.id} label={label} />) : <p className="lane-empty">{latest ? latest.sources.openFda.message : "有药物名时，核对公开标签版本与原文。"}</p>}
              {latest?.sources.openFda.url ? <a className="source-link" href={latest.sources.openFda.url} target="_blank" rel="noreferrer">打开本轮原始查询 ↗</a> : null}
            </section>
          </div>

          <details className="caution-box">
            <summary>阅读边界与本轮限制</summary>
            <ul>{(latest?.cautions ?? ["取证前请先建立基线。", "任何数据库缺失都不能直接解释为对象不存在。", "公开数据只能提供线索，不能替代专业判断。"]).map((item) => <li key={item}>{item}</li>)}</ul>
          </details>
        </section>

        <aside className="judgment-rail" aria-label="改判记录">
          <div className="judgment-header">
            <div><p className="eyebrow">JUDGMENT LOG</p><h3>改判记录</h3></div>
            <button className="icon-button" onClick={() => setShowJudgment(true)} aria-label="记录一次判断">＋</button>
          </div>
          <p className="judgment-intro">数据可以更新，判断必须留下当时的理由。</p>
          <div className="timeline">
            {selected.judgments.length ? [...selected.judgments].reverse().map((judgment) => {
              const meta = DIRECTION_META[judgment.direction];
              return (
                <article className={`judgment-item direction-${judgment.direction}`} key={judgment.id}>
                  <div className="judgment-symbol">{meta.symbol}</div>
                  <div><span>{meta.label} · {judgment.confidence}%</span><p>{judgment.note}</p><small>{dateTime(judgment.createdAt)}</small></div>
                </article>
              );
            }) : (
              <div className="timeline-empty"><span>暂无改判</span><p>取证后，记录“上调、下调或不变”以及理由。</p></div>
            )}
          </div>
          <button className="full-button" onClick={() => setShowJudgment(true)}>记录本轮判断</button>
          <div className="source-legend"><span><i className="legend-raw" />原始事实</span><span><i className="legend-judgment" />个人判断</span></div>
        </aside>
      </div>

      <div className="live-notice" aria-live="polite">{notice}</div>

      {showNewCase ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowNewCase(false)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="new-case-title">
            <button className="modal-close" onClick={() => setShowNewCase(false)} aria-label="关闭">×</button>
            <p className="eyebrow">OPEN A NEW CASE</p><h2 id="new-case-title">建立一宗新悬案</h2>
            <form action={addCase} className="case-form">
              <label>案卷标题<input name="title" required placeholder="例如：某靶点能否跨过临床断层" /></label>
              <div className="form-row"><label>疾病 / 适应证<input name="condition" required placeholder="Obesity" /></label><label>药物 / 干预<input name="intervention" placeholder="semaglutide" /></label></div>
              <label>核心问题<textarea name="question" required rows={2} placeholder="到底想等现实回答什么？" /></label>
              <label>我的预测<textarea name="prediction" required rows={3} placeholder="写成以后可以判断命中、失准或仍未知的一句话。" /></label>
              <div className="form-row"><label>初始置信度<input name="confidence" type="number" min="0" max="100" defaultValue="50" required /></label><label>复核日<input name="reviewDate" type="date" defaultValue={plusDays(30)} required /></label></div>
              <label>什么会让我改判<textarea name="changeConditions" rows={2} placeholder="状态变化、时间变化、新标签版本……" /></label>
              <button className="primary-button" type="submit">建立案卷</button>
            </form>
          </section>
        </div>
      ) : null}

      {showJudgment ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowJudgment(false)}>
          <section className="modal compact-modal" role="dialog" aria-modal="true" aria-labelledby="judgment-title">
            <button className="modal-close" onClick={() => setShowJudgment(false)} aria-label="关闭">×</button>
            <p className="eyebrow">WRITE THE REASON DOWN</p><h2 id="judgment-title">这次证据改变了什么？</h2>
            <form action={addJudgment} className="case-form">
              <fieldset className="direction-picker"><legend>判断方向</legend>{(["up", "down", "same"] as JudgmentDirection[]).map((direction) => <label key={direction}><input type="radio" name="direction" value={direction} defaultChecked={direction === "same"} /><span>{DIRECTION_META[direction].symbol} {DIRECTION_META[direction].label}</span></label>)}</fieldset>
              <label>新的置信度<input name="confidence" type="range" min="0" max="100" defaultValue={selected.confidence} onInput={(event) => { const output = event.currentTarget.nextElementSibling; if (output) output.textContent = `${event.currentTarget.value}%`; }} /><output>{selected.confidence}%</output></label>
              <label>理由<textarea name="note" required rows={4} placeholder="哪条证据改变了判断？如果没变，为什么还不足以改判？" /></label>
              <button className="primary-button" type="submit">写进案卷</button>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
