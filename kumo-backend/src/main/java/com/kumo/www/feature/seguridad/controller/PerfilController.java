package com.kumo.www.feature.seguridad.controller;

import com.kumo.www.feature.seguridad.controller.dto.ActualizarPerfilRequest;
import com.kumo.www.feature.seguridad.controller.dto.PerfilResponse;
import com.kumo.www.feature.seguridad.service.PerfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService perfilService;

    @GetMapping("/me")
    public ResponseEntity<PerfilResponse> obtenerPerfil() {
        return ResponseEntity.ok(perfilService.obtenerPerfilActual());
    }

    @PutMapping("/me")
    public ResponseEntity<PerfilResponse> actualizarPerfil(@Valid @RequestBody ActualizarPerfilRequest request) {
        PerfilResponse actualizado = perfilService.actualizarPerfilActual(request);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> solicitarEliminacionCuenta() {
        perfilService.solicitarEliminacionCuenta();
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
