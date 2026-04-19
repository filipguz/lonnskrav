package sjogang.lonnskrav.analysis.application;

import org.springframework.stereotype.Service;
import sjogang.lonnskrav.analysis.domain.AnalysisResult;
import sjogang.lonnskrav.company.domain.Company;
import sjogang.lonnskrav.negotiation.domain.NegotiationCase;

@Service
public class AnalysisService {

    public AnalysisResult analyze(NegotiationCase negotiationCase) {
        Company company = negotiationCase.getCompany();

        int economyScore = 5;
        int productivityScore = 5;
        int outlookScore = 5;
        int competitivenessScore = 5;

        if (company == null) {
            return new AnalysisResult(
                    economyScore,
                    productivityScore,
                    outlookScore,
                    competitivenessScore,
                    "MODERATE_INCREASE"
            );
        }

        // 1. Kritiske forhold først
        if (Boolean.TRUE.equals(company.getBankrupt())) {
            economyScore = 1;
            outlookScore = 1;
            competitivenessScore = 1;
            productivityScore = 2;

            return new AnalysisResult(
                    economyScore,
                    productivityScore,
                    outlookScore,
                    competitivenessScore,
                    "LOW_INCREASE"
            );
        }

        if (Boolean.TRUE.equals(company.getUnderLiquidation())) {
            economyScore = 2;
            outlookScore = 2;
            competitivenessScore = 2;
            productivityScore = 3;

            return new AnalysisResult(
                    economyScore,
                    productivityScore,
                    outlookScore,
                    competitivenessScore,
                    "LOW_INCREASE"
            );
        }

        // 2. Organisasjonsform
        if ("ENK".equalsIgnoreCase(company.getOrganizationFormCode())) {
            // Enkeltpersonforetak tolkes mer forsiktig
            economyScore -= 1;
            outlookScore -= 1;
        }

        // 3. Antall ansatte
        Integer employees = company.getEmployees();

        if (employees != null) {
            if (employees == 0) {
                productivityScore -= 1;
                competitivenessScore -= 1;
            } else if (employees >= 1 && employees <= 10) {
                productivityScore += 0;
                competitivenessScore += 0;
            } else if (employees <= 50) {
                productivityScore += 1;
                competitivenessScore += 1;
            } else if (employees <= 200) {
                productivityScore += 2;
                competitivenessScore += 2;
            } else {
                productivityScore += 2;
                competitivenessScore += 3;
            }
        }

        // 4. Bransjebasert enkel vurdering
        String industry = company.getIndustryDescription();

        if (industry != null) {
            String normalized = industry.toLowerCase();

            if (normalized.contains("undervisning")
                    || normalized.contains("rekreasjon")
                    || normalized.contains("idrett")) {
                outlookScore += 1;
            }

            if (normalized.contains("konsulent")
                    || normalized.contains("teknologi")
                    || normalized.contains("utvikling")) {
                competitivenessScore += 1;
            }

            if (normalized.contains("transport")
                    || normalized.contains("servering")
                    || normalized.contains("detaljhandel")) {
                economyScore -= 1;
            }
        }

        // 5. Hold score innenfor 1–10
        economyScore = clamp(economyScore);
        productivityScore = clamp(productivityScore);
        outlookScore = clamp(outlookScore);
        competitivenessScore = clamp(competitivenessScore);

        String recommendation = determineRecommendation(
                economyScore,
                productivityScore,
                outlookScore,
                competitivenessScore
        );

        return new AnalysisResult(
                economyScore,
                productivityScore,
                outlookScore,
                competitivenessScore,
                recommendation
        );
    }

    private int clamp(int value) {
        return Math.max(1, Math.min(10, value));
    }

    private String determineRecommendation(
            int economyScore,
            int productivityScore,
            int outlookScore,
            int competitivenessScore
    ) {
        double average = (economyScore + productivityScore + outlookScore + competitivenessScore) / 4.0;

        if (average >= 7.5) {
            return "HIGH_INCREASE";
        }
        if (average >= 5.0) {
            return "MODERATE_INCREASE";
        }
        return "LOW_INCREASE";
    }
}