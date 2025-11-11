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
public class MetaMensualResponse {

    private Long id;
    private Long habitoId;
    private String habitoNombre;
    private int mes;
    private int anio;
    private Integer objetivoDiasCumplidos;
    private BigDecimal objetivoValorAcumulado;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
}
