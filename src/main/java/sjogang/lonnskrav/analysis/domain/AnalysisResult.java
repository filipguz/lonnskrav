package sjogang.lonnskrav.analysis.domain;

public class AnalysisResult {

    private int economyScore;
    private int productivityScore;
    private int outlookScore;
    private int competitivenessScore;
    private String recommendation;

    public AnalysisResult() {
    }

    public AnalysisResult(int economyScore, int productivityScore, int outlookScore, int competitivenessScore, String recommendation) {
        this.economyScore = economyScore;
        this.productivityScore = productivityScore;
        this.outlookScore = outlookScore;
        this.competitivenessScore = competitivenessScore;
        this.recommendation = recommendation;
    }

    public int getEconomyScore() {
        return economyScore;
    }

    public void setEconomyScore(int economyScore) {
        this.economyScore = economyScore;
    }

    public int getProductivityScore() {
        return productivityScore;
    }

    public void setProductivityScore(int productivityScore) {
        this.productivityScore = productivityScore;
    }

    public int getOutlookScore() {
        return outlookScore;
    }

    public void setOutlookScore(int outlookScore) {
        this.outlookScore = outlookScore;
    }

    public int getCompetitivenessScore() {
        return competitivenessScore;
    }

    public void setCompetitivenessScore(int competitivenessScore) {
        this.competitivenessScore = competitivenessScore;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}