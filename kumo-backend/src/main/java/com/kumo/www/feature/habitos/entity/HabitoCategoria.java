package com.kumo.www.feature.habitos.entity;

import com.kumo.www.feature.habitos.entity.id.HabitoCategoriaId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "habito_categorias")
@Getter
@Setter
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class HabitoCategoria {

    @EmbeddedId
    @EqualsAndHashCode.Include
    @Builder.Default
    private HabitoCategoriaId id = new HabitoCategoriaId();

    @MapsId("habitoId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habito_id", nullable = false)
    private Habito habito;

    @MapsId("categoriaId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    public HabitoCategoria(HabitoCategoriaId id, Habito habito, Categoria categoria) {
        this.id = id != null ? id : new HabitoCategoriaId();
        this.habito = habito;
        this.categoria = categoria;
    }
}
