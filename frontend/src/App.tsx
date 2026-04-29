import { useMemo, useState } from "react";
import { Show, UserButton, useAuth } from "@clerk/react";
import LandingPage from "./landingside";
import {
  BriefcaseIcon,
  FolderOpenIcon,
  PlusIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  TextArea,
  EmptyState,
  ErrorBanner,
  Badge,
  Skeleton,
} from "./components/ui";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type Company = {
  id?: number;
  orgNumber: string;
  name: string;
  industryCode?: string;
  industryDescription?: string;
  organizationFormCode?: string;
  organizationFormDescription?: string;
  employees?: number;
  bankrupt?: boolean;
  underLiquidation?: boolean;
  businessAddress?: string;
};

type NegotiationCase = {
  id: number;
  title: string;
  negotiationYear: number;
  status: string;
  company?: Company;
};

type AnalysisResult = {
  economyScore: number;
  productivityScore: number;
  outlookScore: number;
  competitivenessScore: number;
  recommendation: string;
  economyRationale?: string;
  productivityRationale?: string;
  outlookRationale?: string;
  competitivenessRationale?: string;
  hasRegnskapData: boolean;
  regnskapYear?: number;
  valuta?: string;
  draftText?: string;
};

type CreateCaseForm = {
  title: string;
  negotiationYear: string;
  orgNumber: string;
};

const initialForm: CreateCaseForm = {
  title: "Lokale forhandlinger 2026",
  negotiationYear: "2026",
  orgNumber: "",
};

function scoreColor(score: number): "emerald" | "amber" | "slate" {
  if (score >= 8) return "emerald";
  if (score >= 6) return "amber";
  return "slate";
}

function scoreLabel(score: number) {
  if (score >= 8) return "Sterk";
  if (score >= 6) return "Moderat";
  return "Svak";
}

function recommendationLabel(value: string) {
  switch (value) {
    case "HIGH_INCREASE": return "Sterkt grunnlag for høyere krav";
    case "MODERATE_INCREASE": return "Moderat grunnlag for lønnskrav";
    case "LOW_INCREASE": return "Forsiktig krav anbefales";
    default: return value;
  }
}


export function AppWithAuth() {
  const { getToken } = useAuth();
  return (
    <>
      <Show when="signed-out">
        <LandingPage />
      </Show>
      <Show when="signed-in">
        <App getToken={getToken} authSlot={<UserButton />} />
      </Show>
    </>
  );
}

