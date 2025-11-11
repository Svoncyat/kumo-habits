package com.kumo.www.feature.seguridad.repository;

import com.kumo.www.feature.seguridad.entity.SolicitudEliminacion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudEliminacionRepository extends JpaRepository<SolicitudEliminacion, Long> {

    Optional<SolicitudEliminacion> findFirstByUsuario_IdOrderByFechaSolicitudDesc(Long usuarioId);
}
