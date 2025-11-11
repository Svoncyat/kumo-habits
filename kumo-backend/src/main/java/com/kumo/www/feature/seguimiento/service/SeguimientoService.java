package com.kumo.www.feature.seguimiento.service;

import com.kumo.www.feature.seguimiento.controller.dto.RegistroRequest;
import com.kumo.www.feature.seguimiento.controller.dto.RegistroResponse;
import java.util.List;

public interface SeguimientoService {

    RegistroResponse guardarRegistro(RegistroRequest request);

    List<RegistroResponse> obtenerRegistrosPorHabito(Long habitoId);

    void eliminarRegistro(Long registroId);
}
