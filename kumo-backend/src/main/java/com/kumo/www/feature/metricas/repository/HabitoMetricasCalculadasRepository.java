package com.kumo.www.feature.metricas.repository;

import com.kumo.www.feature.metricas.entity.HabitoMetricasCalculadas;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitoMetricasCalculadasRepository extends JpaRepository<HabitoMetricasCalculadas, Long> {

    Optional<HabitoMetricasCalculadas> findByHabito_IdAndHabito_Usuario_Id(Long habitoId, Long usuarioId);
}
