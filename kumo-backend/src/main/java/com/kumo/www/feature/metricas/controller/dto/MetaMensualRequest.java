package com.kumo.www.feature.metricas.controller.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
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
public class MetaMensualRequest {

    @NotNull
    private Long habitoId;

    @NotNull
    @Min(1)
    @Max(12)
    private Integer mes;

    @NotNull
    @Min(2020)
    private Integer anio;

    @Min(1)
    private Integer objetivoDiasCumplidos;

    @DecimalMin(value = "0", inclusive = false)
    private BigDecimal objetivoValorAcumulado;
}
