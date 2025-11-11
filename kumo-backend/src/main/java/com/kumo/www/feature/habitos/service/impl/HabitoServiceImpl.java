package com.kumo.www.feature.habitos.service.impl;

import com.kumo.www.feature.habitos.controller.dto.CategoriaResponse;
import com.kumo.www.feature.habitos.controller.dto.CrearHabitoRequest;
import com.kumo.www.feature.habitos.controller.dto.HabitoResponse;
import com.kumo.www.feature.habitos.entity.Categoria;
import com.kumo.www.feature.habitos.entity.Habito;
import com.kumo.www.feature.habitos.repository.CategoriaRepository;
import com.kumo.www.feature.habitos.repository.HabitoRepository;
import com.kumo.www.feature.habitos.service.HabitoService;
import com.kumo.www.feature.seguridad.entity.Usuario;
import com.kumo.www.feature.seguridad.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class HabitoServiceImpl implements HabitoService {

    private final HabitoRepository habitoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public HabitoResponse crearHabito(CrearHabitoRequest request) {
        Usuario usuario = obtenerUsuarioAutenticado();
        String nombreNormalizado = normalizarNombre(request.getNombre());

        if (habitoRepository.existsByUsuario_IdAndNombreIgnoreCase(usuario.getId(), nombreNormalizado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un hábito con ese nombre");
        }

        Habito habito = Habito.builder()
                .usuario(usuario)
                .nombre(nombreNormalizado)
                .metaDiaria(normalizarMeta(request.getMetaDiaria()))
                .estaArchivado(Boolean.TRUE.equals(request.getEstaArchivado()))
                .fechaCreacion(OffsetDateTime.now())
                .fechaModificacion(OffsetDateTime.now())
                .build();

        Set<Categoria> categorias = obtenerCategoriasValidas(request.getCategoriaIds(), usuario.getId());
        habito.asignarCategorias(categorias);

        Habito guardado = habitoRepository.save(habito);
        return mapearHabito(guardado);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<HabitoResponse> listarHabitos() {
        Usuario usuario = obtenerUsuarioAutenticado();
        return habitoRepository.findAllWithCategoriasByUsuarioId(usuario.getId()).stream()
                .map(this::mapearHabito)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public HabitoResponse obtenerHabito(Long id) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = habitoRepository.findByIdAndUsuarioIdWithCategorias(id, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hábito no encontrado"));
        return mapearHabito(habito);
    }

    @Override
    public HabitoResponse actualizarHabito(Long id, CrearHabitoRequest request) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = habitoRepository.findByIdAndUsuarioIdWithCategorias(id, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hábito no encontrado"));

        String nombreNormalizado = normalizarNombre(request.getNombre());
        if (habitoRepository.existsByUsuario_IdAndNombreIgnoreCaseAndIdNot(usuario.getId(), nombreNormalizado, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un hábito con ese nombre");
        }

        habito.setNombre(nombreNormalizado);
        habito.setMetaDiaria(normalizarMeta(request.getMetaDiaria()));
        habito.setEstaArchivado(resolveArchivado(request.getEstaArchivado(), habito.isEstaArchivado()));
        habito.setFechaModificacion(OffsetDateTime.now());

        Set<Categoria> categorias = obtenerCategoriasValidas(request.getCategoriaIds(), usuario.getId());
        habito.asignarCategorias(categorias);

        Habito actualizado = habitoRepository.save(habito);
        return mapearHabito(actualizado);
    }

    @Override
    public void eliminarHabito(Long id) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = habitoRepository.findByIdAndUsuarioIdWithCategorias(id, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hábito no encontrado"));
        habitoRepository.delete(habito);
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

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
    }

    private String normalizarNombre(String nombre) {
        return Optional.ofNullable(nombre)
                .map(String::trim)
                .filter(StringUtils::hasText)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio"));
    }

    private BigDecimal normalizarMeta(BigDecimal meta) {
        return Optional.ofNullable(meta)
                .map(valor -> valor.setScale(2, RoundingMode.HALF_UP))
                .orElse(null);
    }

    private boolean resolveArchivado(Boolean nuevoValor, boolean valorActual) {
        return nuevoValor != null ? nuevoValor : valorActual;
    }

    private Set<Categoria> obtenerCategoriasValidas(Set<Long> categoriaIds, Long usuarioId) {
        if (categoriaIds == null || categoriaIds.isEmpty()) {
            return Collections.emptySet();
        }

        List<Categoria> categorias = categoriaRepository.findByIdInAndUsuario_Id(categoriaIds, usuarioId);
        if (categorias.size() != categoriaIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Alguna categoría no es válida");
        }
        return categorias.stream().collect(Collectors.toSet());
    }

    private HabitoResponse mapearHabito(Habito habito) {
        List<CategoriaResponse> categorias = habito.getCategorias().stream()
                .map(hc -> hc.getCategoria())
                .filter(Objects::nonNull)
                .map(this::mapearCategoria)
                .collect(Collectors.toList());

        return HabitoResponse.builder()
                .id(habito.getId())
                .nombre(habito.getNombre())
                .metaDiaria(habito.getMetaDiaria())
                .estaArchivado(habito.isEstaArchivado())
                .fechaCreacion(habito.getFechaCreacion())
                .fechaModificacion(habito.getFechaModificacion())
                .categorias(categorias)
                .build();
    }

    private CategoriaResponse mapearCategoria(Categoria categoria) {
        return CategoriaResponse.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .colorHex(categoria.getColorHex())
                .build();
    }
}
