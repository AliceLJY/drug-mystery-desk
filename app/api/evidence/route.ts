import type {
  EvidencePayload,
  LabelRecord,
  SourceState,
  TrialRecord,
} from "../../types";

export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 120;
const REQUEST_TIMEOUT_MS = 12_000;

type ClinicalTrialsResponse = {
  totalCount?: number;
  studies?: Array<Record<string, unknown>>;
};

type OpenFdaResponse = {
  meta?: { results?: { total?: number } };
  results?: Array<Record<string, unknown>>;
  error?: { message?: string };
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function clipped(value: unknown, max = 420) {
  const normalized = text(value).replace(/\s+/g, " ");
  if (!normalized) return null;
  return normalized.length > max ? `${normalized.slice(0, max).trim()}…` : normalized;
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "drug-mystery-desk/0.1 (personal research prototype)",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`上游返回 ${response.status}`) as Error & {
      status?: number;
      body?: string;
    };
    error.status = response.status;
    error.body = body.slice(0, 240);
    throw error;
  }

  return (await response.json()) as T;
}

function parseTrial(raw: Record<string, unknown>): TrialRecord {
  const protocol = record(raw.protocolSection);
  const identification = record(protocol.identificationModule);
  const status = record(protocol.statusModule);
  const design = record(protocol.designModule);
  const sponsorModule = record(protocol.sponsorCollaboratorsModule);
  const leadSponsor = record(sponsorModule.leadSponsor);
  const armsModule = record(protocol.armsInterventionsModule);
  const contactsModule = record(protocol.contactsLocationsModule);
  const enrollment = record(design.enrollmentInfo);
  const locations = Array.isArray(contactsModule.locations)
    ? contactsModule.locations.map(record)
    : [];
  const interventions = Array.isArray(armsModule.interventions)
    ? armsModule.interventions.map(record)
    : [];
  const id = text(identification.nctId);

  return {
    id,
    title: text(identification.briefTitle) || "未命名研究",
    status: text(status.overallStatus) || "UNKNOWN",
    phases: stringArray(design.phases),
    studyType: text(design.studyType) || "UNKNOWN",
    sponsor: text(leadSponsor.name) || "未披露",
    enrollment:
      typeof enrollment.count === "number" ? enrollment.count : null,
    startDate: text(record(status.startDateStruct).date) || null,
    completionDate: text(record(status.completionDateStruct).date) || null,
    lastUpdated: text(record(status.lastUpdatePostDateStruct).date) || null,
    hasResults: raw.hasResults === true,
    interventions: interventions.map((item) => text(item.name)).filter(Boolean),
    countries: Array.from(
      new Set(locations.map((item) => text(item.country)).filter(Boolean)),
    ),
    locationCount: locations.length,
    sourceUrl: `https://clinicaltrials.gov/study/${encodeURIComponent(id)}`,
  };
}

function parseLabel(raw: Record<string, unknown>): LabelRecord {
  const openFda = record(raw.openfda);
  const id = text(raw.id);
  const setId = text(raw.set_id) || id;

  return {
    id,
    setId,
    effectiveTime: text(raw.effective_time) || null,
    version: text(raw.version) || null,
    brandNames: stringArray(openFda.brand_name),
    genericNames: stringArray(openFda.generic_name),
    manufacturerNames: stringArray(openFda.manufacturer_name),
    applicationNumbers: stringArray(openFda.application_number),
    route: stringArray(openFda.route),
    indications: clipped(Array.isArray(raw.indications_and_usage) ? raw.indications_and_usage[0] : null),
    boxedWarning: clipped(Array.isArray(raw.boxed_warning) ? raw.boxed_warning[0] : null),
    sourceUrl: `https://api.fda.gov/drug/label.json?search=set_id:${encodeURIComponent(setId)}`,
  };
}

