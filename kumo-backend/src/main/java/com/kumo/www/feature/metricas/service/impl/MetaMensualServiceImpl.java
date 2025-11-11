package com.kumo.www.feature.metricas.service.impl;

import com.kumo.www.feature.habitos.entity.Habito;
import com.kumo.www.feature.habitos.repository.HabitoRepository;
import com.kumo.www.feature.metricas.controller.dto.MetaMensualRequest;
import com.kumo.www.feature.metricas.controller.dto.MetaMensualResponse;
import com.kumo.www.feature.metricas.entity.MetaMensual;
import com.kumo.www.feature.metricas.repository.MetaMensualRepository;
import com.kumo.www.feature.metricas.service.MetaMensualService;
import com.kumo.www.feature.seguridad.entity.Usuario;
import com.kumo.www.feature.seguridad.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class MetaMensualServiceImpl implements MetaMensualService {

    private final MetaMensualRepository metaMensualRepository;
    private final HabitoRepository habitoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public MetaMensualResponse crearMeta(MetaMensualRequest request) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = obtenerHabitoParaUsuario(request.getHabitoId(), usuario.getId());
        validarObjetivos(request);

        if (metaMensualRepository.existsByHabito_IdAndHabito_Usuario_IdAndMesAndAnio(habito.getId(), usuario.getId(),
                request.getMes().shortValue(), request.getAnio().shortValue())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una meta para ese mes y año");
        }

        OffsetDateTime ahora = OffsetDateTime.now();
        MetaMensual meta = MetaMensual.builder()
                .habito(habito)
                .mes(request.getMes().shortValue())
                .anio(request.getAnio().shortValue())
                .objetivoDiasCumplidos(convertirEnteroAShort(request.getObjetivoDiasCumplidos()))
                .objetivoValorAcumulado(request.getObjetivoValorAcumulado())
                .fechaCreacion(ahora)
                .fechaModificacion(ahora)
                .build();

        MetaMensual guardada = metaMensualRepository.save(meta);
        return mapearMeta(guardada);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<MetaMensualResponse> listarMetas() {
        Usuario usuario = obtenerUsuarioAutenticado();
        return metaMensualRepository.findByHabito_Usuario_Id(usuario.getId()).stream()
                .map(this::mapearMeta)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<MetaMensualResponse> listarMetasPorHabito(Long habitoId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = obtenerHabitoParaUsuario(habitoId, usuario.getId());
        return metaMensualRepository.findByHabito_IdAndHabito_Usuario_Id(habito.getId(), usuario.getId()).stream()
                .map(this::mapearMeta)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public MetaMensualResponse obtenerMeta(Long metaId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        MetaMensual meta = metaMensualRepository.findByIdAndHabito_Usuario_Id(metaId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meta no encontrada"));
        return mapearMeta(meta);
    }

    @Override
    public MetaMensualResponse actualizarMeta(Long metaId, MetaMensualRequest request) {
        Usuario usuario = obtenerUsuarioAutenticado();
        MetaMensual meta = metaMensualRepository.findByIdAndHabito_Usuario_Id(metaId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meta no encontrada"));

        validarObjetivos(request);
        Habito habitoDestino = obtenerHabitoParaUsuario(request.getHabitoId(), usuario.getId());

        if (metaMensualRepository.existsByHabito_IdAndHabito_Usuario_IdAndMesAndAnioAndIdNot(habitoDestino.getId(),
                usuario.getId(), request.getMes().shortValue(), request.getAnio().shortValue(), metaId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe otra meta para ese mes y año");
        }

        meta.setHabito(habitoDestino);
        meta.setMes(request.getMes().shortValue());
        meta.setAnio(request.getAnio().shortValue());
        meta.setObjetivoDiasCumplidos(convertirEnteroAShort(request.getObjetivoDiasCumplidos()));
        meta.setObjetivoValorAcumulado(request.getObjetivoValorAcumulado());
        meta.setFechaModificacion(OffsetDateTime.now());

        MetaMensual actualizada = metaMensualRepository.save(meta);
        return mapearMeta(actualizada);
    }

    @Override
    public void eliminarMeta(Long metaId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        MetaMensual meta = metaMensualRepository.findByIdAndHabito_Usuario_Id(metaId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meta no encontrada"));
        metaMensualRepository.delete(meta);
    }

    private void validarObjetivos(MetaMensualRequest request) {
        if (request.getObjetivoDiasCumplidos() == null && request.getObjetivoValorAcumulado() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe especificar al menos un objetivo");
        }
        if (request.getObjetivoDiasCumplidos() != null && request.getObjetivoDiasCumplidos() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El objetivo de días debe ser mayor a 0");
        }
        if (request.getObjetivoValorAcumulado() != null &&
                request.getObjetivoValorAcumulado().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El objetivo de valor acumulado debe ser mayor a 0");
        }
    }

    private Short convertirEnteroAShort(Integer valor) {
        return valor != null ? valor.shortValue() : null;
    }

    private MetaMensualResponse mapearMeta(MetaMensual meta) {
        String habitoNombre = null;
        if (meta.getHabito() != null && Objects.nonNull(meta.getHabito().getNombre())) {
            habitoNombre = meta.getHabito().getNombre();
        }

        return MetaMensualResponse.builder()
                .id(meta.getId())
                .habitoId(meta.getHabito() != null ? meta.getHabito().getId() : null)
                .habitoNombre(habitoNombre)
                .mes(meta.getMes())
                .anio(meta.getAnio())
                .objetivoDiasCumplidos(meta.getObjetivoDiasCumplidos() != null
                        ? meta.getObjetivoDiasCumplidos().intValue()
                        : null)
                .objetivoValorAcumulado(meta.getObjetivoValorAcumulado())
                .fechaCreacion(meta.getFechaCreacion())
                .fechaModificacion(meta.getFechaModificacion())
                .build();
    }

    private Usuario obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión no válida");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Usuario usuario) {
            return usuarioRepository.findById(usuario.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                            "Usuario no disponible"));
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
    }

    private Habito obtenerHabitoParaUsuario(Long habitoId, Long usuarioId) {
        return habitoRepository.findByIdAndUsuarioIdWithCategorias(habitoId, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hábito no encontrado"));
    }
}
