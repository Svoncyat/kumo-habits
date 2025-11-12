package com.kumo.www.feature.habitos.service.impl;

import com.kumo.www.feature.habitos.controller.dto.CategoriaResponse;
import com.kumo.www.feature.habitos.entity.Categoria;
import com.kumo.www.feature.habitos.repository.CategoriaRepository;
import com.kumo.www.feature.habitos.service.CategoriaService;
import com.kumo.www.feature.seguridad.entity.Usuario;
import com.kumo.www.feature.seguridad.repository.UsuarioRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponse> obtenerCategoriasDelUsuario() {
        Usuario usuario = obtenerUsuarioAutenticado();
        List<Categoria> categorias = categoriaRepository.findByUsuario_Id(usuario.getId());
        
        return categorias.stream()
                .map(this::mapearCategoria)
                .collect(Collectors.toList());
    }

    private Usuario obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión no válida");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Usuario usuario) {
            return usuarioRepository.findById(usuario.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no disponible"));
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión no válida");
    }

    private CategoriaResponse mapearCategoria(Categoria categoria) {
        return CategoriaResponse.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .colorHex(categoria.getColorHex())
                .build();
    }
}
