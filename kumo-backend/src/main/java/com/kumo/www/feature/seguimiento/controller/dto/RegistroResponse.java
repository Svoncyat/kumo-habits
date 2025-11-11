package com.kumo.www.feature.seguimiento.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
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
public class RegistroResponse {

    private Long id;
    private Long habitoId;
    private String habitoNombre;
    private LocalDate fechaRegistro;
    private BigDecimal valorRegistrado;
    private boolean estaCumplido;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaUltimaModificacion;
}
