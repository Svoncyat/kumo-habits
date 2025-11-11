package com.kumo.www.feature.metricas.entity;

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
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "metas_mensuales", indexes = {
        @Index(name = "idx_metas_habito", columnList = "habito_id"),
        @Index(name = "uq_meta_habito_mes_anio", columnList = "habito_id, mes, anio", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MetaMensual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habito_id", nullable = false)
    private Habito habito;

    @Column(name = "mes", nullable = false)
    private short mes;

    @Column(name = "anio", nullable = false)
    private short anio;

    @Column(name = "objetivo_dias_cumplidos")
    private Short objetivoDiasCumplidos;

    @Column(name = "objetivo_valor_acumulado", precision = 12, scale = 2)
    private BigDecimal objetivoValorAcumulado;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    private OffsetDateTime fechaModificacion;
}
