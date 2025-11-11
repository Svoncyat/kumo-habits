package com.kumo.www.feature.habitos.controller.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
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
public class HabitoResponse {

    private Long id;
    private String nombre;
    private BigDecimal metaDiaria;
    private boolean estaArchivado;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
    private List<CategoriaResponse> categorias;
}
