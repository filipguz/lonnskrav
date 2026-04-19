package sjogang.lonnskrav.negotiation.application;

import lombok.RequiredArgsConstructor;
import sjogang.lonnskrav.analysis.application.AnalysisService;
import sjogang.lonnskrav.analysis.domain.AnalysisResult;
import sjogang.lonnskrav.company.domain.Company;
import sjogang.lonnskrav.company.infrastructure.CompanyRepository;
import sjogang.lonnskrav.negotiation.domain.NegotiationCase;
import sjogang.lonnskrav.negotiation.dto.CreateCaseRequest;
import sjogang.lonnskrav.negotiation.infrastructure.NegotiationCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NegotiationCaseService {

    private final NegotiationCaseRepository caseRepository;
    private final CompanyRepository companyRepository;
    private final AnalysisService analysisService;

    public NegotiationCase createCase(CreateCaseRequest request) {
        Company company = companyRepository.findByOrgNumber(request.orgNumber())
                .orElseGet(() -> {
                    var snapshot = companyDataService.getCompanySnapshot(request.orgNumber());

                    Company c = new Company();
                    c.setOrgNumber(snapshot.getOrgNumber());
                    c.setName(snapshot.getCompanyName());

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
                .orElseThrow(() -> new RuntimeException("Case not found"));

        return analysisService.analyze(nc);
    }

    public NegotiationCase getCaseById(Long id) {
        return caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with id: " + id));
    }
}