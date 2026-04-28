package sjogang.lonnskrav.regnskap.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class BrregRegnskapResponse {

    private Long id;
    private String valuta;
    private String oppstillingsplan;
    private Virksomhet virksomhet;
    private Regnskapsperiode regnskapsperiode;
    private Regnkapsprinsipper regnkapsprinsipper;
    private EgenkapitalGjeld egenkapitalGjeld;
    private Eiendeler eiendeler;
    private ResultatregnskapResultat resultatregnskapResultat;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Getter
    @Setter
    public static class Virksomhet {
        private String organisasjonsnummer;
        private String organisasjonsform;
        private boolean morselskap;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Getter
    @Setter
    public static class Regnskapsperiode {
        private String fraDato;
        private String tilDato;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Getter
    @Setter
    public static class Regnkapsprinsipper {
        private boolean smaaForetak;
        private String regnskapsregler;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Getter
    @Setter
    public static class EgenkapitalGjeld {
        private Double sumEgenkapitalGjeld;
        private Egenkapital egenkapital;
        private GjeldOversikt gjeldOversikt;

        @JsonIgnoreProperties(ignoreUnknown = true)
        @Getter
        @Setter
        public static class Egenkapital {
            private Double sumEgenkapital;
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        @Getter
        @Setter
        public static class GjeldOversikt {
            private Double sumGjeld;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Getter
    @Setter
    public static class Eiendeler {
        private Double sumEiendeler;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Getter
    @Setter
    public static class ResultatregnskapResultat {
        private Double aarsresultat;
        private Double totalresultat;
        private Driftsresultat driftsresultat;

        @JsonIgnoreProperties(ignoreUnknown = true)
        @Getter
        @Setter
        public static class Driftsresultat {
            private Double driftsresultat;
            private Driftsinntekter driftsinntekter;
            private Driftskostnad driftskostnad;

            @JsonIgnoreProperties(ignoreUnknown = true)
            @Getter
            @Setter
            public static class Driftsinntekter {
                private Double sumDriftsinntekter;
            }

            @JsonIgnoreProperties(ignoreUnknown = true)
            @Getter
            @Setter
            public static class Driftskostnad {
                private Double sumDriftskostnad;
            }
        }
    }
}
