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
  { label: "Økonomi", score: 8 },
  { label: "Produktivitet", score: 7 },
  { label: "Fremtidsutsikter", score: 6 },
  { label: "Konkurranseevne", score: 8 },
];

const STEPS = [
  {
    icon: MagnifyingGlassIcon,
    title: "Søk opp virksomheten",
    body: "Skriv inn organisasjonsnummeret. Selskapsdata og regnskap hentes automatisk fra offentlige registre.",
  },
  {
    icon: ChartBarIcon,
    title: "Få en begrunnet vurdering",
    body: "Systemet vurderer økonomi, produktivitet, fremtidsutsikter og konkurranseevne — med sporbar logikk og tallgrunnlag.",
  },
  {
    icon: DocumentTextIcon,
    title: "Rediger og bruk utkastet",
    body: "Du får et ferdig utkast til lønnskravbrev. Rediger det fritt og bruk det som utgangspunkt i forhandlingen.",
  },
];

const FEATURES = [
  "Virksomhetsoppslag via Brønnøysundregisteret",
  "Regnskapsdata fra offentlige kilder",
  "Automatisk scoring av fire forhandlingskriterier",
  "Sporbar logikk — alle vurderinger kan etterprøves",
  "Redigerbart utkast til lønnskravbrev",
  "Fungerer på alle enheter, inkludert mobil",
];

const ARTICLES = [
  {
    href: "/blog/lokale-lonnsforhandlinger.html",
    readTime: 5,
    title: "Slik forbereder du lokale lønnsforhandlinger",
    excerpt: "En praktisk guide for tillitsvalgte: hva du bør forberede, hvilke data som teller og hvordan du bygger et troverdig krav.",
  },
  {
    href: "/blog/regnskap-og-lonnskrav.html",
    readTime: 6,
    title: "Hva betyr regnskapstallene for lønnskravet ditt?",
    excerpt: "Driftsmargin, egenkapital, omsetning per ansatt — lær hvilke tall som faktisk betyr noe og hvordan du leser dem som tillitsvalgt.",
  },
  {
    href: "/blog/frontfagsmodellen.html",
    readTime: 5,
    title: "Frontfagsmodellen forklart — og hva den betyr lokalt",
    excerpt: "Rammen er ikke et tak for din virksomhet. Forstår du frontfagsmodellen, forstår du også hvilken frihet du har i lokale forhandlinger.",
  },
  {
    href: "/blog/metodikk.html",
    readTime: 7,
    title: "Slik beregnes de fire kriteriene",
    excerpt: "En transparent gjennomgang av scoringsmodellen — alle terskelverdier, datakilder og hva som skjer når regnskap ikke er tilgjengelig.",
  },
];

const TRUST_POINTS = [
  "Alle vurderinger er basert på offentlig tilgjengelige data.",
  "Scoringen kan etterprøves — du ser alltid hva den bygger på.",
  "Usikkerhet i datagrunnlaget vises tydelig i resultatet.",
  "Du beholder full kontroll over endelig krav og formulering.",
];

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums text-slate-700 w-5 text-right">{score}</span>
    </div>
  );
}

function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return <img src="/favicon.svg" alt="Lønnskrav" className={`${className} shrink-0`} />;
}

