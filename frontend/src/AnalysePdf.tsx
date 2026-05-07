import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type Company = {
  orgNumber: string;
  name: string;
  industryCode?: string;
  industryDescription?: string;
  organizationFormCode?: string;
  organizationFormDescription?: string;
  employees?: number;
  bankrupt?: boolean;
  underLiquidation?: boolean;
  businessAddress?: string;
};

type NegotiationCase = {
  id: number;
  title: string;
  negotiationYear: number;
  status: string;
  company?: Company;
};

type AnalysisResult = {
  economyScore: number;
  productivityScore: number;
  outlookScore: number;
  competitivenessScore: number;
  recommendation: string;
  economyRationale?: string;
  productivityRationale?: string;
  outlookRationale?: string;
  competitivenessRationale?: string;
  hasRegnskapData: boolean;
  regnskapYear?: number;
  draftText?: string;
};

function recommendationLabel(value: string) {
  switch (value) {
    case "HIGH_INCREASE": return "Sterkt grunnlag for høyere krav";
    case "MODERATE_INCREASE": return "Moderat grunnlag for lønnskrav";
    case "LOW_INCREASE": return "Forsiktig krav anbefales";
    default: return value;
  }
}

function scoreLabel(score: number) {
  if (score >= 8) return "Sterk";
  if (score >= 6) return "Moderat";
  return "Svak";
}

const colors = {
  dark: "#0f172a",
  medium: "#475569",
  light: "#94a3b8",
  border: "#e2e8f0",
  bg: "#f8fafc",
  emerald: "#059669",
  amber: "#d97706",
  slate: "#64748b",
  white: "#ffffff",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.dark,
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 44,
    lineHeight: 1.5,
  },

  // Header
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: colors.dark,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.medium,
    marginTop: 2,
  },
  headerDate: {
    fontSize: 8,
    color: colors.light,
    textAlign: "right",
  },

  // Sections
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.dark,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Company info grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  infoTile: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 7,
    width: "48%",
  },
  infoLabel: {
    fontSize: 7,
    color: colors.light,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 9,
    color: colors.dark,
    fontFamily: "Helvetica-Bold",
  },
  infoSub: {
    fontSize: 8,
    color: colors.medium,
    marginTop: 1,
  },

  // Recommendation banner
  banner: {
    backgroundColor: colors.dark,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  bannerLabel: {
    fontSize: 7,
    color: colors.light,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  bannerTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
  },
  bannerScore: {
    fontSize: 8,
    color: colors.light,
    marginTop: 3,
  },
  bannerScoreVal: {
    color: colors.white,
    fontFamily: "Helvetica-Bold",
  },

  // Criteria rows
  criteriaRow: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    borderRadius: 4,
    padding: 9,
    marginBottom: 5,
  },
  criteriaTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  criteriaLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.dark,
  },
  criteriaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
  },
  scoreText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.dark,
  },
  rationale: {
    fontSize: 8,
    color: colors.medium,
    lineHeight: 1.5,
  },

  // Draft
  draftBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 12,
    backgroundColor: colors.white,
  },
  draftText: {
    fontSize: 9,
    color: colors.dark,
    lineHeight: 1.7,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: colors.light,
  },
});

function badgeColor(score: number) {
  if (score >= 8) return colors.emerald;
  if (score >= 6) return colors.amber;
  return colors.slate;
}

type Props = {
  negotiationCase: NegotiationCase;
  analysis: AnalysisResult;
  draftText: string;
  averageScore: string;
};

export function AnalysePdf({ negotiationCase, analysis, draftText, averageScore }: Props) {
  const company = negotiationCase.company;
  const today = new Date().toLocaleDateString("nb-NO", { day: "2-digit", month: "long", year: "numeric" });

  const criteria = [
    { label: "Okonomi", score: analysis.economyScore, rationale: analysis.economyRationale },
    { label: "Produktivitet", score: analysis.productivityScore, rationale: analysis.productivityRationale },
    { label: "Fremtidsutsikter", score: analysis.outlookScore, rationale: analysis.outlookRationale },
    { label: "Konkurranseevne", score: analysis.competitivenessScore, rationale: analysis.competitivenessRationale },
  ];

  return (
    <Document title={`Lonnkrav – ${company?.name ?? "Analyse"} ${negotiationCase.negotiationYear}`}>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>Lonnskrav</Text>
            <Text style={s.headerSubtitle}>
              {negotiationCase.title} – {negotiationCase.negotiationYear}
            </Text>
          </View>
          <View>
            <Text style={s.headerDate}>Eksportert {today}</Text>
            {analysis.hasRegnskapData && analysis.regnskapYear && (
              <Text style={[s.headerDate, { marginTop: 2 }]}>Regnskap {analysis.regnskapYear}</Text>
            )}
          </View>
        </View>

        {/* Selskap */}
        {company && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Selskap</Text>
            <View style={s.infoGrid}>
              <View style={s.infoTile}>
                <Text style={s.infoLabel}>Navn</Text>
                <Text style={s.infoValue}>{company.name}</Text>
              </View>
              <View style={s.infoTile}>
                <Text style={s.infoLabel}>Org.nr.</Text>
                <Text style={s.infoValue}>{company.orgNumber}</Text>
              </View>
              {company.organizationFormCode && (
                <View style={s.infoTile}>
                  <Text style={s.infoLabel}>Selskapsform</Text>
                  <Text style={s.infoValue}>{company.organizationFormCode}</Text>
                  {company.organizationFormDescription && (
                    <Text style={s.infoSub}>{company.organizationFormDescription}</Text>
                  )}
                </View>
              )}
              {company.employees != null && (
                <View style={s.infoTile}>
                  <Text style={s.infoLabel}>Ansatte</Text>
                  <Text style={s.infoValue}>{company.employees}</Text>
                </View>
              )}
              {company.industryCode && (
                <View style={s.infoTile}>
                  <Text style={s.infoLabel}>Bransje</Text>
                  <Text style={s.infoValue}>{company.industryCode}</Text>
                  {company.industryDescription && (
                    <Text style={s.infoSub}>{company.industryDescription}</Text>
                  )}
                </View>
              )}
              {company.businessAddress && (
                <View style={s.infoTile}>
                  <Text style={s.infoLabel}>Adresse</Text>
                  <Text style={s.infoValue}>{company.businessAddress}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Analyse */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Analyse</Text>

          <View style={s.banner}>
            <Text style={s.bannerLabel}>Anbefaling</Text>
            <Text style={s.bannerTitle}>{recommendationLabel(analysis.recommendation)}</Text>
            <Text style={s.bannerScore}>
              Gjennomsnittlig score: <Text style={s.bannerScoreVal}>{averageScore}/10</Text>
            </Text>
          </View>

          {criteria.map(({ label, score, rationale }) => (
            <View key={label} style={s.criteriaRow}>
              <View style={s.criteriaTop}>
                <Text style={s.criteriaLabel}>{label}</Text>
                <View style={s.criteriaRight}>
                  <View style={[s.badge, { backgroundColor: badgeColor(score) }]}>
                    <Text style={s.badgeText}>{scoreLabel(score)}</Text>
                  </View>
                  <Text style={s.scoreText}>{score}/10</Text>
                </View>
              </View>
              {rationale && <Text style={s.rationale}>{rationale}</Text>}
            </View>
          ))}
        </View>

        {/* Utkast */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Utkast til lonnskrav</Text>
          <View style={s.draftBox}>
            <Text style={s.draftText}>{draftText}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Lonnkrav – lonnskrav-ai</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
}
