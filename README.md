# Lønnskrav

Beslutningsstøtte for tillitsvalgte under lokale lønnsforhandlinger. Appen henter selskapsdata og regnskapstall fra offentlige registre, analyserer dem mot tariffens fire kriterier og genererer et redigerbart utkast til lønnskrav.

---

## Hva er bygget

- **Selskapsoppslag** via Brønnøysundregistrene (org.nr → navn, bransje, ansatte, org-form, adresse, status)
- **Regnskapsdata** via Regnskapsregisteret (siste tilgjengelige regnskap: omsetning, driftsmargin, egenkapitalprosent, årsresultat)
- **Regelbasert analyse** av de fire kriteriene i lokale forhandlinger:
  - Økonomi — basert på egenkapitalprosent og driftsmargin
  - Produktivitet — omsetning per ansatt
  - Fremtidsutsikter — årsresultat og egenkapitalstyrke
  - Konkurranseevne — omsetningsstørrelse og antall ansatte
- **Forklaringstekst** per kriterium med faktiske tall fra regnskapet
- **Autogenerert utkast** til lønnskravbrev, redigerbart i nettleseren
- **Landingsside** med produktpresentasjon

---

## Teknologi

| Lag | Valg |
|---|---|
| Backend | Java 17 · Spring Boot 3.5 · Spring Data JPA |
| Database | H2 (utvikling) · PostgreSQL (produksjon) |
| Migrering | Flyway (klar, ikke aktivert i dev) |
| Frontend | React 19 · TypeScript · Tailwind CSS 4 · Vite |
| Datakilde | Brreg Enhetsregisteret + Regnskapsregisteret (åpne API-er) |
| Deploy | Docker (multi-stage) |

---

## Komme i gang

### Backend

```bash
./mvnw spring-boot:run
```

Starter på `http://localhost:8080`. Bruker H2 (in-file) automatisk — ingen databaseoppsett nødvendig.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Starter på `http://localhost:5173`.

### Docker (full stack)

```bash
docker build -t lonnskrav .
docker run -p 8080:8080 lonnskrav
```

---

## API-oversikt

```
POST /api/cases                  Opprett forhandlingssak (henter Brreg automatisk)
GET  /api/cases                  List alle saker
GET  /api/cases/{id}             Hent én sak
GET  /api/cases/{id}/analyze     Kjør analyse (henter regnskap live)
GET  /api/company-data/{orgnr}   Hent rådata fra Brreg
```

---

## Prinsipper

- **Sporbarhet** — alle tall kobles til kilde (Brreg, Regnskapsregisteret)
- **Forklarbarhet** — regelbasert logikk, ikke black box
- **Mennesket i kontroll** — appen gir forslag, tillitsvalgte tar beslutningene
- **Domene først** — analyse basert på regler, AI kan legges på etterpå

---

## Veikart

- [ ] Innlogging og brukerhåndtering (multi-tenancy)
- [ ] AI-assistert tekstgenerering (begrunnelsestekst)
- [ ] PDF-eksport av lønnskravbrev
- [ ] PostgreSQL + Flyway i produksjon
- [ ] Historiske regnskapsdata (år-over-år-sammenligning)
- [ ] Bransjesammenligning

---

## Lisens

TBD