package sjogang.lonnskrav.datasource.application;

import sjogang.lonnskrav.datasource.domain.CompanySnapshot;

public interface CompanyDataProvider {
    CompanySnapshot fetchByOrgNumber(String orgNumber);
}