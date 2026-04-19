package sjogang.lonnskrav.datasource.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sjogang.lonnskrav.datasource.domain.CompanySnapshot;

@Service
@RequiredArgsConstructor
public class CompanyDataService {

    private final CompanyDataProvider companyDataProvider;

    public CompanySnapshot getCompanySnapshot(String orgNumber) {
        return companyDataProvider.fetchByOrgNumber(orgNumber);
    }
}