async function getTrials(condition: string, intervention: string) {
  const url = new URL("https://clinicaltrials.gov/api/v2/studies");
  const safeCondition = condition.replaceAll('"', " ");
  const safeIntervention = intervention.replaceAll('"', " ");
  url.searchParams.set("query.cond", `AREA[Condition]\"${safeCondition}\"`);
  if (intervention) {
    url.searchParams.set(
      "query.intr",
      `AREA[InterventionName]\"${safeIntervention}\"`,
    );
  }
  url.searchParams.set("sort", "LastUpdatePostDate:desc");
  url.searchParams.set("pageSize", "12");
  url.searchParams.set("countTotal", "true");
  url.searchParams.set("format", "json");

  try {
    const payload = await fetchJson<ClinicalTrialsResponse>(url);
    const trials = (payload.studies ?? []).map((item) => parseTrial(record(item)));
    return {
      trials,
      source: {
        ok: true,
        total: payload.totalCount ?? trials.length,
        url: url.toString(),
        message: trials.length ? "已取得最新公开登记" : "未找到匹配研究",
      } satisfies SourceState,
    };
  } catch (error) {
    return {
      trials: [] as TrialRecord[],
      source: {
        ok: false,
        total: 0,
        url: url.toString(),
        message: error instanceof Error ? error.message : "ClinicalTrials.gov 暂时不可用",
      } satisfies SourceState,
    };
  }
}

async function requestLabels(intervention: string, field: "generic_name" | "brand_name") {
  const url = new URL("https://api.fda.gov/drug/label.json");
  url.searchParams.set(
    "search",
    `openfda.${field}.exact:\"${intervention.toUpperCase()}\"`,
  );
  url.searchParams.set("sort", "effective_time:desc");
  url.searchParams.set("limit", "5");
  return { url, payload: await fetchJson<OpenFdaResponse>(url) };
}

async function getLabels(intervention: string) {
  if (!intervention) {
    return {
      labels: [] as LabelRecord[],
      source: {
        ok: true,
        total: 0,
        url: "https://open.fda.gov/apis/drug/label/",
        message: "未填写药物名，本轮跳过标签检索",
      } satisfies SourceState,
    };
  }

  try {
    let result;
    try {
      result = await requestLabels(intervention, "generic_name");
    } catch (error) {
      if ((error as Error & { status?: number }).status !== 404) throw error;
      result = await requestLabels(intervention, "brand_name");
    }

    const labels = (result.payload.results ?? []).map((item) => parseLabel(record(item)));
    return {
      labels,
      source: {
        ok: true,
        total: result.payload.meta?.results?.total ?? labels.length,
        url: result.url.toString(),
        message: labels.length ? "已取得公开药品标签" : "未找到匹配标签",
      } satisfies SourceState,
    };
  } catch (error) {
    const status = (error as Error & { status?: number }).status;
    if (status === 404) {
      return {
        labels: [] as LabelRecord[],
        source: {
          ok: true,
          total: 0,
          url: "https://open.fda.gov/apis/drug/label/",
          message: "未找到匹配标签；这不等于药物未获批",
        } satisfies SourceState,
      };
    }
    return {
      labels: [] as LabelRecord[],
      source: {
        ok: false,
        total: 0,
        url: "https://open.fda.gov/apis/drug/label/",
        message: error instanceof Error ? error.message : "openFDA 暂时不可用",
      } satisfies SourceState,
    };
  }
}

export async function POST(request: Request) {
  let body: { condition?: unknown; intervention?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "请求内容不是有效 JSON" }, { status: 400 });
  }

  const condition = text(body.condition);
  const intervention = text(body.intervention);

  if (!condition) {
    return Response.json({ error: "请先填写疾病或适应证" }, { status: 400 });
  }
  if (condition.length > MAX_QUERY_LENGTH || intervention.length > MAX_QUERY_LENGTH) {
    return Response.json({ error: "检索词过长，请缩短后再试" }, { status: 400 });
  }

  const [trialResult, labelResult] = await Promise.all([
    getTrials(condition, intervention),
    getLabels(intervention),
  ]);

  const payload: EvidencePayload = {
    fetchedAt: new Date().toISOString(),
    query: { condition, intervention },
    trials: trialResult.trials,
    labels: labelResult.labels,
    sources: {
      clinicalTrials: trialResult.source,
      openFda: labelResult.source,
    },
    cautions: [
      "登记状态变化不等于疗效结论，也不自动解释试验为何变化。",
      "openFDA 标签与不良事件数据不能用于诊断、用药建议或因果推断。",
      "未检索到记录只表示本次公开数据未命中，不等于对象不存在或未获批。",
    ],
  };

  return Response.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