export default function App({
  getToken = async () => null,
  authSlot = null,
}: {
  getToken?: () => Promise<string | null>;
  authSlot?: React.ReactNode;
}) {
  const [form, setForm] = useState<CreateCaseForm>(initialForm);
  const [cases, setCases] = useState<NegotiationCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<NegotiationCase | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loadingCases, setLoadingCases] = useState(false);
  const [creatingCase, setCreatingCase] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("Foreløpig utkast til lønnskrav kommer her etter analyse.");
  const [showMobileCreate, setShowMobileCreate] = useState(false);

  const averageScore = useMemo(() => {
    if (!analysis) return 0;
    const total = analysis.economyScore + analysis.productivityScore + analysis.outlookScore + analysis.competitivenessScore;
    return (total / 4).toFixed(1);
  }, [analysis]);

  async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const token = await getToken();
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}`);
    }
    return response.json();
  }

  async function loadCases() {
    try {
      setLoadingCases(true);
      setError(null);
      const data = await apiFetch<NegotiationCase[]>(`${API_BASE_URL}/api/cases`);
      setCases(data);
      if (data.length === 0) { setSelectedCase(null); setAnalysis(null); return; }
      if (selectedCase) {
        setSelectedCase(data.find((i) => i.id === selectedCase.id) ?? data[0]);
      } else {
        setSelectedCase(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente saker.");
    } finally {
      setLoadingCases(false);
    }
  }

  async function createCase() {
    try {
      setCreatingCase(true);
      setError(null);
      const created = await apiFetch<NegotiationCase>(`${API_BASE_URL}/api/cases`, {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          negotiationYear: Number(form.negotiationYear),
          orgNumber: form.orgNumber,
        }),
      });
      setCases((prev) => [created, ...prev]);
      setSelectedCase(created);
      setAnalysis(null);
      setDraftText(`Sak opprettet for ${created.company?.name ?? "selskapet"}. Kjør analyse for å generere utkast.`);
      setShowMobileCreate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke opprette sak.");
    } finally {
      setCreatingCase(false);
    }
  }

  async function runAnalysis(caseId: number) {
    try {
      setAnalyzing(true);
      setError(null);
      const result = await apiFetch<AnalysisResult>(`${API_BASE_URL}/api/cases/${caseId}/analyze`);
      setAnalysis(result);
      if (result.draftText) setDraftText(result.draftText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke kjøre analyse.");
    } finally {
      setAnalyzing(false);
    }
  }

  const criteriaRows = analysis ? [
    { label: "Økonomi", score: analysis.economyScore, rationale: analysis.economyRationale, icon: "💰" },
    { label: "Produktivitet", score: analysis.productivityScore, rationale: analysis.productivityRationale, icon: "📈" },
    { label: "Fremtidsutsikter", score: analysis.outlookScore, rationale: analysis.outlookRationale, icon: "🔭" },
    { label: "Konkurranseevne", score: analysis.competitivenessScore, rationale: analysis.competitivenessRationale, icon: "⚡" },
  ] : [];

  const createForm = (
    <div className="space-y-4">
      <Input
        label="Tittel"
        value={form.title}
        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        placeholder="Lokale forhandlinger 2026"
      />
      <Input
        label="Forhandlingsår"
        type="number"
        value={form.negotiationYear}
        onChange={(e) => setForm((p) => ({ ...p, negotiationYear: e.target.value }))}
        placeholder="2026"
      />
      <Input
        label="Organisasjonsnummer"
        value={form.orgNumber}
        onChange={(e) => setForm((p) => ({ ...p, orgNumber: e.target.value }))}
        placeholder="9 siffer"
        helper="Finner du i Brønnøysundregisteret eller på firmaets brev."
        maxLength={9}
      />
      {error && <ErrorBanner message={error} />}
      <div className="flex gap-3 pt-1">
        <Button
          variant="primary"
          onClick={createCase}
          loading={creatingCase}
          className="flex-1 sm:flex-none"
        >
          <PlusIcon className="w-4 h-4" />
          Opprett sak
        </Button>
        <Button variant="secondary" onClick={loadCases} loading={loadingCases}>
          <ArrowPathIcon className="w-4 h-4" />
          Hent saker
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="Lønnskrav" className="h-8 w-8 shrink-0" />
            <div className="leading-tight">
              <div className="text-base font-bold">Lønnskrav</div>
              <div className="text-xs text-slate-500 hidden sm:block">Lønnsforhandlinger</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={loadCases} loading={loadingCases} className="hidden sm:inline-flex h-9 px-3.5 text-xs">
              <ArrowPathIcon className="w-3.5 h-3.5" />
              Hent saker
            </Button>
            {authSlot}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-28 sm:pb-8">

        {/* Top grid: Opprett + Saker */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Opprett ny sak — hidden on mobile (shown via modal/sheet) */}
          <Card className="hidden sm:block">
            <CardHeader
              title="Opprett ny sak"
              subtitle="Søk opp selskapet via org.nr. og hent data automatisk."
            />
            <CardBody>{createForm}</CardBody>
          </Card>

          {/* Saker */}
          <Card>
            <CardHeader
              title="Saker"
              subtitle={cases.length > 0 ? `${cases.length} sak${cases.length !== 1 ? "er" : ""}` : undefined}
              action={
                <Button variant="ghost" onClick={loadCases} loading={loadingCases} className="h-8 px-2.5 text-xs">
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Oppdater</span>
                </Button>
              }
            />
            <CardBody className="pt-4">
              {loadingCases ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}
                </div>
              ) : cases.length === 0 ? (
                <EmptyState
                  icon={<FolderOpenIcon />}
                  title="Ingen saker ennå"
                  subtitle="Opprett en ny sak for å komme i gang."
                />
              ) : (
                <div className="space-y-2">
                  {cases.map((item) => {
                    const active = selectedCase?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setSelectedCase(item); setAnalysis(null); }}
                        className={`w-full rounded-xl border p-4 text-left transition-all duration-150 group ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white shadow-md"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium text-sm truncate">{item.title}</div>
                          <span className={`text-xs shrink-0 tabular-nums ${active ? "text-slate-400" : "text-slate-400"}`}>#{item.id}</span>
                        </div>
                        <div className={`mt-1.5 text-xs flex items-center gap-1.5 ${active ? "text-slate-400" : "text-slate-500"}`}>
                          <BuildingOffice2Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.company?.name ?? "Ukjent selskap"}</span>
                          <span className="opacity-40">·</span>
                          <span className="shrink-0">{item.negotiationYear}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Bottom grid: Valgt sak + Analyse */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Valgt sak */}
          <Card>
            <CardHeader title="Valgt sak" subtitle={selectedCase ? selectedCase.company?.name : undefined} />
            <CardBody className="pt-4">
              {selectedCase ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                    <InfoTile label="Org.nr." value={selectedCase.company?.orgNumber ?? "-"} />
                    <InfoTile label="Selskapsform" value={selectedCase.company?.organizationFormCode ?? "-"} sub={selectedCase.company?.organizationFormDescription} />
                    <InfoTile label="Ansatte" value={String(selectedCase.company?.employees ?? 0)} />
                    <InfoTile label="Bransje" value={selectedCase.company?.industryCode ?? "-"} sub={selectedCase.company?.industryDescription} />
                  </div>
                  {selectedCase.company?.businessAddress && (
                    <InfoTile label="Adresse" value={selectedCase.company.businessAddress} />
                  )}
                  <div className="flex gap-2">
                    {selectedCase.company?.bankrupt && <Badge color="slate">Konkurs</Badge>}
                    {selectedCase.company?.underLiquidation && <Badge color="amber">Under avvikling</Badge>}
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <Button
                      variant="primary"
                      onClick={() => runAnalysis(selectedCase.id)}
                      loading={analyzing}
                      fullWidth
                    >
                      <ChartBarIcon className="w-4 h-4" />
                      {analyzing ? "Analyserer..." : "Kjør analyse"}
                    </Button>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={<BriefcaseIcon />}
                  title="Ingen sak valgt"
                  subtitle="Velg en sak fra listen for å se detaljer."
                />
              )}
            </CardBody>
          </Card>

          {/* Analyse */}
          <Card>
            <CardHeader
              title="Analyse"
              action={
                analysis && (
                  analysis.hasRegnskapData
                    ? <Badge color="emerald">Regnskap {analysis.regnskapYear}</Badge>
                    : <Badge color="amber">Kun registreringsdata</Badge>
                )
              }
            />
            <CardBody className="pt-4">
              {analysis ? (
                <div className="space-y-4">
                  {/* Recommendation banner */}
                  <div className="rounded-xl bg-slate-900 text-white p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Anbefaling</span>
                    </div>
                    <div className="text-base font-semibold">{recommendationLabel(analysis.recommendation)}</div>
                    <div className="mt-1 text-sm text-slate-400">Gjennomsnittlig score: <span className="text-white font-medium">{averageScore}/10</span></div>
                  </div>

                  {/* Score rows */}
                  <div className="space-y-2.5">
                    {criteriaRows.map(({ label, score, rationale, icon }) => (
                      <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                            <span>{icon}</span>
                            {label}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge color={scoreColor(score)}>{scoreLabel(score)}</Badge>
                            <span className="text-base font-bold text-slate-900 tabular-nums w-8 text-right">{score}<span className="text-xs font-normal text-slate-400">/10</span></span>
                          </div>
                        </div>
                        {rationale && (
                          <p className="mt-2 text-xs leading-5 text-slate-500">{rationale}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={<ChartBarIcon />}
                  title="Ingen analyse ennå"
                  subtitle={selectedCase ? "Trykk «Kjør analyse» for å starte." : "Velg en sak først."}
                />
              )}
            </CardBody>
          </Card>
        </div>

        {/* Utkast */}
        <Card>
          <CardHeader
            title="Utkast til lønnskrav"
            subtitle="Generert fra regnskaps- og selskapsdata. Rediger fritt før bruk."
            action={<DocumentTextIcon className="w-5 h-5 text-slate-400" />}
          />
          <CardBody className="pt-4">
            <TextArea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              className="min-h-[240px]"
            />
          </CardBody>
        </Card>
      </main>

      {/* Mobile: Opprett sak sheet */}
      {showMobileCreate && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileCreate(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
              <h2 className="text-base font-semibold">Opprett ny sak</h2>
              <button
                onClick={() => setShowMobileCreate(false)}
                className="text-slate-400 text-sm hover:text-slate-700 transition-colors"
              >
                Lukk
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5 space-y-0 pb-8">
              {createForm}
            </div>
          </div>
        </div>
      )}

      {/* Mobile sticky CTA */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-4 pt-3 pb-4 flex gap-3">
        <Button variant="primary" fullWidth onClick={() => setShowMobileCreate(true)}>
          <PlusIcon className="w-4 h-4" />
          Opprett ny sak
        </Button>
        <Button variant="secondary" onClick={loadCases} loading={loadingCases} className="shrink-0 w-11 px-0 justify-center">
          <ArrowPathIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-0 hidden sm:block">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-400">
            Utviklet av{" "}
            <a href="https://github.com/filipguz" className="font-medium text-slate-600 hover:text-slate-900" target="_blank" rel="noopener noreferrer">filipguz</a>
          </span>
          <div className="flex gap-4 text-xs text-slate-400">
            <a href="mailto:hei@filipgustavsen.no" className="hover:text-slate-900">hei@filipgustavsen.no</a>
            <a href="https://filipgustavsen.no" className="hover:text-slate-900" target="_blank" rel="noopener noreferrer">filipgustavsen.no</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-3">
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div className="text-sm font-medium text-slate-900 truncate">{value}</div>
      {sub && <div className="text-xs text-slate-400 truncate">{sub}</div>}
    </div>
  );
}
