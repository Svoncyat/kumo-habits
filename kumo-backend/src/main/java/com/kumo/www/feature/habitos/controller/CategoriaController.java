package com.kumo.www.feature.habitos.controller;

import com.kumo.www.feature.habitos.controller.dto.CategoriaResponse;
import com.kumo.www.feature.habitos.service.CategoriaService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> obtenerCategorias() {
        List<CategoriaResponse> categorias = categoriaService.obtenerCategoriasDelUsuario();
        return ResponseEntity.ok(categorias);
    }
}