function SignInCta({ label, className }: { label: string; className: string }) {
  return (
    <SignInButton mode="modal">
      <button className={className}>{label}</button>
    </SignInButton>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">

      {/* Nav */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Logo />
            <span className="font-bold text-base tracking-tight">Lønnskrav</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#hvordan" className="hover:text-slate-900 transition-colors">Hvordan</a>
            <a href="#funksjoner" className="hover:text-slate-900 transition-colors">Funksjoner</a>
            <a href="#trygghet" className="hover:text-slate-900 transition-colors">Trygghet</a>
            <a href="#innsikt" className="hover:text-slate-900 transition-colors">Innsikt</a>
          </nav>
          <SignInCta
            label="Logg inn"
            className="h-9 px-4 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors active:scale-[0.98]"
          />
        </div>
      </header>

      <main>

        {/* ── Hero ── */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 mb-5">
                <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                Beslutningsstøtte for tillitsvalgte
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 leading-[1.1]">
                Bygg sterkere<br />
                <span className="text-emerald-600">lønnskrav</span><br />
                med dokumenterte data.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-7 max-w-md">
                Skriv inn org.nr., og du får selskapsdata, regnskap og en vurdering av forhandlingsgrunnlaget — klart til bruk på under ett minutt.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <SignInCta
                  label="Kom i gang gratis"
                  className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-all active:scale-[0.98] shadow-sm"
                />
                <a
                  href="#hvordan"
                  className="w-full sm:w-auto h-12 px-6 rounded-2xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold flex items-center justify-center hover:border-slate-400 transition-colors"
                >
                  Se hvordan det virker
                </a>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  ["4", "Kriterier vurdert"],
                  ["100%", "Sporbare data"],
                  ["< 1 min", "Fra oppslag til utkast"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white px-3 py-3.5 shadow-sm">
                    <div className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{value}</div>
                    <div className="mt-0.5 text-[10px] sm:text-xs text-slate-500 leading-4">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product mockup — desktop only */}
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-50 to-slate-100 rounded-3xl blur-2xl opacity-70" />
              <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Analyse</p>
                    <p className="text-base font-semibold text-slate-900 mt-0.5">Eksempel AS · 2026</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Klar for vurdering
                  </span>
                </div>

                <div className="space-y-2.5 mb-5">
                  {MOCK_SCORES.map(({ label, score }) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-800">{label}</span>
                        <span className="text-xs font-semibold text-emerald-600">
                          {score >= 8 ? "Sterk" : score >= 6 ? "Moderat" : "Svak"}
                        </span>
                      </div>
                      <ScoreBar score={score} />
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Anbefaling</p>
                  <p className="text-base font-bold">Sterkt grunnlag for høyere krav</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Gjennomsnittlig score: <span className="text-white font-semibold">7.3/10</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Hvordan det virker ── */}
        <section id="hvordan" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
            <div className="max-w-xl mb-10 sm:mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Hvordan det virker</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">Tre steg fra data til krav</h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-7">
                Lønnskrav henter data fra offentlige registre, vurderer fire nøkkelkriterier og gir deg et ferdig utkast — alt i én flyt.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-black text-slate-100 select-none leading-none">{i + 1}</div>
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

        {/* ── Funksjoner ── */}
        <section id="funksjoner" className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
            <div className="max-w-xl mb-10 sm:mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Funksjoner</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Enkelt, gjennomtenkt<br className="hidden sm:block" /> og ingenting overflødig
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature} className="rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-3 shadow-sm">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckIcon className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-5">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trygghet ── */}
        <section id="trygghet" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
            <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Trygghet</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                  Data du kan<br />stole på.
                </h2>
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-7">
                  Lønnskrav er laget for å støtte tillitsvalgtes eget arbeid — ikke erstatte vurderingene deres. Alle konklusjoner bygger på offentlige data og er etterprøvbare.
                </p>
                <SignInCta
                  label="Prøv gratis"
                  className="mt-8 w-full sm:w-auto h-12 px-6 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-all active:scale-[0.98] block text-center"
                />
              </div>
              <div className="grid gap-3">
                {TRUST_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm leading-6 text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Innsikt / Blogg ── */}
        <section id="innsikt" className="bg-white border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
            <div className="max-w-xl mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Innsikt</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">Les mer om lønnsforhandlinger</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {ARTICLES.map(({ href, readTime, title, excerpt }) => (
                <a
                  key={href}
                  href={href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col gap-3 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <span className="text-xs text-slate-400">{readTime} min lesetid</span>
                  <h3 className="font-semibold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">{title}</h3>
                  <p className="text-sm text-slate-600 leading-6 flex-1">{excerpt}</p>
                  <span className="text-xs font-medium text-emerald-600">Les artikkelen →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-slate-900">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-28 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Klar til å forhandle<br />med dokumenterte data?
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-7">
              Kom i gang på under ett minutt. Ingen kredittkort, ingen oppsett — bare logg inn og søk opp virksomheten.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <SignInCta
                label="Kom i gang gratis"
                className="h-12 px-8 rounded-2xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-all active:scale-[0.98] shadow-lg"
              />
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
