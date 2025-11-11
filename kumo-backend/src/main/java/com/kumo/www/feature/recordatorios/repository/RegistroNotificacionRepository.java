package com.kumo.www.feature.recordatorios.repository;

import com.kumo.www.feature.recordatorios.entity.RegistroNotificacion;
import java.time.OffsetDateTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistroNotificacionRepository extends JpaRepository<RegistroNotificacion, Long> {

    boolean existsByRecordatorio_IdAndFechaDisparoBetween(Long recordatorioId, OffsetDateTime inicio,
            OffsetDateTime fin);
}
