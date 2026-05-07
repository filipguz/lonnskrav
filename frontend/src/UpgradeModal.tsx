import { useState } from "react";
import { Button } from "./components/ui";

type Props = {
  onClose: () => void;
  apiBase: string;
  getToken: () => Promise<string | null>;
};

export function UpgradeModal({ onClose, apiBase, getToken }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(`${apiBase}/api/subscription/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}?checkout=success`,
          cancelUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error("Kunne ikke starte betaling. Prøv igjen.");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
            <span>⚡</span> Gratiskvoten er brukt opp
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Oppgrader til Pro</h2>
          <p className="text-sm text-slate-500">Ubegrenset tilgang til alle funksjoner.</p>
        </div>

        <ul className="bg-slate-50 rounded-xl p-5 mb-6 space-y-3">
          {[
            "Ubegrenset antall analyser",
            "AI-genererte lønnskravutkast",
            "PDF-eksport",
            "Ubegrenset antall saker",
          ].map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-sm text-slate-700">
              <span className="text-emerald-600 font-bold">✓</span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mb-6 text-center">
          <span className="text-3xl font-bold text-slate-900">499 kr</span>
          <span className="text-slate-400 text-sm"> /år</span>
          <p className="text-xs text-slate-400 mt-1">Fornyes automatisk · Avslutt når som helst</p>
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex gap-3">
          <Button variant="primary" onClick={startCheckout} loading={loading} className="flex-1">
            Oppgrader nå
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
        </div>
      </div>
    </div>
  );
}
