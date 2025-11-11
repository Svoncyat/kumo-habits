package com.kumo.www.feature.seguridad.repository;

import com.kumo.www.feature.seguridad.entity.PreferenciasUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferenciasUsuarioRepository extends JpaRepository<PreferenciasUsuario, Long> {
}
