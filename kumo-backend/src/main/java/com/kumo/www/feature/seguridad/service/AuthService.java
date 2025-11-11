package com.kumo.www.feature.seguridad.service;

import com.kumo.www.feature.seguridad.controller.dto.AuthResponse;
import com.kumo.www.feature.seguridad.controller.dto.LoginRequest;
import com.kumo.www.feature.seguridad.controller.dto.RegistroUsuarioRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.kumo.www.feature.seguridad.entity.Usuario;
import com.kumo.www.feature.seguridad.entity.UsuarioRol;
import com.kumo.www.feature.seguridad.entity.PreferenciasUsuario;
import com.kumo.www.feature.seguridad.entity.Rol;
import com.kumo.www.feature.seguridad.entity.enums.EstadoUsuario;
import com.kumo.www.feature.seguridad.entity.enums.FormatoFecha;
import com.kumo.www.feature.seguridad.entity.id.UsuarioRolId;
import com.kumo.www.feature.seguridad.repository.UsuarioRepository;
import com.kumo.www.feature.seguridad.repository.UsuarioRolRepository;
import com.kumo.www.feature.seguridad.repository.RolRepository;
import com.kumo.www.feature.seguridad.repository.PreferenciasUsuarioRepository;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String DEFAULT_ROLE = "USUARIO";
    private static final String DEFAULT_ZONA_HORARIA = "UTC";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final PreferenciasUsuarioRepository preferenciasUsuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegistroUsuarioRequest request) {
        String emailNormalizado = normalizarEmail(request.getEmail());

        if (usuarioRepository.existsByEmailIgnoreCase(emailNormalizado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(normalizarNombre(request.getNombre()))
                .avatarUrl(StringUtils.hasText(request.getAvatarUrl()) ? request.getAvatarUrl().trim() : null)
                .email(emailNormalizado)
                .claveHash(passwordEncoder.encode(request.getPassword()))
                .estado(EstadoUsuario.ACTIVO)
                .fechaCreacion(OffsetDateTime.now())
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        Rol rolPorDefecto = rolRepository.findByNombreIgnoreCase(DEFAULT_ROLE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Rol por defecto no configurado"));

        UsuarioRol usuarioRol = UsuarioRol.builder()
                .id(new UsuarioRolId(usuarioGuardado.getId(), rolPorDefecto.getId()))
                .usuario(usuarioGuardado)
                .rol(rolPorDefecto)
                .build();
        usuarioRolRepository.save(usuarioRol);
        usuarioGuardado.getRoles().add(usuarioRol);

        PreferenciasUsuario preferencias = PreferenciasUsuario.builder()
                .usuarioId(usuarioGuardado.getId())
                .usuario(usuarioGuardado)
                .zonaHoraria(obtenerZonaHoraria(request))
                .formatoFecha(obtenerFormatoFecha(request))
                .build();
        preferenciasUsuarioRepository.save(preferencias);
        usuarioGuardado.setPreferencias(preferencias);

        UserDetails userDetails = userDetailsService.loadUserByUsername(usuarioGuardado.getEmail());
        String token = jwtService.generateToken(userDetails);

        return construirRespuestaToken(token);
    }

    public AuthResponse login(LoginRequest request) {
        String emailNormalizado = normalizarEmail(request.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(emailNormalizado, request.getPassword()));
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(emailNormalizado);
        if (userDetails instanceof Usuario usuario && usuario.getEstado() != EstadoUsuario.ACTIVO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "La cuenta no está activa");
        }

        String token = jwtService.generateToken(userDetails);
        return construirRespuestaToken(token);
    }

    private String normalizarEmail(String email) {
        return Optional.ofNullable(email)
                .map(String::trim)
                .map(String::toLowerCase)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El email es obligatorio"));
    }

    private String obtenerZonaHoraria(RegistroUsuarioRequest request) {
        return Optional.ofNullable(request.getZonaHoraria())
                .map(String::trim)
                .filter(StringUtils::hasText)
                .orElse(DEFAULT_ZONA_HORARIA);
    }

    private FormatoFecha obtenerFormatoFecha(RegistroUsuarioRequest request) {
        return Optional.ofNullable(request.getFormatoFecha())
                .orElse(FormatoFecha.DD_MM_AAAA);
    }

    private String normalizarNombre(String nombre) {
        return Optional.ofNullable(nombre)
                .map(String::trim)
                .filter(StringUtils::hasText)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio"));
    }

    private AuthResponse construirRespuestaToken(String token) {
        Instant expiracion = Instant.now().plus(jwtService.getExpirationDuration());
        return AuthResponse.builder()
                .token(token)
                .tipoToken("Bearer")
                .expiraEn(expiracion)
                .build();
    }
}
