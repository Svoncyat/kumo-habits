package com.kumo.www.feature.habitos.repository;

import com.kumo.www.feature.habitos.entity.HabitoCategoria;
import com.kumo.www.feature.habitos.entity.id.HabitoCategoriaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitoCategoriaRepository extends JpaRepository<HabitoCategoria, HabitoCategoriaId> {
}
