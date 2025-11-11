package com.kumo.www.feature.recordatorios.repository;

import com.kumo.www.feature.recordatorios.entity.RecordatorioDia;
import com.kumo.www.feature.recordatorios.entity.id.RecordatorioDiaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordatorioDiaRepository extends JpaRepository<RecordatorioDia, RecordatorioDiaId> {
}
