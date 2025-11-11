package com.kumo.www.feature.recordatorios.controller.dto;

import com.kumo.www.feature.recordatorios.entity.enums.DiaSemana;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;
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
public class RecordatorioUpdateRequest {

    @NotNull
    private LocalTime horaRecordatorio;

    private String mensaje;

    private Boolean estaActivo;

    @NotEmpty
    private Set<DiaSemana> dias;
}
