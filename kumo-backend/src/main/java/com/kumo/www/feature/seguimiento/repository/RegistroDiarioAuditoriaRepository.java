package com.kumo.www.feature.seguimiento.repository;

import com.kumo.www.feature.seguimiento.entity.RegistroDiarioAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroDiarioAuditoriaRepository extends JpaRepository<RegistroDiarioAuditoria, Long> {
}
