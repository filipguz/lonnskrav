package sjogang.lonnskrav.regnskap.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import sjogang.lonnskrav.regnskap.application.RegnskapDataProvider;
import sjogang.lonnskrav.regnskap.domain.RegnskapSnapshot;
import sjogang.lonnskrav.regnskap.dto.BrregRegnskapResponse;

import java.util.List;
import java.util.Optional;

@Component
@Slf4j
public class BrregRegnskapDataProvider implements RegnskapDataProvider {

    private final RestClient regnskapRestClient;

    public BrregRegnskapDataProvider(RestClient regnskapRestClient) {
        this.regnskapRestClient = regnskapRestClient;
    }

    @Override
    public Optional<RegnskapSnapshot> fetchLatest(String orgNumber) {
        try {
            List<BrregRegnskapResponse> results = regnskapRestClient.get()
                    .uri("/regnskap/{orgnr}", orgNumber)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});

            if (results == null || results.isEmpty()) {
                log.info("Ingen regnskapsdata funnet for {}", orgNumber);
                return Optional.empty();
            }

            return Optional.of(toSnapshot(orgNumber, results.get(0)));

        } catch (Exception e) {
            log.warn("Kunne ikke hente regnskapsdata for {}: {}", orgNumber, e.getMessage());
            return Optional.empty();
        }
    }

    private RegnskapSnapshot toSnapshot(String orgNumber, BrregRegnskapResponse r) {
        Integer year = parseYear(r.getRegnskapsperiode());

        Double sumDriftsinntekter = null;
        Double driftsresultat = null;

        if (r.getResultatregnskapResultat() != null) {
            var res = r.getResultatregnskapResultat();
            if (res.getDriftsresultat() != null) {
                driftsresultat = res.getDriftsresultat().getDriftsresultat();
                if (res.getDriftsresultat().getDriftsinntekter() != null) {
                    sumDriftsinntekter = res.getDriftsresultat().getDriftsinntekter().getSumDriftsinntekter();
                }
            }
        }

        Double aarsresultat = r.getResultatregnskapResultat() != null
                ? r.getResultatregnskapResultat().getAarsresultat()
                : null;

        Double sumEgenkapital = null;
        Double sumGjeld = null;
        if (r.getEgenkapitalGjeld() != null) {
            if (r.getEgenkapitalGjeld().getEgenkapital() != null) {
                sumEgenkapital = r.getEgenkapitalGjeld().getEgenkapital().getSumEgenkapital();
            }
            if (r.getEgenkapitalGjeld().getGjeldOversikt() != null) {
                sumGjeld = r.getEgenkapitalGjeld().getGjeldOversikt().getSumGjeld();
            }
        }

        Double sumEiendeler = r.getEiendeler() != null ? r.getEiendeler().getSumEiendeler() : null;
        boolean smaaForetak = r.getRegnkapsprinsipper() != null && r.getRegnkapsprinsipper().isSmaaForetak();

        return RegnskapSnapshot.builder()
                .orgNumber(orgNumber)
                .regnskapsAar(year)
                .valuta(r.getValuta())
                .sumDriftsinntekter(sumDriftsinntekter)
                .driftsresultat(driftsresultat)
                .aarsresultat(aarsresultat)
                .sumEgenkapital(sumEgenkapital)
                .sumGjeld(sumGjeld)
                .sumEiendeler(sumEiendeler)
                .smaaForetak(smaaForetak)
                .build();
    }

    private Integer parseYear(BrregRegnskapResponse.Regnskapsperiode periode) {
        if (periode == null || periode.getTilDato() == null) return null;
        try {
            return Integer.parseInt(periode.getTilDato().substring(0, 4));
        } catch (Exception e) {
            return null;
        }
    }
}