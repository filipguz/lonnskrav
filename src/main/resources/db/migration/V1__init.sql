CREATE TABLE company (
    id                           BIGSERIAL PRIMARY KEY,
    org_number                   VARCHAR(255) NOT NULL UNIQUE,
    name                         VARCHAR(255) NOT NULL,
    industry_code                VARCHAR(255),
    industry_description         VARCHAR(255),
    organization_form_code       VARCHAR(255),
    organization_form_description VARCHAR(255),
    employees                    INTEGER,
    bankrupt                     BOOLEAN,
    under_liquidation            BOOLEAN,
    business_address             VARCHAR(255)
);

CREATE TABLE negotiation_case (
    id                BIGSERIAL PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    negotiation_year  INTEGER,
    status            VARCHAR(255) NOT NULL,
    user_id           VARCHAR(255) NOT NULL,
    company_id        BIGINT REFERENCES company(id)
);
