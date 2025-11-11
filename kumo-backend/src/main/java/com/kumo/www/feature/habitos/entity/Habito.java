package com.kumo.www.feature.habitos.entity;

import com.kumo.www.feature.seguridad.entity.Usuario;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "habitos", indexes = {
        @Index(name = "idx_habitos_usuario_id", columnList = "usuario_id"),
        @Index(name = "idx_habito_usuario_nombre_unico", columnList = "usuario_id, nombre", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Habito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "meta_diaria", precision = 10, scale = 2)
    private BigDecimal metaDiaria;

    @Column(name = "esta_archivado", nullable = false)
    private boolean estaArchivado;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    private OffsetDateTime fechaModificacion;

    @Builder.Default
    @OneToMany(mappedBy = "habito", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HabitoCategoria> categorias = new HashSet<>();

    public void asignarCategorias(Set<Categoria> nuevasCategorias) {
        categorias.clear();
        nuevasCategorias.forEach(this::agregarCategoria);
    }

    public void agregarCategoria(Categoria categoria) {
        HabitoCategoria habitoCategoria = HabitoCategoria.builder()
                .habito(this)
                .categoria(categoria)
                .build();
        categorias.add(habitoCategoria);
    }
}
