import { SignInButton } from "@clerk/react";
import {
  ChartBarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const MOCK_SCORES = [
  { label: "Økonomi", score: 8, color: "emerald", note: "Positiv resultatutvikling og god egenkapital." },
  { label: "Produktivitet", score: 7, color: "emerald", note: "Stabil verdiskaping per ansatt siste år." },
  { label: "Fremtidsutsikter", score: 6, color: "amber", note: "Stabilt marked — bør suppleres med lokal innsikt." },
  { label: "Konkurranseevne", score: 8, color: "emerald", note: "Behov for å beholde kompetanse støtter lønn." },
];

const STEPS = [
  { icon: MagnifyingGlassIcon, title: "Søk opp virksomheten", body: "Skriv inn organisasjonsnummeret og hent selskapsdata og regnskap automatisk fra offentlige registre." },
  { icon: ChartBarIcon, title: "Analyser fire kriterier", body: "Systemet vurderer økonomi, produktivitet, fremtidsutsikter og konkurranseevne med sporbar logikk." },
  { icon: DocumentTextIcon, title: "Få et redigerbart utkast", body: "AI formulerer et brev basert på dataene. Du beholder full kontroll og kan redigere fritt." },
];

const FEATURES = [
  "Virksomhetsoppslag via Brønnøysundregisteret",
  "Regnskapsdata fra Proff og offentlige kilder",
  "Automatisk scoring av fire forhandlingskriterier",
  "Sporbar og forklarbar AI — ingen svarte bokser",
  "Redigerbart utkast til lønnskravbrev",
  "Fungerer på alle enheter, inkludert mobil",
];

const TRUST_POINTS = [
  "AI brukes til tekststøtte, ikke alene til beslutninger.",
  "Alle vurderinger spores tilbake til dokumenterte kilder.",
  "Usikkerhet i datagrunnlaget vises tydelig.",
  "Brukeren beholder full kontroll over endelig krav.",
];

function ScoreDot({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums text-slate-700 w-6 text-right">{score}</span>
    </div>
  );
}

function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return <img src="/favicon.svg" alt="Lønnskrav" className={`${className} shrink-0`} />;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-bold text-base tracking-tight">Lønnskrav</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#hvordan" className="hover:text-slate-900 transition-colors">Hvordan</a>
            <a href="#funksjoner" className="hover:text-slate-900 transition-colors">Funksjoner</a>
            <a href="#trygghet" className="hover:text-slate-900 transition-colors">Trygghet</a>
          </nav>

          <SignInButton mode="modal">
            <button className="h-9 px-4 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors active:scale-[0.98]">
              Logg inn
            </button>
          </SignInButton>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 mb-5">
                <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                Beslutningsstøtte for tillitsvalgte
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 leading-[1.12]">
                Bygg sterkere<br />
                <span className="text-emerald-600">lønnskrav</span> med<br />
                dokumenterte data.
              </h1>

              <p className="mt-5 text-lg text-slate-600 leading-7 max-w-md">
                Lønnskrav henter selskapsdata og regnskap automatisk, analyserer dem mot fire forhandlingskriterier og lager et redigerbart kravbrev med sporbare begrunnelser.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <SignInButton mode="modal">
                  <button className="h-12 px-6 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-all active:scale-[0.98] shadow-sm">
                    Kom i gang gratis
                  </button>
                </SignInButton>
                <a
                  href="#hvordan"
                  className="h-12 px-6 rounded-2xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold flex items-center justify-center hover:border-slate-400 transition-colors"
                >
                  Se hvordan det virker
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3">
                {[
                  ["4", "kriterier analysert"],
                  ["100%", "sporbare kilder"],
                  ["Redigerbart", "kravbrev"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-xl font-bold text-slate-900">{value}</div>
                    <div className="mt-0.5 text-xs text-slate-500 leading-4">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-50 to-slate-100 rounded-3xl blur-2xl opacity-60" />
              <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
                {/* Mock header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">ANALYSE</p>
                    <p className="text-base font-semibold text-slate-900 mt-0.5">Eksempel AS · 2026</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Klar for vurdering
                  </span>
                </div>

                {/* Scores */}
                <div className="space-y-3 mb-4">
                  {MOCK_SCORES.map(({ label, score, note }) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-800">{label}</span>
                        <span className="text-xs text-slate-500">{note}</span>
                      </div>
                      <ScoreDot score={score} />
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Anbefaling</p>
                  <p className="text-lg font-bold">Sterkt grunnlag for høyere krav</p>
                  <p className="mt-1 text-sm text-slate-400">Gjennomsnittlig score: <span className="text-white font-semibold">7.3/10</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="hvordan" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-24">
            <div className="max-w-xl mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Hvordan det virker</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">Tre steg fra data til krav</h2>
              <p className="mt-4 text-lg text-slate-600">
                Løsningen kombinerer selskapsdata, regelbasert analyse og AI-støtte for raskere og bedre dokumenterte lønnskrav.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 relative overflow-hidden">
                  <div className="absolute top-5 right-5 text-5xl font-black text-slate-100 select-none leading-none">{i + 1}</div>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-600 leading-6">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="funksjoner" className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-24">
            <div className="max-w-xl mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Funksjoner</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">Alt du trenger, ingen du ikke gjør</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature} className="rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckIcon className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-5">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section id="trygghet" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Trygghet</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                  AI som hjelper,<br />ikke overtar.
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-7">
                  Lønnskrav er laget for å styrke tillitsvalgtes eget arbeid — ikke erstatte vurderingene deres. Alle konklusjoner er forklart og sporbare.
                </p>
                <SignInButton mode="modal">
                  <button className="mt-8 h-12 px-6 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-all active:scale-[0.98]">
                    Prøv gratis
                  </button>
                </SignInButton>
              </div>
              <div className="grid gap-3">
                {TRUST_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm leading-6 text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Klar til å forhandle<br />med dokumenterte data?
            </h2>
            <p className="mt-5 text-lg text-slate-400 max-w-xl mx-auto leading-7">
              Kom i gang på under ett minutt. Ingen kredittkort, ingen oppsett — bare logg inn og søk opp din virksomhet.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignInButton mode="modal">
                <button className="h-12 px-8 rounded-2xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-all active:scale-[0.98] shadow-lg">
                  Kom i gang gratis
                </button>
              </SignInButton>
              <a
                href="mailto:hei@filipgustavsen.no"
                className="h-12 px-8 rounded-2xl border border-slate-700 text-white text-sm font-semibold flex items-center justify-center hover:border-slate-500 transition-colors"
              >
                Kontakt oss
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-sm font-semibold text-slate-300">Lønnskrav</span>
          </div>
          <div className="flex gap-5 text-xs text-slate-500">
            <a href="mailto:hei@filipgustavsen.no" className="hover:text-slate-300 transition-colors">hei@filipgustavsen.no</a>
            <a href="https://filipgustavsen.no" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">filipgustavsen.no</a>
            <a href="https://github.com/filipguz" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
