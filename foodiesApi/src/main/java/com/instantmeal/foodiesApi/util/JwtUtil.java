package com.instantmeal.foodiesApi.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${jwt.secret.key:}")
    private String SECRET_KEY;

    private SecretKey transientKey;

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hrs expiration
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private synchronized SecretKey getKey() {
        if (SECRET_KEY != null && !SECRET_KEY.trim().isEmpty()) {
            try {
                byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY.trim());
                return Keys.hmacShaKeyFor(keyBytes);
            } catch (Exception e) {
                System.err.println("WARNING: Failed to decode configured Base64 jwt.secret.key. Falling back to transient in-memory key.");
            }
        }
        if (transientKey == null) {
            System.err.println("==========================================================================");
            System.err.println("WARNING: jwt.secret.key is not configured or invalid in application.properties!");
            System.err.println("Generating a transient secure key for this session.");
            System.err.println("NOTE: All active sessions/JWT tokens will become invalid when the server restarts.");
            System.err.println("Run 'com.instantmeal.foodiesApi.util.KeyGenerator' to generate a permanent key.");
            System.err.println("==========================================================================");
            byte[] keyBytes = new byte[32];
            new java.security.SecureRandom().nextBytes(keyBytes);
            transientKey = Keys.hmacShaKeyFor(keyBytes);
        }
        return transientKey;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
