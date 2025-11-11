package com.kumo.www.feature.habitos.controller;

import com.kumo.www.feature.habitos.controller.dto.CrearHabitoRequest;
import com.kumo.www.feature.habitos.controller.dto.HabitoResponse;
import com.kumo.www.feature.habitos.service.HabitoService;
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
@RequestMapping("/api/habitos")
@RequiredArgsConstructor
public class HabitoController {

    private final HabitoService habitoService;

    @PostMapping
    public ResponseEntity<HabitoResponse> crearHabito(@Valid @RequestBody CrearHabitoRequest request) {
        HabitoResponse response = habitoService.crearHabito(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<HabitoResponse>> listarHabitos() {
        return ResponseEntity.ok(habitoService.listarHabitos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitoResponse> obtenerHabito(@PathVariable Long id) {
        return ResponseEntity.ok(habitoService.obtenerHabito(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitoResponse> actualizarHabito(@PathVariable Long id,
            @Valid @RequestBody CrearHabitoRequest request) {
        HabitoResponse response = habitoService.actualizarHabito(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarHabito(@PathVariable Long id) {
        habitoService.eliminarHabito(id);
        return ResponseEntity.noContent().build();
    }
}
