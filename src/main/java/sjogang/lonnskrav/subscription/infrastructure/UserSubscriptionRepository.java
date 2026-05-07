package sjogang.lonnskrav.subscription.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import sjogang.lonnskrav.subscription.domain.UserSubscription;

import java.util.Optional;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    Optional<UserSubscription> findByClerkUserId(String clerkUserId);
    Optional<UserSubscription> findByStripeCustomerId(String stripeCustomerId);
}