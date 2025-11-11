package com.kumo.www.feature.metricas.repository;

import com.kumo.www.feature.metricas.entity.MetaMensual;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetaMensualRepository extends JpaRepository<MetaMensual, Long> {

    List<MetaMensual> findByHabito_Usuario_Id(Long usuarioId);

    List<MetaMensual> findByHabito_IdAndHabito_Usuario_Id(Long habitoId, Long usuarioId);

    Optional<MetaMensual> findByIdAndHabito_Usuario_Id(Long id, Long usuarioId);

    boolean existsByHabito_IdAndHabito_Usuario_IdAndMesAndAnio(Long habitoId, Long usuarioId, short mes, short anio);

    boolean existsByHabito_IdAndHabito_Usuario_IdAndMesAndAnioAndIdNot(Long habitoId, Long usuarioId, short mes,
            short anio, Long metaId);
}
