package sjogang.lonnskrav.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class BrregConfig {

    @Bean
    public RestClient brregRestClient() {
        return RestClient.builder()
                .baseUrl("https://data.brreg.no/enhetsregisteret/api")
                .build();
    }

    @Bean
    public RestClient regnskapRestClient() {
        return RestClient.builder()
                .baseUrl("https://data.brreg.no/regnskapsregisteret")
                .build();
    }
}