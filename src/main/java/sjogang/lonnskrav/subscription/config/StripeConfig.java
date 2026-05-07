package sjogang.lonnskrav.subscription.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.stripe")
@Getter
@Setter
public class StripeConfig {
    private String secretKey = "";
    private String webhookSecret = "";
    private String priceId = "";
    private String successUrl = "https://lonnskrav.no?checkout=success";
    private String cancelUrl = "https://lonnskrav.no";
    private int freeAnalysisLimit = 3;

    public boolean isEnabled() {
        return secretKey != null && !secretKey.isBlank();
    }
}