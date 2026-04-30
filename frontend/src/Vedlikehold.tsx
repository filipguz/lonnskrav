export default function Vedlikehold() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/favicon.svg" alt="Lønnskrav" className="h-10 w-10" />
          <span className="text-2xl font-bold text-slate-900">Lønnskrav</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-10">
          <div className="text-4xl mb-4">🔧</div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Vi er straks tilbake
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Siden er midlertidig nede for vedlikehold.
            Vi jobber med å få alt opp og kjøre så fort som mulig.
          </p>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          Spørsmål?{" "}
          <a
            href="mailto:hei@filipgustavsen.no"
            className="text-slate-600 hover:text-slate-900 underline underline-offset-2"
          >
            hei@filipgustavsen.no
          </a>
        </p>
      </div>
    </div>
  );
}
