package com.kumo.www.feature.recordatorios.service;

import com.kumo.www.feature.recordatorios.controller.dto.RecordatorioRequest;
import com.kumo.www.feature.recordatorios.controller.dto.RecordatorioResponse;
import com.kumo.www.feature.recordatorios.controller.dto.RecordatorioUpdateRequest;
import java.util.List;

public interface RecordatorioService {

    RecordatorioResponse crearRecordatorio(RecordatorioRequest request);

    List<RecordatorioResponse> obtenerRecordatoriosPorHabito(Long habitoId);

    RecordatorioResponse actualizarRecordatorio(Long recordatorioId, RecordatorioUpdateRequest request);

    void eliminarRecordatorio(Long recordatorioId);
}
