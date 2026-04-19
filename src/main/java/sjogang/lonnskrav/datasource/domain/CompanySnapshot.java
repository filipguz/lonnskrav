package sjogang.lonnskrav.datasource.domain;

public class CompanySnapshot {

    private String orgNumber;
    private String companyName;
    private String industryCode;
    private String industryDescription;
    private String organizationFormCode;
    private String organizationFormDescription;
    private Integer employees;
    private Boolean bankrupt;
    private Boolean underLiquidation;
    private String businessAddress;

    public String getOrgNumber() {
        return orgNumber;
    }

    public void setOrgNumber(String orgNumber) {
        this.orgNumber = orgNumber;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }

    public String getIndustryDescription() {
        return industryDescription;
    }

    public void setIndustryDescription(String industryDescription) {
        this.industryDescription = industryDescription;
    }

    public String getOrganizationFormCode() {
        return organizationFormCode;
    }

    public void setOrganizationFormCode(String organizationFormCode) {
        this.organizationFormCode = organizationFormCode;
    }

    public String getOrganizationFormDescription() {
        return organizationFormDescription;
    }

    public void setOrganizationFormDescription(String organizationFormDescription) {
        this.organizationFormDescription = organizationFormDescription;
    }

    public Integer getEmployees() {
        return employees;
    }

    public void setEmployees(Integer employees) {
        this.employees = employees;
    }

    public Boolean getBankrupt() {
        return bankrupt;
    }

    public void setBankrupt(Boolean bankrupt) {
        this.bankrupt = bankrupt;
    }

    public Boolean getUnderLiquidation() {
        return underLiquidation;
    }

    public void setUnderLiquidation(Boolean underLiquidation) {
        this.underLiquidation = underLiquidation;
    }

    public String getBusinessAddress() {
        return businessAddress;
    }

    public void setBusinessAddress(String businessAddress) {
        this.businessAddress = businessAddress;
    }
}