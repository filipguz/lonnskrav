package sjogang.lonnskrav.negotiation.infrastructure;

import sjogang.lonnskrav.negotiation.domain.NegotiationCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NegotiationCaseRepository extends JpaRepository<NegotiationCase, Long> {
    List<NegotiationCase> findByUserId(String userId);
    Optional<NegotiationCase> findByIdAndUserId(Long id, String userId);
}