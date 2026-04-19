package sjogang.lonnskrav.datasource.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sjogang.lonnskrav.datasource.application.CompanyDataService;
import sjogang.lonnskrav.datasource.domain.CompanySnapshot;

@RestController
@RequestMapping("/api/company-data")
@RequiredArgsConstructor
public class CompanyDataController {

    private final CompanyDataService companyDataService;

    @GetMapping("/{orgNumber}")
    public CompanySnapshot getCompanyData(@PathVariable String orgNumber) {
        return companyDataService.getCompanySnapshot(orgNumber);
    }
}