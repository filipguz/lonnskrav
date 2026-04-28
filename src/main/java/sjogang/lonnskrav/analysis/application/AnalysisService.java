package sjogang.lonnskrav.analysis.application;

import org.springframework.stereotype.Service;
import sjogang.lonnskrav.analysis.domain.AnalysisResult;
import sjogang.lonnskrav.company.domain.Company;
import sjogang.lonnskrav.negotiation.domain.NegotiationCase;
import sjogang.lonnskrav.regnskap.domain.RegnskapSnapshot;

import java.util.Optional;

@Service
public class AnalysisService {

    public AnalysisResult analyze(NegotiationCase negotiationCase, Optional<RegnskapSnapshot> regnskap) {
        Company company = negotiationCase.getCompany();

        if (company == null) {
            return fallback("Ingen selskapsdata tilgjengelig.", negotiationCase);
        }

        if (Boolean.TRUE.equals(company.getBankrupt())) {
            return criticalResult(1, "Selskapet er registrert som konkurs.", negotiationCase);
        }

        if (Boolean.TRUE.equals(company.getUnderLiquidation())) {
            return criticalResult(2, "Selskapet er under avvikling eller tvangsoppløsning.", negotiationCase);
        }

        if (regnskap.isPresent()) {
            return analyzeWithRegnskap(negotiationCase, company, regnskap.get());
        }

        return analyzeOrgOnly(negotiationCase, company);
    }

    private AnalysisResult analyzeWithRegnskap(NegotiationCase nc, Company company, RegnskapSnapshot r) {
        // --- Økonomi ---
        int economyScore = 5;
        StringBuilder economyText = new StringBuilder();

        Double ekProsent = r.egenkapitalprosentProsent();
        Double driftsmargin = r.driftsmarginProsent();

        if (ekProsent != null) {
            if (ekProsent >= 40) { economyScore += 3; }
            else if (ekProsent >= 25) { economyScore += 2; }
            else if (ekProsent >= 10) { economyScore += 1; }
            else if (ekProsent < 0)   { economyScore -= 2; }
            economyText.append(String.format("Egenkapitalprosent: %.1f %%.", ekProsent));
        }

        if (driftsmargin != null) {
            if (driftsmargin >= 15)     { economyScore += 2; }
            else if (driftsmargin >= 8) { economyScore += 1; }
            else if (driftsmargin < 0)  { economyScore -= 2; }
            economyText.append(String.format(" Driftsmargin: %.1f %%.", driftsmargin));
        }

        if (r.getSumDriftsinntekter() != null) {
            economyText.append(String.format(" Omsetning: %s.", formatNok(r.getSumDriftsinntekter(), r.getValuta())));
        }

        if (economyText.isEmpty()) {
            economyText.append("Regnskapsdata foreligger, men nøkkeltall mangler.");
        }

        // --- Produktivitet ---
        int productivityScore = 5;
        StringBuilder productivityText = new StringBuilder();

        Double inntektPerAnsatt = r.inntektPerAnsatt(company.getEmployees());
        if (inntektPerAnsatt != null) {
            if (inntektPerAnsatt >= 5_000_000)      { productivityScore += 3; }
            else if (inntektPerAnsatt >= 2_000_000) { productivityScore += 2; }
            else if (inntektPerAnsatt >= 1_000_000) { productivityScore += 1; }
            else if (inntektPerAnsatt < 500_000)    { productivityScore -= 1; }
            productivityText.append(String.format("Omsetning per ansatt: %s.",
                    formatNok(inntektPerAnsatt, r.getValuta())));
        } else if (company.getEmployees() != null && company.getEmployees() > 0) {
            productivityText.append(String.format("%d ansatte registrert.", company.getEmployees()));
        } else {
            productivityText.append("Ansattedata ikke tilgjengelig for beregning.");
        }

        // Legg til størrelsesbasert justering
        if (company.getEmployees() != null) {
            int emp = company.getEmployees();
            if (emp >= 200)      { productivityScore += 1; }
            else if (emp >= 50)  { productivityScore += 0; }
            else if (emp == 0)   { productivityScore -= 1; }
        }

        // --- Fremtidsutsikter ---
        int outlookScore = 5;
        StringBuilder outlookText = new StringBuilder();

        if (r.getAarsresultat() != null) {
            if (r.getAarsresultat() > 0) {
                outlookScore += 1;
                outlookText.append(String.format("Positivt årsresultat: %s.", formatNok(r.getAarsresultat(), r.getValuta())));
            } else {
                outlookScore -= 2;
                outlookText.append(String.format("Negativt årsresultat: %s.", formatNok(r.getAarsresultat(), r.getValuta())));
            }
        }

        if (ekProsent != null) {
            if (ekProsent >= 20)    { outlookScore += 2; outlookText.append(" God egenkapitalandel gir finansiell stabilitet."); }
            else if (ekProsent >= 0){ outlookScore += 1; }
            else                    { outlookScore -= 2; outlookText.append(" Negativ egenkapital er en risikofaktor."); }
        }

        if (outlookText.isEmpty()) {
            outlookText.append("Fremtidsutsikter vurdert basert på tilgjengelige nøkkeltall.");
        }

        // --- Konkurranseevne ---
        int competitivenessScore = 5;
        StringBuilder compText = new StringBuilder();

        if (r.getSumDriftsinntekter() != null) {
            double rev = r.getSumDriftsinntekter();
            if (rev >= 1_000_000_000)    { competitivenessScore += 3; }
            else if (rev >= 100_000_000) { competitivenessScore += 2; }
            else if (rev >= 50_000_000)  { competitivenessScore += 1; }
            else if (rev < 10_000_000)   { competitivenessScore -= 1; }
            compText.append(String.format("Omsetning %s.", formatNok(rev, r.getValuta())));
        }

        if (company.getEmployees() != null) {
            int emp = company.getEmployees();
            if (emp >= 200)     { competitivenessScore += 2; }
            else if (emp >= 50) { competitivenessScore += 1; }
            else if (emp == 0)  { competitivenessScore -= 1; }
            compText.append(String.format(" %d ansatte.", emp));
        }

        // Bransjejusteringer
        applyIndustryAdjustments(company.getIndustryDescription(), new int[]{}, new int[]{competitivenessScore});

        economyScore = clamp(economyScore);
        productivityScore = clamp(productivityScore);
        outlookScore = clamp(outlookScore);
        competitivenessScore = clamp(competitivenessScore);

        String recommendation = determineRecommendation(economyScore, productivityScore, outlookScore, competitivenessScore);

        AnalysisResult result = new AnalysisResult(economyScore, productivityScore, outlookScore, competitivenessScore, recommendation);
        result.setHasRegnskapData(true);
        result.setRegnskapYear(r.getRegnskapsAar());
        result.setValuta(r.getValuta());
        result.setEconomyRationale(economyText.toString());
        result.setProductivityRationale(productivityText.toString());
        result.setOutlookRationale(outlookText.toString());
        result.setCompetitivenessRationale(compText.toString());
        result.setDraftText(buildDraft(nc, company, r, result));
        return result;
    }

