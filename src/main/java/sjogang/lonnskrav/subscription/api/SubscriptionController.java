package sjogang.lonnskrav.subscription.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sjogang.lonnskrav.common.UserContextService;
import sjogang.lonnskrav.subscription.application.SubscriptionService;
import sjogang.lonnskrav.subscription.dto.*;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserContextService userContextService;

    @GetMapping("/status")
    public SubscriptionStatusResponse status() {
        return subscriptionService.getStatus(userContextService.getCurrentUserId());
    }

    @PostMapping("/checkout")
    public CheckoutResponse checkout(@RequestBody CheckoutRequest request) {
        return subscriptionService.createCheckoutSession(
                userContextService.getCurrentUserId(),
                request.successUrl(),
                request.cancelUrl()
        );
    }

    @PostMapping("/portal")
    public CheckoutResponse portal(@RequestBody PortalRequest request) {
        return subscriptionService.createPortalSession(
                userContextService.getCurrentUserId(),
                request.returnUrl()
        );
    }
}
