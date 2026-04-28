export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Lønnskrav" className="h-9 w-9 shrink-0" />
            <div>
              <div className="text-lg font-semibold tracking-tight">Lønnskrav</div>
              <div className="text-sm text-slate-500">Beslutningsstøtte for lokale lønnsforhandlinger</div>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            <a href="#hvordan" className="transition hover:text-slate-900">Hvordan det virker</a>
            <a href="#funksjoner" className="transition hover:text-slate-900">Funksjoner</a>
            <a href="#trygghet" className="transition hover:text-slate-900">Trygghet</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              Forklarbar AI for tillitsvalgte
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Bygg bedre lønnskrav med dokumenterte data og tydelige begrunnelser.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Lønnskrav henter selskapsdata, vurderer dem opp mot kriteriene i lokale forhandlinger og lager et redigerbart forslag til lønnskrav med sporbare kilder.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#kontakt"
                className="rounded-2xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
              >
                Be om demo
              </a>
              <a
                href="#hvordan"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Se hvordan det virker
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-2xl font-semibold">4</div>
                <div className="mt-1 text-sm text-slate-600">kriterier analysert</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-2xl font-semibold">100%</div>
                <div className="mt-1 text-sm text-slate-600">sporbare kilder</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-2xl font-semibold">Redigerbart</div>
                <div className="mt-1 text-sm text-slate-600">utkast til kravbrev</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-500">Analyse</div>
                    <div className="text-xl font-semibold">Eksempel AS</div>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    Klar for vurdering
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    ["Økonomi", "Sterk", "Positiv resultatutvikling og god egenkapital."],
                    ["Produktivitet", "Moderat", "Stabil verdiskaping per ansatt siste år."],
                    ["Fremtidsutsikter", "Moderat", "Markedet virker stabilt, men bør suppleres med lokal innsikt."],
                    ["Konkurranseevne", "Sterk", "Behov for å beholde kompetanse støtter lønnsjustering."],
                  ].map(([title, status, desc]) => (
                    <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium text-slate-900">{title}</div>
                        <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                          {status}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
                  <div className="text-sm text-slate-300">Forslag til lønnskrav</div>
                  <div className="mt-1 text-2xl font-semibold">2,5% – 4,0%</div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Basert på økonomi, produktivitet og behov for konkurransedyktige vilkår.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="hvordan" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">Hvordan det virker</h2>
              <p className="mt-4 text-lg text-slate-600">
                Løsningen kombinerer selskapsdata, regelstyrt analyse og språkstøtte for å hjelpe tillitsvalgte med å lage bedre underbygde lønnskrav.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "1. Hent data",
                  text: "Søk opp virksomheten og hent nøkkeltall fra offentlige og kommersielle kilder.",
                },
                {
                  title: "2. Vurder kriteriene",
                  text: "Systemet vurderer økonomi, produktivitet, fremtidsutsikter og konkurranseevne med sporbar logikk.",
                },
                {
                  title: "3. Lag utkast",
                  text: "AI hjelper med formulering, men alle konklusjoner bygger på dokumenterte data og regler.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="text-base font-semibold text-slate-900">{item.title}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="funksjoner" className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                "Virksomhetsoppslag og nøkkeltall",
                "Analyse av de fire kriteriene i lokale forhandlinger",
                "Forklarbar scoring med kilder og sporbarhet",
                "Redigerbart forslag til lønnskrav og begrunnelse",
                "Klart for eksport til PDF og dokumentformat senere",
                "Bygget for videre produktutvikling, ikke bare demo",
              ].map((feature) => (
                <div key={feature} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-base font-medium text-slate-900">{feature}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trygghet" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">Trygghet og transparens</h2>
                <p className="mt-4 text-lg text-slate-600">
                  Appen er laget for å styrke tillitsvalgtes arbeid, ikke erstatte vurderingene deres.
                </p>
              </div>
              <div className="grid gap-4">
                {[
                  "AI brukes til tekststøtte, ikke alene til beslutninger.",
                  "Alle vurderinger skal kunne spores tilbake til kilder og regler.",
                  "Usikkerhet i datagrunnlaget vises tydelig.",
                  "Brukeren beholder kontroll over endelig krav og formulering.",
                ].map((point) => (
                  <div key={point} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="kontakt" className="bg-slate-900">
          <div className="mx-auto max-w-7xl px-6 py-20 text-white lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Vil du teste en tidlig versjon av Lønnskrav?
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Vi bygger en løsning for tillitsvalgte som trenger raskere innsikt, bedre dokumentasjon og tydeligere begrunnelser i lokale forhandlinger.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:kontakt@lonnskrav.ai"
                  className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                >
                  Kontakt oss
                </a>
                <a
                  href="#"
                  className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-slate-500"
                >
                  Se produktvisjon
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-slate-400">
            Utviklet av{" "}
            <a href="https://github.com/filipguz" className="font-medium text-slate-200 hover:text-white" target="_blank" rel="noopener noreferrer">
              filipguz
            </a>
          </span>
          <div className="flex gap-4 text-sm text-slate-400">
            <a href="mailto:hei@filipgustavsen.no" className="hover:text-white">hei@filipgustavsen.no</a>
            <a href="https://filipgustavsen.no" className="hover:text-white" target="_blank" rel="noopener noreferrer">filipgustavsen.no</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
