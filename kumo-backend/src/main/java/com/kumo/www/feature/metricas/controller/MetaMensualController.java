package com.kumo.www.feature.metricas.controller;

import com.kumo.www.feature.metricas.controller.dto.MetaMensualRequest;
import com.kumo.www.feature.metricas.controller.dto.MetaMensualResponse;
import com.kumo.www.feature.metricas.service.MetaMensualService;
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
@RequestMapping("/api/metas")
@RequiredArgsConstructor
public class MetaMensualController {

    private final MetaMensualService metaMensualService;

    @PostMapping
    public ResponseEntity<MetaMensualResponse> crearMeta(@Valid @RequestBody MetaMensualRequest request) {
        MetaMensualResponse response = metaMensualService.crearMeta(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MetaMensualResponse>> listarMetas() {
        return ResponseEntity.ok(metaMensualService.listarMetas());
    }

    @GetMapping("/habito/{habitoId}")
    public ResponseEntity<List<MetaMensualResponse>> listarMetasPorHabito(@PathVariable Long habitoId) {
        return ResponseEntity.ok(metaMensualService.listarMetasPorHabito(habitoId));
    }

    @GetMapping("/{metaId}")
    public ResponseEntity<MetaMensualResponse> obtenerMeta(@PathVariable Long metaId) {
        return ResponseEntity.ok(metaMensualService.obtenerMeta(metaId));
    }

    @PutMapping("/{metaId}")
    public ResponseEntity<MetaMensualResponse> actualizarMeta(@PathVariable Long metaId,
            @Valid @RequestBody MetaMensualRequest request) {
        return ResponseEntity.ok(metaMensualService.actualizarMeta(metaId, request));
    }

    @DeleteMapping("/{metaId}")
    public ResponseEntity<Void> eliminarMeta(@PathVariable Long metaId) {
        metaMensualService.eliminarMeta(metaId);
        return ResponseEntity.noContent().build();
    }
}
