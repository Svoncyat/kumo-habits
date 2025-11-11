package com.kumo.www.feature.recordatorios.controller.dto;

import com.kumo.www.feature.recordatorios.entity.enums.DiaSemana;
import java.time.LocalTime;
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
public class RecordatorioResponse {

    private Long id;
    private Long habitoId;
    private LocalTime horaRecordatorio;
    private String mensaje;
    private boolean estaActivo;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
    private List<DiaSemana> dias;
}
