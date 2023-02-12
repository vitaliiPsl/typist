package com.example.typist.config.security.jwt;

import com.example.typist.payload.error.ApiError;
import com.example.typist.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtTokenVerifierFilter extends OncePerRequestFilter {
    private final AuthService authService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain) throws ServletException, IOException {
        String authorization = req.getHeader(HttpHeaders.AUTHORIZATION);

        if (authorization == null || authorization.isBlank() || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(req, res);
            return;
        }

        verifyToken(req, res, filterChain, authorization);
    }

    private void verifyToken(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain, String authorization) throws IOException {
        log.debug("Verify authorization: {}", authorization);

        String token = authorization.replace("Bearer ", "");
        try {
            Authentication authentication = authService.exchangeToken(token);
            authentication.setAuthenticated(true);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(req, res);
        } catch (Exception e) {
            log.error("Jwt token failed verification: {}", token, e);
            writeErrorResponse(res);
        }
    }

    private void writeErrorResponse(HttpServletResponse response) throws IOException {
        ApiError apiError = new ApiError(HttpStatus.UNAUTHORIZED, "Invalid token");

        String responseBody = objectMapper.writeValueAsString(apiError);

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setContentLength(responseBody.length());

        response.getWriter().print(responseBody);
        response.getWriter().flush();
    }
}
