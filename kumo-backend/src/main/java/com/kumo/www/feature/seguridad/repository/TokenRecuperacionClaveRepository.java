package com.kumo.www.feature.seguridad.repository;

import com.kumo.www.feature.seguridad.entity.TokenRecuperacionClave;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRecuperacionClaveRepository extends JpaRepository<TokenRecuperacionClave, Long> {

    Optional<TokenRecuperacionClave> findByTokenHash(String tokenHash);
}
