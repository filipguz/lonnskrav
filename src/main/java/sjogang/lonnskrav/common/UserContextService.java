package sjogang.lonnskrav.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserContextService {

    @Value("${app.auth.jwks-uri:}")
    private String jwksUri;

    public String getCurrentUserId() {
        if (jwksUri == null || jwksUri.isBlank()) {
            return "dev-user";
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getToken().getSubject();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ikke autentisert");
    }
}
