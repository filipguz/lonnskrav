package sjogang.lonnskrav.analysis.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalysisResult {

    private int economyScore;
    private int productivityScore;
    private int outlookScore;
    private int competitivenessScore;
    private String recommendation;

    private String economyRationale;
    private String productivityRationale;
    private String outlookRationale;
    private String competitivenessRationale;

    private boolean hasRegnskapData;
    private Integer regnskapYear;
    private String valuta;

    private String draftText;

    public AnalysisResult() {
    }

    public AnalysisResult(
            int economyScore, int productivityScore,
            int outlookScore, int competitivenessScore,
            String recommendation) {
        this.economyScore = economyScore;
        this.productivityScore = productivityScore;
        this.outlookScore = outlookScore;
        this.competitivenessScore = competitivenessScore;
        this.recommendation = recommendation;
    }
}
