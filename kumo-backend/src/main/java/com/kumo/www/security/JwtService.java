package com.kumo.www.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

@Service
@Slf4j
public class JwtService {

    private final String secret;
    private final Duration expiration;
    private SecretKey secretKey;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration-minutes:60}") long expirationMinutes) {
        this.secret = secret;
        this.expiration = Duration.ofMinutes(expirationMinutes);
    }

    @PostConstruct
    void initializeKey() {
        Assert.state(StringUtils.hasText(secret), "El secreto JWT no puede ser nulo ni vacío");
        byte[] keyBytes = decodeSecret(secret);
        if (keyBytes.length < 32) {
            keyBytes = hashToLength(keyBytes, 32);
        }
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = parseToken(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(Map.of(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails.getUsername(), expiration);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equalsIgnoreCase(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public Duration getExpirationDuration() {
        return expiration;
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private String buildToken(Map<String, Object> extraClaims, String subject, Duration tokenDuration) {
        Instant now = Instant.now();
        Instant expirationInstant = now.plus(tokenDuration);
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expirationInstant))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    private byte[] decodeSecret(String secret) {
        return Optional.of(secret)
                .map(String::trim)
                .map(value -> {
                    try {
                        return Decoders.BASE64.decode(value);
                    } catch (IllegalArgumentException ignored) {
                        return value.getBytes(StandardCharsets.UTF_8);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("El secreto JWT no puede ser nulo"));
    }

    private byte[] hashToLength(byte[] value, int length) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(value);
            if (hashed.length == length) {
                return hashed;
            }
            byte[] resized = new byte[length];
            System.arraycopy(hashed, 0, resized, 0, Math.min(hashed.length, length));
            return resized;
        } catch (NoSuchAlgorithmException e) {
            log.error("No se pudo inicializar el MessageDigest SHA-256", e);
            throw new IllegalStateException("No se pudo calcular el hash del secreto JWT", e);
        }
    }
}
