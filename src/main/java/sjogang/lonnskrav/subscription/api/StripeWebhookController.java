package sjogang.lonnskrav.subscription.api;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sjogang.lonnskrav.subscription.application.SubscriptionService;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class StripeWebhookController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/api/stripe/webhook")
    public ResponseEntity<String> webhook(
            HttpServletRequest request,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) throws IOException {
        byte[] payload = request.getInputStream().readAllBytes();
        subscriptionService.handleWebhook(payload, sigHeader);
        return ResponseEntity.ok("ok");
    }
}
