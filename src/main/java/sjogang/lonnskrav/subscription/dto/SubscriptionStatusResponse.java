package sjogang.lonnskrav.subscription.dto;

public record SubscriptionStatusResponse(
        String plan,
        int analysesUsed,
        int freeLimit,
        boolean canRunAnalysis
) {}
