package sjogang.lonnskrav.analysis.application;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.TextBlock;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import sjogang.lonnskrav.analysis.domain.AnalysisResult;
import sjogang.lonnskrav.company.domain.Company;
import sjogang.lonnskrav.negotiation.domain.NegotiationCase;
import sjogang.lonnskrav.regnskap.domain.RegnskapSnapshot;

import java.util.Optional;

@Service
public class AiDraftService {

    private static final Logger log = LoggerFactory.getLogger(AiDraftService.class);

    @Value("${app.ai.enabled:false}")
    private boolean enabled;

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Value("${app.ai.model:claude-haiku-4-5}")
    private String model;

    private AnthropicClient client;

    private static final String SYSTEM_PROMPT =
            "Du er ekspert på lønnsforhandlinger i norsk arbeidsliv og skriver profesjonelle utkast " +
            "til lønnskrav på vegne av tillitsvalgte i lokale forhandlinger. Utkastene skal være " +
            "faktabaserte, saklige og direkte nyttige for tillitsvalgte. Bruk norsk bokmål.";

    @PostConstruct
    public void init() {
        if (enabled && apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("DIN_")) {
            client = AnthropicOkHttpClient.builder().apiKey(apiKey).build();
            log.info("AI draft service aktivert med modell: {}", model);
        } else {
            log.info("AI draft service deaktivert – bruker regelbasert utkast");
        }
    }

    public Optional<String> generateDraft(NegotiationCase nc, Company company,
                                           Optional<RegnskapSnapshot> regnskap,
                                           AnalysisResult result) {
        if (client == null) return Optional.empty();
        try {
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(model)
                    .maxTokens(1024L)
                    .system(SYSTEM_PROMPT)
                    .addUserMessage(buildPrompt(nc, company, regnskap, result))
                    .build();

            return client.messages().create(params).content().stream()
                    .flatMap(block -> block.text().stream())
                    .map(TextBlock::text)
                    .findFirst();
        } catch (Exception e) {
            log.warn("AI-utkast feilet, faller tilbake til regelbasert: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    private String buildPrompt(NegotiationCase nc, Company company,
                                Optional<RegnskapSnapshot> regnskap, AnalysisResult result) {
        String year = nc.getNegotiationYear() != null ? nc.getNegotiationYear().toString() : "–";
        StringBuilder sb = new StringBuilder();

        sb.append("Skriv et utkast til lønnskrav for lokale forhandlinger ").append(year).append(".\n\n");
        sb.append("Selskap: ").append(company.getName())
          .append(" (org.nr. ").append(company.getOrgNumber()).append(")\n");
        if (company.getIndustryDescription() != null)
            sb.append("Bransje: ").append(company.getIndustryDescription()).append("\n");
        if (company.getEmployees() != null)
            sb.append("Ansatte: ").append(company.getEmployees()).append("\n");

        regnskap.ifPresent(r -> {
            sb.append("\nRegnskapsdata (").append(r.getRegnskapsAar() != null ? r.getRegnskapsAar() : "siste år").append("):\n");
            if (r.getSumDriftsinntekter() != null)
                sb.append("- Omsetning: ").append(formatNok(r.getSumDriftsinntekter())).append("\n");
            if (r.driftsmarginProsent() != null)
                sb.append(String.format("- Driftsmargin: %.1f%%\n", r.driftsmarginProsent()));
            if (r.egenkapitalprosentProsent() != null)
                sb.append(String.format("- Egenkapitalprosent: %.1f%%\n", r.egenkapitalprosentProsent()));
            if (r.getAarsresultat() != null)
                sb.append("- Årsresultat: ").append(formatNok(r.getAarsresultat())).append("\n");
        });

        sb.append("\nAnalyseresultat:\n");
        sb.append("- Økonomi: ").append(result.getEconomyScore()).append("/10 — ").append(result.getEconomyRationale()).append("\n");
        sb.append("- Produktivitet: ").append(result.getProductivityScore()).append("/10 — ").append(result.getProductivityRationale()).append("\n");
        sb.append("- Fremtidsutsikter: ").append(result.getOutlookScore()).append("/10 — ").append(result.getOutlookRationale()).append("\n");
        sb.append("- Konkurranseevne: ").append(result.getCompetitivenessScore()).append("/10 — ").append(result.getCompetitivenessRationale()).append("\n");
        sb.append("- Samlet anbefaling: ").append(recommendationLabel(result.getRecommendation())).append("\n");

        sb.append("\nSkriv et faglig og profesjonelt utkast (200–300 ord) som presenterer kravet på vegne av " +
                "de ansatte, begrunner det med de konkrete tallene fra analysen, og konkluderer med et krav " +
                "som samsvarer med anbefalingen.");

        return sb.toString();
    }

    private String formatNok(double value) {
        if (Math.abs(value) >= 1_000_000_000)
            return String.format("%.1f mrd kr", value / 1_000_000_000);
        if (Math.abs(value) >= 1_000_000)
            return String.format("%.1f mill kr", value / 1_000_000);
        if (Math.abs(value) >= 1_000)
            return String.format("%.0f 000 kr", value / 1_000);
        return String.format("%.0f kr", value);
    }

    private String recommendationLabel(String r) {
        return switch (r) {
            case "HIGH_INCREASE" -> "Sterkt grunnlag – høy lønnsøkning anbefales";
            case "LOW_INCREASE" -> "Svakt grunnlag – forsiktig tilnærming anbefales";
            default -> "Moderat grunnlag for lønnsøkning";
        };
    }
}
