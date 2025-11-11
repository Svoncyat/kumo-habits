package com.kumo.www.feature.metricas.service;

import com.kumo.www.feature.metricas.entity.HabitoMetricasCalculadas;

public interface MetricasService {

    void recalcularMetricas(Long habitoId);

    HabitoMetricasCalculadas obtenerMetricas(Long habitoId);
}
