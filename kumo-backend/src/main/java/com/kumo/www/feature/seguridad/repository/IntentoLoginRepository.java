package com.kumo.www.feature.seguridad.repository;

import com.kumo.www.feature.seguridad.entity.IntentoLogin;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IntentoLoginRepository extends JpaRepository<IntentoLogin, Long> {

    List<IntentoLogin> findTop5ByEmailOrderByFechaIntentoDesc(String email);
}
