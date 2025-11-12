package com.kumo.www.feature.metricas.entity;

import com.kumo.www.feature.habitos.entity.Habito;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "habito_metricas_calculadas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class HabitoMetricasCalculadas {

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "habito_id")
    private Long habitoId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "habito_id")
    private Habito habito;

    @Column(name = "racha_mas_larga", nullable = false)
    private int rachaMasLarga;

    @Column(name = "total_dias_cumplidos", nullable = false)
    private int totalDiasCumplidos;

    @Column(name = "total_valor_acumulado", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalValorAcumulado;

    @Column(name = "fecha_ultima_actualizacion")
    private OffsetDateTime fechaUltimaActualizacion;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}
