package com.kumo.www.feature.seguimiento.controller.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
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
public class RegistroRequest {

    @NotNull
    private Long habitoId;

    @NotNull
    private LocalDate fechaRegistro;

    @NotNull
    @DecimalMin(value = "0", inclusive = false, message = "El valor registrado debe ser mayor a 0")
    private BigDecimal valorRegistrado;

    private Boolean estaCumplido;
}
