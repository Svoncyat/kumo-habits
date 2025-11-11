package com.kumo.www.feature.recordatorios.repository;

import com.kumo.www.feature.recordatorios.entity.Recordatorio;
import com.kumo.www.feature.recordatorios.entity.enums.DiaSemana;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecordatorioRepository extends JpaRepository<Recordatorio, Long> {

        @EntityGraph(attributePaths = "dias")
        List<Recordatorio> findByHabito_IdAndHabito_Usuario_IdOrderByHoraRecordatorioAsc(Long habitoId, Long usuarioId);

        @EntityGraph(attributePaths = "dias")
        Optional<Recordatorio> findByIdAndHabito_Usuario_Id(Long id, Long usuarioId);

        boolean existsByHabito_IdAndHoraRecordatorioAndHabito_Usuario_Id(Long habitoId, LocalTime horaRecordatorio,
                        Long usuarioId);

        boolean existsByHabito_IdAndHoraRecordatorioAndHabito_Usuario_IdAndIdNot(Long habitoId,
                        LocalTime horaRecordatorio,
                        Long usuarioId, Long recordatorioId);

        @Query("SELECT DISTINCT r FROM Recordatorio r "
                        + "JOIN FETCH r.habito h "
                        + "JOIN FETCH r.dias d "
                        + "WHERE r.estaActivo = true AND r.horaRecordatorio = :hora AND d.id.dia = :dia")
        List<Recordatorio> findActivosPorHoraYDia(@Param("hora") LocalTime hora, @Param("dia") DiaSemana dia);
}
