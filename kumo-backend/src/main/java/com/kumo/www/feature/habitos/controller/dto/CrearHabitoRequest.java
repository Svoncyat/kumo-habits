package com.kumo.www.feature.habitos.controller.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Set;
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
public class CrearHabitoRequest {

    @NotBlank
    @Size(min = 3, max = 100)
    private String nombre;

    @DecimalMin(value = "0", inclusive = false, message = "La meta diaria debe ser mayor a 0")
    private BigDecimal metaDiaria;

    private Boolean estaArchivado;

    private Set<Long> categoriaIds;
}
