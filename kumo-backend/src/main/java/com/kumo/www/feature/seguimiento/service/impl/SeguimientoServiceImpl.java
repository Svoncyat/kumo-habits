package com.kumo.www.feature.seguimiento.service.impl;

import com.kumo.www.feature.habitos.entity.Habito;
import com.kumo.www.feature.habitos.repository.HabitoRepository;
import com.kumo.www.feature.seguimiento.controller.dto.RegistroRequest;
import com.kumo.www.feature.seguimiento.controller.dto.RegistroResponse;
import com.kumo.www.feature.seguimiento.entity.RegistroDiario;
import com.kumo.www.feature.seguimiento.entity.RegistroDiarioAuditoria;
import com.kumo.www.feature.seguimiento.repository.RegistroDiarioAuditoriaRepository;
import com.kumo.www.feature.seguimiento.repository.RegistroDiarioRepository;
import com.kumo.www.feature.seguimiento.service.SeguimientoService;
import com.kumo.www.feature.seguridad.entity.Usuario;
import com.kumo.www.feature.seguridad.repository.UsuarioRepository;
import com.kumo.www.shared.enums.TipoOperacionAuditoria;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
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
public class SeguimientoServiceImpl implements SeguimientoService {

    private final RegistroDiarioRepository registroDiarioRepository;
    private final RegistroDiarioAuditoriaRepository registroDiarioAuditoriaRepository;
    private final HabitoRepository habitoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public RegistroResponse guardarRegistro(RegistroRequest request) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = obtenerHabitoParaUsuario(request.getHabitoId(), usuario.getId());

        LocalDate fechaRegistro = request.getFechaRegistro();
        BigDecimal valorNormalizado = normalizarValor(request.getValorRegistrado());
        boolean estaCumplido = determinarCumplimiento(request.getEstaCumplido(), valorNormalizado, habito);
        OffsetDateTime ahora = OffsetDateTime.now();

        Optional<RegistroDiario> registroExistente = registroDiarioRepository
                .findByHabito_IdAndFechaRegistro(habito.getId(), fechaRegistro);

        RegistroDiario registro;
        TipoOperacionAuditoria tipoOperacion;
        BigDecimal valorAnterior = null;
        Boolean cumplidoAnterior = null;

        if (registroExistente.isPresent()) {
            registro = registroExistente.get();
            valorAnterior = registro.getValorRegistrado();
            cumplidoAnterior = registro.isEstaCumplido();

            registro.setValorRegistrado(valorNormalizado);
            registro.setEstaCumplido(estaCumplido);
            registro.setFechaUltimaModificacion(ahora);
            tipoOperacion = TipoOperacionAuditoria.MODIFICACION;
        } else {
            registro = RegistroDiario.builder()
                    .habito(habito)
                    .fechaRegistro(fechaRegistro)
                    .valorRegistrado(valorNormalizado)
                    .estaCumplido(estaCumplido)
                    .fechaCreacion(ahora)
                    .fechaUltimaModificacion(ahora)
                    .build();
            tipoOperacion = TipoOperacionAuditoria.INSERCION;
        }

        RegistroDiario guardado = registroDiarioRepository.save(registro);

        registrarAuditoria(tipoOperacion, guardado.getId(), habito, usuario, fechaRegistro, valorAnterior,
                cumplidoAnterior, guardado.getValorRegistrado(), guardado.isEstaCumplido(), ahora);

        return mapearRegistro(guardado);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<RegistroResponse> obtenerRegistrosPorHabito(Long habitoId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = obtenerHabitoParaUsuario(habitoId, usuario.getId());

        return registroDiarioRepository.findByHabito_IdOrderByFechaRegistroDesc(habito.getId()).stream()
                .map(this::mapearRegistro)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarRegistro(Long registroId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        RegistroDiario registro = registroDiarioRepository.findByIdAndHabito_Usuario_Id(registroId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro no encontrado"));

        Habito habito = registro.getHabito();
        OffsetDateTime ahora = OffsetDateTime.now();

        registrarAuditoria(TipoOperacionAuditoria.ELIMINACION, registro.getId(), habito, usuario,
                registro.getFechaRegistro(), registro.getValorRegistrado(), registro.isEstaCumplido(), null, null,
                ahora);

        registroDiarioRepository.delete(registro);
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

    private BigDecimal normalizarValor(BigDecimal valor) {
        return Optional.ofNullable(valor)
                .map(v -> v.setScale(2, RoundingMode.HALF_UP))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El valor es obligatorio"));
    }

    private boolean determinarCumplimiento(Boolean solicitado, BigDecimal valor, Habito habito) {
        if (solicitado != null) {
            return solicitado;
        }
        if (habito.getMetaDiaria() == null) {
            return false;
        }
        BigDecimal meta = habito.getMetaDiaria();
        return valor.compareTo(meta) >= 0;
    }

    private void registrarAuditoria(TipoOperacionAuditoria tipoOperacion, Long registroId, Habito habito,
            Usuario usuario, LocalDate fechaRegistro, BigDecimal valorAnterior, Boolean cumplidoAnterior,
            BigDecimal valorNuevo, Boolean cumplidoNuevo, OffsetDateTime fechaOperacion) {

        RegistroDiarioAuditoria auditoria = RegistroDiarioAuditoria.builder()
                .tipoOperacion(tipoOperacion)
                .registroId(registroId)
                .habito(habito)
                .usuarioModificador(usuario)
                .fechaRegistroAuditada(fechaRegistro)
                .valorAnterior(valorAnterior)
                .estaCumplidoAnterior(cumplidoAnterior)
                .valorNuevo(valorNuevo)
                .estaCumplidoNuevo(cumplidoNuevo)
                .fechaOperacion(fechaOperacion)
                .build();
        registroDiarioAuditoriaRepository.save(auditoria);
    }

    private RegistroResponse mapearRegistro(RegistroDiario registro) {
        Habito habito = registro.getHabito();
        String nombreHabito = null;
        if (habito != null && StringUtils.hasText(habito.getNombre())) {
            nombreHabito = habito.getNombre();
        }

        return RegistroResponse.builder()
                .id(registro.getId())
                .habitoId(habito != null ? habito.getId() : null)
                .habitoNombre(nombreHabito)
                .fechaRegistro(registro.getFechaRegistro())
                .valorRegistrado(registro.getValorRegistrado())
                .estaCumplido(registro.isEstaCumplido())
                .fechaCreacion(registro.getFechaCreacion())
                .fechaUltimaModificacion(registro.getFechaUltimaModificacion())
                .build();
    }
}
