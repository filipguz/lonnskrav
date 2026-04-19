package sjogang.lonnskrav.datasource.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BrregCompanyResponse {

    private String organisasjonsnummer;
    private String navn;
    private int antallAnsatte;
    private boolean konkurs;
    private boolean underAvvikling;
    private boolean underTvangsavviklingEllerTvangsopplosning;
    private Naeringskode naeringskode1;
    private Organisasjonsform organisasjonsform;
    private Forretningsadresse forretningsadresse;

    public String getOrganisasjonsnummer() {
        return organisasjonsnummer;
    }

    public void setOrganisasjonsnummer(String organisasjonsnummer) {
        this.organisasjonsnummer = organisasjonsnummer;
    }

    public String getNavn() {
        return navn;
    }

    public void setNavn(String navn) {
        this.navn = navn;
    }

    public int getAntallAnsatte() {
        return antallAnsatte;
    }

    public void setAntallAnsatte(int antallAnsatte) {
        this.antallAnsatte = antallAnsatte;
    }

    public boolean isKonkurs() {
        return konkurs;
    }

    public void setKonkurs(boolean konkurs) {
        this.konkurs = konkurs;
    }

    public boolean isUnderAvvikling() {
        return underAvvikling;
    }

    public void setUnderAvvikling(boolean underAvvikling) {
        this.underAvvikling = underAvvikling;
    }

    public boolean isUnderTvangsavviklingEllerTvangsopplosning() {
        return underTvangsavviklingEllerTvangsopplosning;
    }

    public void setUnderTvangsavviklingEllerTvangsopplosning(boolean underTvangsavviklingEllerTvangsopplosning) {
        this.underTvangsavviklingEllerTvangsopplosning = underTvangsavviklingEllerTvangsopplosning;
    }

    public Naeringskode getNaeringskode1() {
        return naeringskode1;
    }

    public void setNaeringskode1(Naeringskode naeringskode1) {
        this.naeringskode1 = naeringskode1;
    }

    public Organisasjonsform getOrganisasjonsform() {
        return organisasjonsform;
    }

    public void setOrganisasjonsform(Organisasjonsform organisasjonsform) {
        this.organisasjonsform = organisasjonsform;
    }

    public Forretningsadresse getForretningsadresse() {
        return forretningsadresse;
    }

    public void setForretningsadresse(Forretningsadresse forretningsadresse) {
        this.forretningsadresse = forretningsadresse;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Naeringskode {
        private String kode;
        private String beskrivelse;

        public String getKode() {
            return kode;
        }

        public void setKode(String kode) {
            this.kode = kode;
        }

        public String getBeskrivelse() {
            return beskrivelse;
        }

        public void setBeskrivelse(String beskrivelse) {
            this.beskrivelse = beskrivelse;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Organisasjonsform {
        private String kode;
        private String beskrivelse;

        public String getKode() {
            return kode;
        }

        public void setKode(String kode) {
            this.kode = kode;
        }

        public String getBeskrivelse() {
            return beskrivelse;
        }

        public void setBeskrivelse(String beskrivelse) {
            this.beskrivelse = beskrivelse;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Forretningsadresse {
        private String land;
        private String landkode;
        private String postnummer;
        private String poststed;
        private List<String> adresse;

        public String getLand() {
            return land;
        }

        public void setLand(String land) {
            this.land = land;
        }

        public String getLandkode() {
            return landkode;
        }

        public void setLandkode(String landkode) {
            this.landkode = landkode;
        }

        public String getPostnummer() {
            return postnummer;
        }

        public void setPostnummer(String postnummer) {
            this.postnummer = postnummer;
        }

        public String getPoststed() {
            return poststed;
        }

        public void setPoststed(String poststed) {
            this.poststed = poststed;
        }

        public List<String> getAdresse() {
            return adresse;
        }

        public void setAdresse(List<String> adresse) {
            this.adresse = adresse;
        }
    }
}