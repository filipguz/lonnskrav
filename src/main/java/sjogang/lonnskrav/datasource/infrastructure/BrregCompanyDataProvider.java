package sjogang.lonnskrav.datasource.infrastructure;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import sjogang.lonnskrav.datasource.application.CompanyDataProvider;
import sjogang.lonnskrav.datasource.domain.CompanySnapshot;
import sjogang.lonnskrav.datasource.dto.BrregCompanyResponse;

import java.util.StringJoiner;

@Component
public class BrregCompanyDataProvider implements CompanyDataProvider {

    private final RestClient brregRestClient;

    public BrregCompanyDataProvider(RestClient brregRestClient) {
        this.brregRestClient = brregRestClient;
    }

    @Override
    public CompanySnapshot fetchByOrgNumber(String orgNumber) {
        validateOrgNumber(orgNumber);

        BrregCompanyResponse response = brregRestClient.get()
                .uri("/enheter/{orgnr}", orgNumber)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, apiResponse) -> {
                    throw new ResponseStatusException(
                            org.springframework.http.HttpStatus.NOT_FOUND,
                            "Fant ikke virksomhet for organisasjonsnummer: " + orgNumber
                    );
                })
                .body(BrregCompanyResponse.class);

        if (response == null) {
            throw new ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND,
                    "Fant ikke virksomhet for organisasjonsnummer: " + orgNumber
            );
        }

        CompanySnapshot snapshot = new CompanySnapshot();
        snapshot.setOrgNumber(response.getOrganisasjonsnummer());
        snapshot.setCompanyName(response.getNavn());
        snapshot.setEmployees(response.getAntallAnsatte());
        snapshot.setBankrupt(response.isKonkurs());
        snapshot.setUnderLiquidation(
                response.isUnderAvvikling() || response.isUnderTvangsavviklingEllerTvangsopplosning()
        );

        if (response.getNaeringskode1() != null) {
            snapshot.setIndustryCode(response.getNaeringskode1().getKode());
            snapshot.setIndustryDescription(response.getNaeringskode1().getBeskrivelse());
        }

        if (response.getOrganisasjonsform() != null) {
            snapshot.setOrganizationFormCode(response.getOrganisasjonsform().getKode());
            snapshot.setOrganizationFormDescription(response.getOrganisasjonsform().getBeskrivelse());
        }

        if (response.getForretningsadresse() != null) {
            StringJoiner joiner = new StringJoiner(", ");

            if (response.getForretningsadresse().getAdresse() != null) {
                response.getForretningsadresse().getAdresse().forEach(joiner::add);
            }
            if (response.getForretningsadresse().getPostnummer() != null) {
                joiner.add(response.getForretningsadresse().getPostnummer());
            }
            if (response.getForretningsadresse().getPoststed() != null) {
                joiner.add(response.getForretningsadresse().getPoststed());
            }

            snapshot.setBusinessAddress(joiner.toString());
        }

        return snapshot;
    }

    private void validateOrgNumber(String orgNumber) {
        if (orgNumber == null || !orgNumber.matches("\\d{9}")) {
            throw new ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Organisasjonsnummer må bestå av 9 siffer"
            );
        }
    }
}