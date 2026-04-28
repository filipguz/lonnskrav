import { useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

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
  orgNumber: "918405119",
};

function scoreLabel(score: number) {
  if (score >= 8) return "Sterk";
  if (score >= 6) return "Moderat";
  return "Svak";
}

function scoreBadgeClass(score: number) {
  if (score >= 8) return "bg-emerald-100 text-emerald-700";
  if (score >= 6) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function recommendationLabel(value: string) {
  switch (value) {
    case "HIGH_INCREASE":
      return "Sterkt grunnlag for høyere krav";
    case "MODERATE_INCREASE":
      return "Moderat grunnlag for lønnskrav";
    case "LOW_INCREASE":
      return "Forsiktig krav anbefales";
    default:
      return value;
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export default function App() {
  const [form, setForm] = useState<CreateCaseForm>(initialForm);
  const [cases, setCases] = useState<NegotiationCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<NegotiationCase | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loadingCases, setLoadingCases] = useState(false);
  const [creatingCase, setCreatingCase] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftText, setDraftText] = useState(
    "Foreløpig utkast til lønnskrav kommer her etter analyse."
  );

  const averageScore = useMemo(() => {
    if (!analysis) return 0;
    const total =
      analysis.economyScore +
      analysis.productivityScore +
      analysis.outlookScore +
      analysis.competitivenessScore;
    return (total / 4).toFixed(1);
  }, [analysis]);

  async function loadCases() {
    try {
      setLoadingCases(true);
      setError(null);
      const data = await fetchJson<NegotiationCase[]>(`${API_BASE_URL}/api/cases`);
      setCases(data);
      if (data.length === 0) {
        setSelectedCase(null);
        setAnalysis(null);
        return;
      }
      if (selectedCase) {
        const updated = data.find((item) => item.id === selectedCase.id);
        setSelectedCase(updated ?? data[0]);
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
      const payload = {
        title: form.title,
        negotiationYear: Number(form.negotiationYear),
        orgNumber: form.orgNumber,
      };
      const created = await fetchJson<NegotiationCase>(`${API_BASE_URL}/api/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setCases((prev) => [created, ...prev]);
      setSelectedCase(created);
      setAnalysis(null);
      setDraftText(
        `Sak opprettet for ${created.company?.name ?? "selskapet"}. Kjør analyse for å generere utkast til lønnskrav.`
      );
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
      const result = await fetchJson<AnalysisResult>(
        `${API_BASE_URL}/api/cases/${caseId}/analyze`
      );
      setAnalysis(result);
      if (result.draftText) {
        setDraftText(result.draftText);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke kjøre analyse.");
    } finally {
      setAnalyzing(false);
    }
  }

  const criteriaRows = analysis
    ? [
        {
          label: "Økonomi",
          score: analysis.economyScore,
          rationale: analysis.economyRationale,
        },
        {
          label: "Produktivitet",
          score: analysis.productivityScore,
          rationale: analysis.productivityRationale,
        },
        {
          label: "Fremtidsutsikter",
          score: analysis.outlookScore,
          rationale: analysis.outlookRationale,
        },
        {
          label: "Konkurranseevne",
          score: analysis.competitivenessScore,
          rationale: analysis.competitivenessRationale,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="Lønnskrav AI" className="h-10 w-10 shrink-0" />
              <div>
                <h1 className="text-2xl font-bold">Lønnskrav AI</h1>
                <p className="text-sm text-slate-500">
                  Beslutningsstøtte for tillitsvalgte – selskapsdata og regnskap til
                  dokumenterte lønnskrav.
                </p>
              </div>
            </div>
            <button
              onClick={loadCases}
              disabled={loadingCases}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
            >
              {loadingCases ? "Henter..." : "Hent saker"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Opprett sak */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Opprett ny forhandlingssak</h2>
            <p className="mt-2 text-sm text-slate-500">
              Søk opp selskapet og hent regnskapsdata automatisk.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Tittel</label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Forhandlingsår</label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  value={form.negotiationYear}
                  onChange={(e) => setForm((p) => ({ ...p, negotiationYear: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Organisasjonsnummer</label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  placeholder="9 siffer"
                  value={form.orgNumber}
                  onChange={(e) => setForm((p) => ({ ...p, orgNumber: e.target.value }))}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={createCase}
                  disabled={creatingCase}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {creatingCase ? "Oppretter..." : "Opprett sak"}
                </button>
                <button
                  onClick={loadCases}
                  disabled={loadingCases}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
                >
                  Hent saker
                </button>
              </div>
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 whitespace-pre-wrap">
                  {error}
                </div>
              )}
            </div>
          </section>

          {/* Saksliste */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Saker</h2>
            <p className="mt-2 text-sm text-slate-500">Velg en sak og kjør analyse.</p>
            <div className="mt-6 space-y-3">
              {cases.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  Ingen saker ennå.
                </div>
              ) : (
                cases.map((item) => {
                  const active = selectedCase?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedCase(item);
                        setAnalysis(null);
                      }}
                      className={`w-full rounded-xl border p-4 text-left transition-colors ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-60">#{item.id}</div>
                      </div>
                      <div className={`mt-1 text-sm ${active ? "text-slate-300" : "text-slate-500"}`}>
                        {item.company?.name ?? "Ukjent selskap"} · {item.negotiationYear} ·{" "}
                        {item.company?.organizationFormCode ?? "-"}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Valgt sak */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Valgt sak</h2>
            {selectedCase ? (
              <div className="mt-4 space-y-3">
                <InfoRow label="Tittel" value={selectedCase.title} />
                <InfoRow label="Selskapsnavn" value={selectedCase.company?.name ?? "Ukjent"} />
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoRow label="Org.nr." value={selectedCase.company?.orgNumber ?? "-"} />
                  <InfoRow
                    label="Organisasjonsform"
                    value={selectedCase.company?.organizationFormDescription ?? "-"}
                    sub={selectedCase.company?.organizationFormCode}
                  />
                  <InfoRow
                    label="Bransje"
                    value={selectedCase.company?.industryDescription ?? "-"}
                    sub={selectedCase.company?.industryCode}
                  />
                  <InfoRow
                    label="Ansatte"
                    value={String(selectedCase.company?.employees ?? 0)}
                  />
                </div>
                <InfoRow label="Adresse" value={selectedCase.company?.businessAddress ?? "-"} />
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoRow label="Konkurs" value={selectedCase.company?.bankrupt ? "Ja" : "Nei"} />
                  <InfoRow label="Under avvikling" value={selectedCase.company?.underLiquidation ? "Ja" : "Nei"} />
                </div>
                <button
                  onClick={() => runAnalysis(selectedCase.id)}
                  disabled={analyzing}
                  className="mt-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {analyzing ? "Analyserer..." : "Kjør analyse"}
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                Ingen sak valgt.
              </div>
            )}
          </section>

          {/* Analyse */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Analyse</h2>
              {analysis && (
                <div className="flex items-center gap-2">
                  {analysis.hasRegnskapData ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Regnskap {analysis.regnskapYear}
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                      Kun registreringsdata
                    </span>
                  )}
                </div>
              )}
            </div>

            {analysis ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-slate-900 p-4 text-white">
                  <div className="text-sm text-slate-300">Anbefaling</div>
                  <div className="mt-1 text-xl font-semibold">
                    {recommendationLabel(analysis.recommendation)}
                  </div>
                  <div className="mt-1 text-sm text-slate-300">
                    Gjennomsnittlig score: {averageScore}/10
                  </div>
                </div>

                <div className="space-y-3">
                  {criteriaRows.map(({ label, score, rationale }) => (
                    <div key={label} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{label}</div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${scoreBadgeClass(score)}`}
                          >
                            {scoreLabel(score)}
                          </span>
                          <span className="text-lg font-bold">{score}/10</span>
                        </div>
                      </div>
                      {rationale && (
                        <p className="mt-2 text-sm leading-5 text-slate-500">{rationale}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                Ingen analyse kjørt ennå.
              </div>
            )}
          </section>
        </div>

        {/* Utkast */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Utkast til lønnskrav</h2>
              <p className="mt-1 text-sm text-slate-500">
                Generert fra regnskaps- og selskapsdata. Rediger fritt før bruk.
              </p>
            </div>
          </div>
          <textarea
            className="mt-4 min-h-[280px] w-full rounded-xl border border-slate-300 p-3 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
          />
        </section>
      </main>
    </div>
  );
}

function InfoRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  );
}
