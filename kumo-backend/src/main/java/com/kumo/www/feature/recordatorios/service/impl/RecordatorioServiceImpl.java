package com.kumo.www.feature.recordatorios.service.impl;

import com.kumo.www.feature.habitos.entity.Habito;
import com.kumo.www.feature.habitos.repository.HabitoRepository;
import com.kumo.www.feature.recordatorios.controller.dto.RecordatorioRequest;
import com.kumo.www.feature.recordatorios.controller.dto.RecordatorioResponse;
import com.kumo.www.feature.recordatorios.controller.dto.RecordatorioUpdateRequest;
import com.kumo.www.feature.recordatorios.entity.Recordatorio;
import com.kumo.www.feature.recordatorios.entity.enums.DiaSemana;
import com.kumo.www.feature.recordatorios.repository.RecordatorioRepository;
import com.kumo.www.feature.recordatorios.service.RecordatorioService;
import com.kumo.www.feature.seguridad.entity.Usuario;
import com.kumo.www.feature.seguridad.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;
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
public class RecordatorioServiceImpl implements RecordatorioService {

    private final RecordatorioRepository recordatorioRepository;
    private final HabitoRepository habitoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public RecordatorioResponse crearRecordatorio(RecordatorioRequest request) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = obtenerHabitoParaUsuario(request.getHabitoId(), usuario.getId());
        Set<DiaSemana> dias = normalizarDias(request.getDias());

        if (recordatorioRepository.existsByHabito_IdAndHoraRecordatorioAndHabito_Usuario_Id(habito.getId(),
                request.getHoraRecordatorio(), usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe un recordatorio configurado para esa hora");
        }

        OffsetDateTime ahora = OffsetDateTime.now();
        boolean estaActivo = request.getEstaActivo() == null || request.getEstaActivo();

        Recordatorio recordatorio = Recordatorio.builder()
                .habito(habito)
                .horaRecordatorio(request.getHoraRecordatorio())
                .mensaje(normalizarMensaje(request.getMensaje()))
                .fechaCreacion(ahora)
                .fechaModificacion(ahora)
                .build();
        recordatorio.setEstaActivo(estaActivo);
        recordatorio.establecerDias(dias);

        Recordatorio guardado = recordatorioRepository.save(recordatorio);
        return mapearRecordatorio(guardado);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<RecordatorioResponse> obtenerRecordatoriosPorHabito(Long habitoId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = obtenerHabitoParaUsuario(habitoId, usuario.getId());

        return recordatorioRepository.findByHabito_IdAndHabito_Usuario_IdOrderByHoraRecordatorioAsc(habito.getId(),
                usuario.getId()).stream()
                .map(this::mapearRecordatorio)
                .collect(Collectors.toList());
    }

    @Override
    public RecordatorioResponse actualizarRecordatorio(Long recordatorioId, RecordatorioUpdateRequest request) {
        Usuario usuario = obtenerUsuarioAutenticado();

        Recordatorio recordatorio = recordatorioRepository.findByIdAndHabito_Usuario_Id(recordatorioId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recordatorio no encontrado"));

        Set<DiaSemana> dias = normalizarDias(request.getDias());

        if (recordatorioRepository.existsByHabito_IdAndHoraRecordatorioAndHabito_Usuario_IdAndIdNot(
                recordatorio.getHabito().getId(), request.getHoraRecordatorio(), usuario.getId(), recordatorioId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe un recordatorio configurado para esa hora");
        }

        recordatorio.setHoraRecordatorio(request.getHoraRecordatorio());
        recordatorio.setMensaje(normalizarMensaje(request.getMensaje()));
        if (request.getEstaActivo() != null) {
            recordatorio.setEstaActivo(request.getEstaActivo());
        }
        recordatorio.setFechaModificacion(OffsetDateTime.now());
        recordatorio.establecerDias(dias);

        return mapearRecordatorio(recordatorio);
    }

    @Override
    public void eliminarRecordatorio(Long recordatorioId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Recordatorio recordatorio = recordatorioRepository.findByIdAndHabito_Usuario_Id(recordatorioId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recordatorio no encontrado"));

        recordatorioRepository.delete(recordatorio);
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

    private Habito obtenerHabitoParaUsuario(Long habitoId, Long usuarioId) {
        return habitoRepository.findByIdAndUsuarioIdWithCategorias(habitoId, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hábito no encontrado"));
    }

    private Set<DiaSemana> normalizarDias(Set<DiaSemana> dias) {
        if (dias == null || dias.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Debe especificar al menos un día para el recordatorio");
        }

        EnumSet<DiaSemana> normalizados = EnumSet.noneOf(DiaSemana.class);
        dias.stream()
                .filter(Objects::nonNull)
                .forEach(normalizados::add);

        if (normalizados.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Debe especificar al menos un día para el recordatorio");
        }

        return normalizados;
    }

    private String normalizarMensaje(String mensaje) {
        if (!StringUtils.hasText(mensaje)) {
            return null;
        }
        return mensaje.trim();
    }

    private RecordatorioResponse mapearRecordatorio(Recordatorio recordatorio) {
        List<DiaSemana> dias = recordatorio.getDias().stream()
                .map(recordatorioDia -> recordatorioDia.getDia())
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingInt(Enum::ordinal))
                .collect(Collectors.toList());

        return RecordatorioResponse.builder()
                .id(recordatorio.getId())
                .habitoId(recordatorio.getHabito() != null ? recordatorio.getHabito().getId() : null)
                .horaRecordatorio(recordatorio.getHoraRecordatorio())
                .mensaje(recordatorio.getMensaje())
                .estaActivo(recordatorio.isEstaActivo())
                .fechaCreacion(recordatorio.getFechaCreacion())
                .fechaModificacion(recordatorio.getFechaModificacion())
                .dias(dias)
                .build();
    }
}
