package sjogang.lonnskrav.regnskap.domain;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegnskapSnapshot {

    private final String orgNumber;
    private final Integer regnskapsAar;
    private final String valuta;

    private final Double sumDriftsinntekter;
    private final Double driftsresultat;
    private final Double aarsresultat;
    private final Double sumEgenkapital;
    private final Double sumGjeld;
    private final Double sumEiendeler;

    private final boolean smaaForetak;

    public Double driftsmarginProsent() {
        if (sumDriftsinntekter == null || sumDriftsinntekter == 0 || driftsresultat == null) {
            return null;
        }
        return (driftsresultat / sumDriftsinntekter) * 100;
    }

    public Double egenkapitalprosentProsent() {
        if (sumEiendeler == null || sumEiendeler == 0 || sumEgenkapital == null) {
            return null;
        }
        return (sumEgenkapital / sumEiendeler) * 100;
    }

    public Double inntektPerAnsatt(Integer ansatte) {
        if (ansatte == null || ansatte == 0 || sumDriftsinntekter == null) {
            return null;
        }
        return sumDriftsinntekter / ansatte;
    }
}
