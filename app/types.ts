export type TrialRecord = {
  id: string;
  title: string;
  status: string;
  phases: string[];
  studyType: string;
  sponsor: string;
  enrollment: number | null;
  startDate: string | null;
  completionDate: string | null;
  lastUpdated: string | null;
  hasResults: boolean;
  interventions: string[];
  countries: string[];
  locationCount: number;
  sourceUrl: string;
};

export type LabelRecord = {
  id: string;
  setId: string;
  effectiveTime: string | null;
  version: string | null;
  brandNames: string[];
  genericNames: string[];
  manufacturerNames: string[];
  applicationNumbers: string[];
  route: string[];
  indications: string | null;
  boxedWarning: string | null;
  sourceUrl: string;
};

export type SourceState = {
  ok: boolean;
  total: number;
  url: string;
  message: string;
};

export type EvidencePayload = {
  fetchedAt: string;
  query: {
    condition: string;
    intervention: string;
  };
  trials: TrialRecord[];
  labels: LabelRecord[];
  sources: {
    clinicalTrials: SourceState;
    openFda: SourceState;
  };
  cautions: string[];
};

export type EvidenceSnapshot = EvidencePayload & {
  id: string;
};

export type JudgmentDirection = "up" | "down" | "same";

export type Judgment = {
  id: string;
  createdAt: string;
  direction: JudgmentDirection;
  confidence: number;
  note: string;
};

export type CaseFile = {
  id: string;
  title: string;
  condition: string;
  intervention: string;
  question: string;
  prediction: string;
  confidence: number;
  reviewDate: string;
  changeConditions: string;
  status: "active" | "closed";
  createdAt: string;
  snapshots: EvidenceSnapshot[];
  judgments: Judgment[];
};