    private AnalysisResult analyzeOrgOnly(NegotiationCase nc, Company company) {
        int economyScore = 5;
        int productivityScore = 5;
        int outlookScore = 5;
        int competitivenessScore = 5;

        if ("ENK".equalsIgnoreCase(company.getOrganizationFormCode())) {
            economyScore -= 1;
            outlookScore -= 1;
        }

        Integer employees = company.getEmployees();
        if (employees != null) {
            if (employees == 0)       { productivityScore -= 1; competitivenessScore -= 1; }
            else if (employees <= 50) { productivityScore += 1; competitivenessScore += 1; }
            else if (employees <= 200){ productivityScore += 2; competitivenessScore += 2; }
            else                      { productivityScore += 2; competitivenessScore += 3; }
        }

        String industry = company.getIndustryDescription();
        if (industry != null) {
            String n = industry.toLowerCase();
            if (n.contains("undervisning") || n.contains("rekreasjon") || n.contains("idrett")) outlookScore += 1;
            if (n.contains("konsulent") || n.contains("teknologi") || n.contains("utvikling")) competitivenessScore += 1;
            if (n.contains("transport") || n.contains("servering") || n.contains("detaljhandel")) economyScore -= 1;
        }

        economyScore = clamp(economyScore);
        productivityScore = clamp(productivityScore);
        outlookScore = clamp(outlookScore);
        competitivenessScore = clamp(competitivenessScore);

        String recommendation = determineRecommendation(economyScore, productivityScore, outlookScore, competitivenessScore);

        AnalysisResult result = new AnalysisResult(economyScore, productivityScore, outlookScore, competitivenessScore, recommendation);
        result.setHasRegnskapData(false);
        result.setEconomyRationale("Regnskapsdata ikke tilgjengelig. Vurdering basert på organisasjonsdata.");
        result.setProductivityRationale(employees != null ? employees + " ansatte registrert." : "Ansattedata ikke tilgjengelig.");
        result.setOutlookRationale("Fremtidsutsikter vurdert ut fra bransje og organisasjonsform.");
        result.setCompetitivenessRationale(industry != null ? "Bransje: " + industry + "." : "Bransjedata ikke tilgjengelig.");
        result.setDraftText(buildDraftOrgOnly(nc, company, result));
        return result;
    }

    private AnalysisResult criticalResult(int baseScore, String reason, NegotiationCase nc) {
        AnalysisResult result = new AnalysisResult(baseScore, baseScore + 1, baseScore, baseScore, "LOW_INCREASE");
        result.setHasRegnskapData(false);
        result.setEconomyRationale(reason);
        result.setProductivityRationale(reason);
        result.setOutlookRationale(reason);
        result.setCompetitivenessRationale(reason);
        result.setDraftText("ADVARSEL: " + reason + "\n\nEt lønnskrav bør vurderes svært forsiktig i denne situasjonen.");
        return result;
    }

