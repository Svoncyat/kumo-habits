package com.kumo.www.feature.habitos.service;

import com.kumo.www.feature.habitos.controller.dto.CrearHabitoRequest;
import com.kumo.www.feature.habitos.controller.dto.HabitoResponse;
import java.util.List;

public interface HabitoService {

    HabitoResponse crearHabito(CrearHabitoRequest request);

    List<HabitoResponse> listarHabitos();

    HabitoResponse obtenerHabito(Long id);

    HabitoResponse actualizarHabito(Long id, CrearHabitoRequest request);

    void eliminarHabito(Long id);
}
