package com.kumo.www.feature.metricas.controller;

import com.kumo.www.feature.metricas.controller.dto.MetricasResponse;
import com.kumo.www.feature.metricas.entity.HabitoMetricasCalculadas;
import com.kumo.www.feature.metricas.service.MetricasService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metricas")
@RequiredArgsConstructor
public class MetricasController {

    private final MetricasService metricasService;

    @GetMapping("/habito/{habitoId}")
    public ResponseEntity<MetricasResponse> obtenerMetricasPorHabito(@PathVariable Long habitoId) {
        HabitoMetricasCalculadas metricas = metricasService.obtenerMetricas(habitoId);

        BigDecimal totalValor = metricas.getTotalValorAcumulado() != null
                ? metricas.getTotalValorAcumulado().setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        MetricasResponse response = MetricasResponse.builder()
                .habitoId(metricas.getHabitoId())
                .rachaMasLarga(metricas.getRachaMasLarga())
                .totalDiasCumplidos(metricas.getTotalDiasCumplidos())
                .totalValorAcumulado(totalValor)
                .fechaUltimaActualizacion(metricas.getFechaUltimaActualizacion())
                .build();

        return ResponseEntity.ok(response);
    }
}
