package com.kumo.www.feature.seguimiento.entity;

import com.kumo.www.feature.habitos.entity.Habito;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "registros_diarios", indexes = {
        @Index(name = "idx_registros_diarios_fecha", columnList = "fecha_registro"),
        @Index(name = "uq_registro_habito_fecha", columnList = "habito_id, fecha_registro", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class RegistroDiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habito_id", nullable = false)
    private Habito habito;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;

    @Column(name = "valor_registrado", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorRegistrado;

    @Column(name = "esta_cumplido", nullable = false)
    private boolean estaCumplido;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_ultima_modificacion")
    private OffsetDateTime fechaUltimaModificacion;
}
