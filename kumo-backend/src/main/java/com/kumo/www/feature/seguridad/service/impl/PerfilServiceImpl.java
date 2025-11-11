package com.kumo.www.feature.seguridad.service.impl;

import com.kumo.www.feature.seguridad.controller.dto.ActualizarPerfilRequest;
import com.kumo.www.feature.seguridad.controller.dto.PerfilResponse;
import com.kumo.www.feature.seguridad.entity.PreferenciasUsuario;
import com.kumo.www.feature.seguridad.entity.SolicitudEliminacion;
import com.kumo.www.feature.seguridad.entity.Usuario;
import com.kumo.www.feature.seguridad.entity.enums.EstadoUsuario;
import com.kumo.www.feature.seguridad.entity.enums.FormatoFecha;
import com.kumo.www.feature.seguridad.repository.PreferenciasUsuarioRepository;
import com.kumo.www.feature.seguridad.repository.SolicitudEliminacionRepository;
import com.kumo.www.feature.seguridad.repository.UsuarioRepository;
import com.kumo.www.feature.seguridad.service.PerfilService;
import jakarta.transaction.Transactional;
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
public class PerfilServiceImpl implements PerfilService {

    private static final int DIAS_PROGRAMACION_ELIMINACION = 14;

    private final UsuarioRepository usuarioRepository;
    private final PreferenciasUsuarioRepository preferenciasUsuarioRepository;
    private final SolicitudEliminacionRepository solicitudEliminacionRepository;

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public PerfilResponse obtenerPerfilActual() {
        Usuario usuario = obtenerUsuarioAutenticado();
        return mapearPerfil(usuario);
    }

    @Override
    public PerfilResponse actualizarPerfilActual(ActualizarPerfilRequest request) {
        Usuario usuario = obtenerUsuarioAutenticado();

        usuario.setNombre(normalizarNombre(request.getNombre()));
        usuario.setAvatarUrl(StringUtils.hasText(request.getAvatarUrl()) ? request.getAvatarUrl().trim() : null);
        usuario.setFechaModificacion(OffsetDateTime.now());

        PreferenciasUsuario preferencias = Optional.ofNullable(usuario.getPreferencias())
                .orElseGet(() -> crearPreferenciasPorDefecto(usuario));

        if (StringUtils.hasText(request.getZonaHoraria())) {
            preferencias.setZonaHoraria(request.getZonaHoraria().trim());
        }
        if (request.getFormatoFecha() != null) {
            preferencias.setFormatoFecha(request.getFormatoFecha());
        }

        preferenciasUsuarioRepository.save(preferencias);
        Usuario actualizado = usuarioRepository.save(usuario);
        return mapearPerfil(actualizado);
    }

    @Override
    public void solicitarEliminacionCuenta() {
        Usuario usuario = obtenerUsuarioAutenticado();

        if (usuario.getEstado() == EstadoUsuario.ELIMINACION_PROGRAMADA) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe una eliminación programada para esta cuenta");
        }

        OffsetDateTime ahora = OffsetDateTime.now();
        SolicitudEliminacion solicitud = SolicitudEliminacion.builder()
                .usuario(usuario)
                .fechaSolicitud(ahora)
                .fechaEjecucionProgramada(ahora.plusDays(DIAS_PROGRAMACION_ELIMINACION))
                .build();

        solicitudEliminacionRepository.save(solicitud);
        usuario.setEstado(EstadoUsuario.ELIMINACION_PROGRAMADA);
        usuario.setFechaModificacion(ahora);
        usuarioRepository.save(usuario);
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

    private PreferenciasUsuario crearPreferenciasPorDefecto(Usuario usuario) {
        PreferenciasUsuario preferencias = PreferenciasUsuario.builder()
                .usuarioId(usuario.getId())
                .usuario(usuario)
                .zonaHoraria("UTC")
                .formatoFecha(FormatoFecha.DD_MM_AAAA)
                .build();
        usuario.setPreferencias(preferencias);
        return preferencias;
    }

    private PerfilResponse mapearPerfil(Usuario usuario) {
        PreferenciasUsuario preferencias = usuario.getPreferencias();
        List<String> roles = usuario.getRoles().stream()
                .map(userRol -> userRol.getRol())
                .filter(rol -> rol != null && StringUtils.hasText(rol.getNombre()))
                .map(rol -> rol.getNombre())
                .collect(Collectors.toList());

        return PerfilResponse.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .avatarUrl(usuario.getAvatarUrl())
                .zonaHoraria(preferencias != null ? preferencias.getZonaHoraria() : null)
                .formatoFecha(preferencias != null ? preferencias.getFormatoFecha() : null)
                .estado(usuario.getEstado())
                .roles(roles)
                .build();
    }
}
