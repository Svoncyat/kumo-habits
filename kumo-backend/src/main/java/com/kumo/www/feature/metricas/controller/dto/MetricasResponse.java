package com.kumo.www.feature.metricas.controller.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetricasResponse {

    private Long habitoId;
    private int rachaMasLarga;
    private int totalDiasCumplidos;
    private BigDecimal totalValorAcumulado;
    private OffsetDateTime fechaUltimaActualizacion;
}
