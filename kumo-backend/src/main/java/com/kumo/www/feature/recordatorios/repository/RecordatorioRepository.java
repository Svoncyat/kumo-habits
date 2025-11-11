package com.kumo.www.feature.recordatorios.repository;

import com.kumo.www.feature.recordatorios.entity.Recordatorio;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordatorioRepository extends JpaRepository<Recordatorio, Long> {

    @EntityGraph(attributePaths = "dias")
    List<Recordatorio> findByHabito_IdAndHabito_Usuario_IdOrderByHoraRecordatorioAsc(Long habitoId, Long usuarioId);

    @EntityGraph(attributePaths = "dias")
    Optional<Recordatorio> findByIdAndHabito_Usuario_Id(Long id, Long usuarioId);

    boolean existsByHabito_IdAndHoraRecordatorioAndHabito_Usuario_Id(Long habitoId, LocalTime horaRecordatorio,
            Long usuarioId);

    boolean existsByHabito_IdAndHoraRecordatorioAndHabito_Usuario_IdAndIdNot(Long habitoId, LocalTime horaRecordatorio,
            Long usuarioId, Long recordatorioId);
}
