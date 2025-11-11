package com.kumo.www.feature.seguimiento.controller;

import com.kumo.www.feature.seguimiento.controller.dto.RegistroRequest;
import com.kumo.www.feature.seguimiento.controller.dto.RegistroResponse;
import com.kumo.www.feature.seguimiento.service.SeguimientoService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/registros")
@RequiredArgsConstructor
public class SeguimientoController {

    private final SeguimientoService seguimientoService;

    @PostMapping
    public ResponseEntity<RegistroResponse> guardarRegistro(@Valid @RequestBody RegistroRequest request) {
        RegistroResponse response = seguimientoService.guardarRegistro(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/habito/{habitoId}")
    public ResponseEntity<List<RegistroResponse>> obtenerPorHabito(@PathVariable Long habitoId) {
        return ResponseEntity.ok(seguimientoService.obtenerRegistrosPorHabito(habitoId));
    }

    @DeleteMapping("/{registroId}")
    public ResponseEntity<Void> eliminarRegistro(@PathVariable Long registroId) {
        seguimientoService.eliminarRegistro(registroId);
        return ResponseEntity.noContent().build();
    }
}
