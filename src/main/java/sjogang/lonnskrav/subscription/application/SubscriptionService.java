package sjogang.lonnskrav.subscription.application;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import sjogang.lonnskrav.subscription.config.StripeConfig;
import sjogang.lonnskrav.subscription.domain.Plan;
import sjogang.lonnskrav.subscription.domain.UserSubscription;
import sjogang.lonnskrav.subscription.dto.CheckoutResponse;
import sjogang.lonnskrav.subscription.dto.SubscriptionStatusResponse;
import sjogang.lonnskrav.subscription.infrastructure.UserSubscriptionRepository;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final UserSubscriptionRepository repository;
    private final StripeConfig config;

    @Transactional
    public UserSubscription getOrCreate(String userId) {
        return repository.findByClerkUserId(userId).orElseGet(() -> {
            UserSubscription s = new UserSubscription();
            s.setClerkUserId(userId);
            return repository.save(s);
        });
    }

    public SubscriptionStatusResponse getStatus(String userId) {
        UserSubscription sub = getOrCreate(userId);
        boolean canRun = sub.getPlan() == Plan.PRO || sub.getAnalysesUsed() < config.getFreeAnalysisLimit();
        return new SubscriptionStatusResponse(
                sub.getPlan().name(),
                sub.getAnalysesUsed(),
                config.getFreeAnalysisLimit(),
                canRun
        );
    }

    @Transactional
    public void checkAndIncrementAnalysis(String userId) {
        UserSubscription sub = getOrCreate(userId);
        if (sub.getPlan() != Plan.PRO && sub.getAnalysesUsed() >= config.getFreeAnalysisLimit()) {
            throw new ResponseStatusException(
                    HttpStatus.PAYMENT_REQUIRED,
                    "Gratiskvoten er brukt opp. Oppgrader til Pro for ubegrenset tilgang."
            );
        }
        if (sub.getPlan() == Plan.FREE) {
            sub.setAnalysesUsed(sub.getAnalysesUsed() + 1);
            sub.setUpdatedAt(LocalDateTime.now());
            repository.save(sub);
        }
    }

    public CheckoutResponse createCheckoutSession(String userId, String successUrl, String cancelUrl) {
        if (!config.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Betalingsfunksjon ikke aktivert");
        }
        try {
            Stripe.apiKey = config.getSecretKey();
            UserSubscription sub = getOrCreate(userId);

            String customerId = sub.getStripeCustomerId();
            if (customerId == null) {
                Customer customer = Customer.create(
                        CustomerCreateParams.builder()
                                .putMetadata("clerkUserId", userId)
                                .build()
                );
                customerId = customer.getId();
                sub.setStripeCustomerId(customerId);
                sub.setUpdatedAt(LocalDateTime.now());
                repository.save(sub);
            }

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setCustomer(customerId)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setPrice(config.getPriceId())
                            .setQuantity(1L)
                            .build())
                    .setSuccessUrl(successUrl != null ? successUrl : config.getSuccessUrl())
                    .setCancelUrl(cancelUrl != null ? cancelUrl : config.getCancelUrl())
                    .putMetadata("clerkUserId", userId)
                    .build();

            Session session = Session.create(params);
            return new CheckoutResponse(session.getUrl());
        } catch (StripeException e) {
            log.error("Stripe checkout-feil for bruker {}: {}", userId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Kunne ikke starte betaling");
        }
    }

    public CheckoutResponse createPortalSession(String userId, String returnUrl) {
        if (!config.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Betalingsfunksjon ikke aktivert");
        }
        try {
            Stripe.apiKey = config.getSecretKey();
            UserSubscription sub = getOrCreate(userId);
            if (sub.getStripeCustomerId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ingen Stripe-kunde funnet");
            }
            com.stripe.param.billingportal.SessionCreateParams params =
                    com.stripe.param.billingportal.SessionCreateParams.builder()
                            .setCustomer(sub.getStripeCustomerId())
                            .setReturnUrl(returnUrl != null ? returnUrl : config.getCancelUrl())
                            .build();
            com.stripe.model.billingportal.Session portal =
                    com.stripe.model.billingportal.Session.create(params);
            return new CheckoutResponse(portal.getUrl());
        } catch (StripeException e) {
            log.error("Stripe portal-feil for bruker {}: {}", userId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Kunne ikke åpne abonnementportal");
        }
    }

    @Transactional
    public void handleWebhook(byte[] payload, String sigHeader) {
        if (!config.isEnabled()) return;

        Stripe.apiKey = config.getSecretKey();
        Event event;
        try {
            event = Webhook.constructEvent(
                    new String(payload, StandardCharsets.UTF_8),
                    sigHeader,
                    config.getWebhookSecret()
            );
        } catch (SignatureVerificationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ugyldig webhook-signatur");
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> {
                if (event.getDataObjectDeserializer().getObject().isPresent()) {
                    Session session = (Session) event.getDataObjectDeserializer().getObject().get();
                    repository.findByStripeCustomerId(session.getCustomer()).ifPresent(sub -> {
                        sub.setPlan(Plan.PRO);
                        sub.setStripeSubscriptionId(session.getSubscription());
                        sub.setUpdatedAt(LocalDateTime.now());
                        repository.save(sub);
                        log.info("Bruker {} oppgradert til PRO", sub.getClerkUserId());
                    });
                }
            }
            case "customer.subscription.deleted" -> {
                if (event.getDataObjectDeserializer().getObject().isPresent()) {
                    Subscription stripeSub = (Subscription) event.getDataObjectDeserializer().getObject().get();
                    repository.findByStripeCustomerId(stripeSub.getCustomer()).ifPresent(sub -> {
                        sub.setPlan(Plan.FREE);
                        sub.setStripeSubscriptionId(null);
                        sub.setUpdatedAt(LocalDateTime.now());
                        repository.save(sub);
                        log.info("Bruker {} nedgradert til FREE", sub.getClerkUserId());
                    });
                }
            }
            default -> log.debug("Ignorerer Stripe-event: {}", event.getType());
        }
    }
}