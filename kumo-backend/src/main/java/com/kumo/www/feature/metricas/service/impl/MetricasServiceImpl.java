package com.kumo.www.feature.metricas.service.impl;

import com.kumo.www.feature.habitos.entity.Habito;
import com.kumo.www.feature.habitos.repository.HabitoRepository;
import com.kumo.www.feature.metricas.entity.HabitoMetricasCalculadas;
import com.kumo.www.feature.metricas.repository.HabitoMetricasCalculadasRepository;
import com.kumo.www.feature.metricas.service.MetricasService;
import com.kumo.www.feature.seguimiento.entity.RegistroDiario;
import com.kumo.www.feature.seguimiento.repository.RegistroDiarioRepository;
import com.kumo.www.feature.seguridad.entity.Usuario;
import com.kumo.www.feature.seguridad.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class MetricasServiceImpl implements MetricasService {

    private final HabitoMetricasCalculadasRepository habitoMetricasCalculadasRepository;
    private final HabitoRepository habitoRepository;
    private final RegistroDiarioRepository registroDiarioRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public void recalcularMetricas(Long habitoId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = obtenerHabitoParaUsuario(habitoId, usuario.getId());
        recalcularMetricasParaHabito(habito);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public HabitoMetricasCalculadas obtenerMetricas(Long habitoId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Habito habito = obtenerHabitoParaUsuario(habitoId, usuario.getId());

        return habitoMetricasCalculadasRepository
                .findByHabito_IdAndHabito_Usuario_Id(habito.getId(), usuario.getId())
                .orElseGet(() -> {
                    recalcularMetricasParaHabito(habito);
                    return habitoMetricasCalculadasRepository
                            .findByHabito_IdAndHabito_Usuario_Id(habito.getId(), usuario.getId())
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                    "No se pudieron calcular las métricas"));
                });
    }

    private void recalcularMetricasParaHabito(Habito habito) {
        List<RegistroDiario> registros = registroDiarioRepository
                .findByHabito_IdOrderByFechaRegistroDesc(habito.getId());

        BigDecimal totalValor = registros.stream()
                .map(RegistroDiario::getValorRegistrado)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        int totalDiasCumplidos = (int) registros.stream()
                .filter(RegistroDiario::isEstaCumplido)
                .count();

        int rachaMasLarga = calcularRachaMasLarga(registros);

        HabitoMetricasCalculadas metricas = habitoMetricasCalculadasRepository.findById(habito.getId())
                .orElseGet(() -> HabitoMetricasCalculadas.builder()
                        .habito(habito)
                        .habitoId(habito.getId())
                        .build());

        metricas.setHabito(habito);
        metricas.setRachaMasLarga(rachaMasLarga);
        metricas.setTotalDiasCumplidos(totalDiasCumplidos);
        metricas.setTotalValorAcumulado(totalValor);
        metricas.setFechaUltimaActualizacion(OffsetDateTime.now());

        habitoMetricasCalculadasRepository.save(metricas);
    }

    private int calcularRachaMasLarga(List<RegistroDiario> registros) {
        if (registros.isEmpty()) {
            return 0;
        }

        List<RegistroDiario> ordenados = new ArrayList<>(registros);
        ordenados.sort(Comparator.comparing(RegistroDiario::getFechaRegistro));

        int rachaActual = 0;
        int rachaMaxima = 0;
        LocalDate ultimaFechaCumplida = null;

        for (RegistroDiario registro : ordenados) {
            if (!registro.isEstaCumplido()) {
                rachaActual = 0;
                ultimaFechaCumplida = null;
                continue;
            }

            LocalDate fecha = registro.getFechaRegistro();
            if (ultimaFechaCumplida != null && fecha.equals(ultimaFechaCumplida.plusDays(1))) {
                rachaActual++;
            } else {
                rachaActual = 1;
            }

            ultimaFechaCumplida = fecha;
            rachaMaxima = Math.max(rachaMaxima, rachaActual);
        }

        return rachaMaxima;
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
