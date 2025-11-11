package com.kumo.www.feature.metricas.service;

import com.kumo.www.feature.metricas.controller.dto.MetaMensualRequest;
import com.kumo.www.feature.metricas.controller.dto.MetaMensualResponse;
import java.util.List;

public interface MetaMensualService {

    MetaMensualResponse crearMeta(MetaMensualRequest request);

    List<MetaMensualResponse> listarMetas();

    List<MetaMensualResponse> listarMetasPorHabito(Long habitoId);

    MetaMensualResponse obtenerMeta(Long metaId);

    MetaMensualResponse actualizarMeta(Long metaId, MetaMensualRequest request);

    void eliminarMeta(Long metaId);
}
