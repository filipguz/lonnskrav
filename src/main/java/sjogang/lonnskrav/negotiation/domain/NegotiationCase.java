package sjogang.lonnskrav.negotiation.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import sjogang.lonnskrav.company.domain.Company;

@Entity
@Getter
@Setter
@Table(name = "negotiation_case")
public class NegotiationCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private Integer negotiationYear;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String userId;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}