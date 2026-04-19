package sjogang.lonnskrav.company.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orgNumber;

    @Column(nullable = false)
    private String name;

    // 👇 NYE FELTER FRA BRREG

    private String industryCode;
    private String industryDescription;

    private String organizationFormCode;
    private String organizationFormDescription;

    private Integer employees;

    private Boolean bankrupt;
    private Boolean underLiquidation;

    private String businessAddress;
}