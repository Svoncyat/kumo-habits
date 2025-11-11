package com.kumo.www.feature.recordatorios.controller;

import com.kumo.www.feature.recordatorios.controller.dto.RecordatorioRequest;
import com.kumo.www.feature.recordatorios.controller.dto.RecordatorioResponse;
import com.kumo.www.feature.recordatorios.controller.dto.RecordatorioUpdateRequest;
import com.kumo.www.feature.recordatorios.service.RecordatorioService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recordatorios")
@RequiredArgsConstructor
public class RecordatorioController {

    private final RecordatorioService recordatorioService;

    @PostMapping
    public ResponseEntity<RecordatorioResponse> crearRecordatorio(@Valid @RequestBody RecordatorioRequest request) {
        RecordatorioResponse respuesta = recordatorioService.crearRecordatorio(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @GetMapping("/habito/{habitoId}")
    public ResponseEntity<List<RecordatorioResponse>> obtenerRecordatoriosPorHabito(@PathVariable Long habitoId) {
        List<RecordatorioResponse> recordatorios = recordatorioService.obtenerRecordatoriosPorHabito(habitoId);
        return ResponseEntity.ok(recordatorios);
    }

    @PutMapping("/{recordatorioId}")
    public ResponseEntity<RecordatorioResponse> actualizarRecordatorio(@PathVariable Long recordatorioId,
            @Valid @RequestBody RecordatorioUpdateRequest request) {
        RecordatorioResponse actualizado = recordatorioService.actualizarRecordatorio(recordatorioId, request);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{recordatorioId}")
    public ResponseEntity<Void> eliminarRecordatorio(@PathVariable Long recordatorioId) {
        recordatorioService.eliminarRecordatorio(recordatorioId);
        return ResponseEntity.noContent().build();
    }
}