    private AnalysisResult fallback(String reason, NegotiationCase nc) {
        AnalysisResult result = new AnalysisResult(5, 5, 5, 5, "MODERATE_INCREASE");
        result.setHasRegnskapData(false);
        result.setEconomyRationale(reason);
        result.setProductivityRationale(reason);
        result.setOutlookRationale(reason);
        result.setCompetitivenessRationale(reason);
        result.setDraftText("Utilstrekkelig datagrunnlag for å generere utkast.");
        return result;
    }

    private String buildDraft(NegotiationCase nc, Company company, RegnskapSnapshot r, AnalysisResult res) {
        String year = nc.getNegotiationYear() != null ? nc.getNegotiationYear().toString() : "–";
        String regAar = r.getRegnskapsAar() != null ? r.getRegnskapsAar().toString() : "siste år";
        String anbefaling = recommendationLabel(res.getRecommendation());

        return String.format("""
                Forslag til lønnskrav – Lokale forhandlinger %s
                Selskap: %s (org.nr. %s)

                Vurdering av kriteriene (basert på regnskap for %s)

                Økonomi (%d/10)
                %s

                Produktivitet (%d/10)
                %s

                Fremtidsutsikter (%d/10)
                %s

                Konkurranseevne (%d/10)
                %s

                Anbefaling: %s
                Basert på en samlet vurdering av selskapets økonomi, produktivitet, fremtidsutsikter og konkurranseevne \
                tilsier datagrunnlaget %s. Utkastet bør suppleres med lokal innsikt, lønnsstatistikk og prioriteringer \
                fra forhandlingsutvalget.""",
                year, company.getName(), company.getOrgNumber(), regAar,
                res.getEconomyScore(), res.getEconomyRationale(),
                res.getProductivityScore(), res.getProductivityRationale(),
                res.getOutlookScore(), res.getOutlookRationale(),
                res.getCompetitivenessScore(), res.getCompetitivenessRationale(),
                anbefaling, anbefaling.toLowerCase());
    }

    private String buildDraftOrgOnly(NegotiationCase nc, Company company, AnalysisResult res) {
        String year = nc.getNegotiationYear() != null ? nc.getNegotiationYear().toString() : "–";
        String anbefaling = recommendationLabel(res.getRecommendation());

        return String.format("""
                Forslag til lønnskrav – Lokale forhandlinger %s
                Selskap: %s (org.nr. %s)

                Merk: Regnskapsdata ikke tilgjengelig – vurderingen er basert på registreringsdata fra Brønnøysundregistrene.

                Økonomi (%d/10): %s
                Produktivitet (%d/10): %s
                Fremtidsutsikter (%d/10): %s
                Konkurranseevne (%d/10): %s

                Anbefaling: %s
                Utkastet bør suppleres med lokal innsikt og faktiske regnskapstall.""",
                year, company.getName(), company.getOrgNumber(),
                res.getEconomyScore(), res.getEconomyRationale(),
                res.getProductivityScore(), res.getProductivityRationale(),
                res.getOutlookScore(), res.getOutlookRationale(),
                res.getCompetitivenessScore(), res.getCompetitivenessRationale(),
                anbefaling);
    }

    private void applyIndustryAdjustments(String industry, int[] economy, int[] competitiveness) {
        // no-op overload used for future extension
    }

    private String formatNok(double value, String valuta) {
        String currency = valuta != null ? valuta : "NOK";
        if (Math.abs(value) >= 1_000_000_000) {
            return String.format("%.1f mrd %s", value / 1_000_000_000, currency);
        } else if (Math.abs(value) >= 1_000_000) {
            return String.format("%.1f MNOK", value / 1_000_000).replace("MNOK", "M" + currency);
        } else if (Math.abs(value) >= 1_000) {
            return String.format("%.0f k%s", value / 1_000, currency);
        }
        return String.format("%.0f %s", value, currency);
    }

    private String recommendationLabel(String recommendation) {
        return switch (recommendation) {
            case "HIGH_INCREASE" -> "sterkt grunnlag for høyere lønnskrav";
            case "LOW_INCREASE" -> "forsiktig tilnærming til lønnskrav";
            default -> "moderat grunnlag for lønnskrav";
        };
    }

    private int clamp(int value) {
        return Math.max(1, Math.min(10, value));
    }

    private String determineRecommendation(int economy, int productivity, int outlook, int competitiveness) {
        double average = (economy + productivity + outlook + competitiveness) / 4.0;
        if (average >= 7.5) return "HIGH_INCREASE";
        if (average >= 5.0) return "MODERATE_INCREASE";
        return "LOW_INCREASE";
    }
}
