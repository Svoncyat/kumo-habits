package com.kumo.www.feature.seguridad.service;

import com.kumo.www.feature.seguridad.controller.dto.ActualizarPerfilRequest;
import com.kumo.www.feature.seguridad.controller.dto.PerfilResponse;

public interface PerfilService {

    PerfilResponse obtenerPerfilActual();

    PerfilResponse actualizarPerfilActual(ActualizarPerfilRequest request);

    void solicitarEliminacionCuenta();
}
