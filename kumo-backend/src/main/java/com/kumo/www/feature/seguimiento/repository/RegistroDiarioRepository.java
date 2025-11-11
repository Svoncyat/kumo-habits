package com.kumo.www.feature.seguimiento.repository;

import com.kumo.www.feature.seguimiento.entity.RegistroDiario;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroDiarioRepository extends JpaRepository<RegistroDiario, Long> {

    Optional<RegistroDiario> findByHabito_IdAndFechaRegistro(Long habitoId, LocalDate fechaRegistro);

    List<RegistroDiario> findByHabito_IdOrderByFechaRegistroDesc(Long habitoId);

    List<RegistroDiario> findByHabito_IdOrderByFechaRegistroAsc(Long habitoId);

    Optional<RegistroDiario> findByIdAndHabito_Usuario_Id(Long id, Long usuarioId);
}
