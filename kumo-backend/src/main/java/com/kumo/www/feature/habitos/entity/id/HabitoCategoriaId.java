package com.kumo.www.feature.habitos.entity.id;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class HabitoCategoriaId implements Serializable {

    @Column(name = "habito_id")
    private Long habitoId;

    @Column(name = "categoria_id")
    private Long categoriaId;

    public HabitoCategoriaId() {
    }

    public HabitoCategoriaId(Long habitoId, Long categoriaId) {
        this.habitoId = habitoId;
        this.categoriaId = categoriaId;
    }

    public Long getHabitoId() {
        return habitoId;
    }

    public void setHabitoId(Long habitoId) {
        this.habitoId = habitoId;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        HabitoCategoriaId that = (HabitoCategoriaId) o;
        return Objects.equals(habitoId, that.habitoId)
                && Objects.equals(categoriaId, that.categoriaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(habitoId, categoriaId);
    }
}
