package sjogang.lonnskrav.negotiation.application;

import lombok.RequiredArgsConstructor;
import sjogang.lonnskrav.analysis.application.AnalysisService;
import sjogang.lonnskrav.analysis.domain.AnalysisResult;
import sjogang.lonnskrav.company.domain.Company;
import sjogang.lonnskrav.company.infrastructure.CompanyRepository;
import sjogang.lonnskrav.datasource.application.CompanyDataService;
import sjogang.lonnskrav.negotiation.domain.NegotiationCase;
import sjogang.lonnskrav.negotiation.dto.CreateCaseRequest;
import sjogang.lonnskrav.negotiation.infrastructure.NegotiationCaseRepository;
import sjogang.lonnskrav.regnskap.application.RegnskapDataProvider;
import sjogang.lonnskrav.regnskap.domain.RegnskapSnapshot;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NegotiationCaseService {

    private final NegotiationCaseRepository caseRepository;
    private final CompanyRepository companyRepository;
    private final AnalysisService analysisService;
    private final CompanyDataService companyDataService;
    private final RegnskapDataProvider regnskapDataProvider;

    public NegotiationCase createCase(CreateCaseRequest request) {
        Company company = companyRepository.findByOrgNumber(request.orgNumber())
                .orElseGet(() -> {
                    var snapshot = companyDataService.getCompanySnapshot(request.orgNumber());

                    Company c = new Company();
                    c.setOrgNumber(snapshot.getOrgNumber());
                    c.setName(snapshot.getCompanyName());
                    c.setIndustryCode(snapshot.getIndustryCode());
                    c.setIndustryDescription(snapshot.getIndustryDescription());
                    c.setOrganizationFormCode(snapshot.getOrganizationFormCode());
                    c.setOrganizationFormDescription(snapshot.getOrganizationFormDescription());
                    c.setEmployees(snapshot.getEmployees());
                    c.setBankrupt(snapshot.getBankrupt());
                    c.setUnderLiquidation(snapshot.getUnderLiquidation());
                    c.setBusinessAddress(snapshot.getBusinessAddress());

                    return companyRepository.save(c);
                });

        NegotiationCase negotiationCase = new NegotiationCase();
        negotiationCase.setTitle(request.title());
        negotiationCase.setNegotiationYear(request.negotiationYear());
        negotiationCase.setStatus("CREATED");
        negotiationCase.setCompany(company);

        return caseRepository.save(negotiationCase);
    }

    public List<NegotiationCase> getAllCases() {
        return caseRepository.findAll();
    }

    public AnalysisResult analyzeCase(Long id) {
        NegotiationCase nc = caseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sak ikke funnet med id: " + id));

        Optional<RegnskapSnapshot> regnskap = Optional.empty();
        if (nc.getCompany() != null) {
            regnskap = regnskapDataProvider.fetchLatest(nc.getCompany().getOrgNumber());
        }

        return analysisService.analyze(nc, regnskap);
    }

    public NegotiationCase getCaseById(Long id) {
        return caseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sak ikke funnet med id: " + id));
    }
}