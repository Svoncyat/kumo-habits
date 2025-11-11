package com.kumo.www.feature.recordatorios.service;

import com.kumo.www.feature.recordatorios.entity.Recordatorio;
import com.kumo.www.feature.recordatorios.entity.RegistroNotificacion;
import com.kumo.www.feature.recordatorios.entity.enums.DiaSemana;
import com.kumo.www.feature.recordatorios.repository.RecordatorioRepository;
import com.kumo.www.feature.recordatorios.repository.RegistroNotificacionRepository;
import com.kumo.www.feature.seguimiento.entity.RegistroDiario;
import com.kumo.www.feature.seguimiento.repository.RegistroDiarioRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProgramadorRecordatoriosService {

    private static final ZoneId ZONA_LIMA = ZoneId.of("America/Lima");
    private static final Map<DayOfWeek, DiaSemana> DIA_SEMANA_MAP = construirMapaDias();

    private final RecordatorioRepository recordatorioRepository;
    private final RegistroDiarioRepository registroDiarioRepository;
    private final RegistroNotificacionRepository registroNotificacionRepository;

    @Scheduled(cron = "0 * * * * *", zone = "America/Lima")
    public void procesarRecordatoriosPendientes() {
        OffsetDateTime ahora = OffsetDateTime.now(ZONA_LIMA);
        LocalTime horaActual = ahora.toLocalTime().withSecond(0).withNano(0);
        DiaSemana diaActual = DIA_SEMANA_MAP.get(ahora.getDayOfWeek());

        if (diaActual == null) {
            log.warn("No se pudo determinar el dia de la semana para {}", ahora);
            return;
        }

        List<Recordatorio> recordatorios = recordatorioRepository.findActivosPorHoraYDia(horaActual, diaActual);
        if (recordatorios.isEmpty()) {
            return;
        }

        LocalDate fechaActual = ahora.toLocalDate();
        OffsetDateTime inicioMinuto = ahora.withSecond(0).withNano(0);
        OffsetDateTime finMinuto = inicioMinuto.plusMinutes(1).minusNanos(1);

        for (Recordatorio recordatorio : recordatorios) {
            if (recordatorio.getHabito() == null || recordatorio.getHabito().getUsuario() == null) {
                continue;
            }

            Optional<RegistroDiario> registroDelDia = registroDiarioRepository
                    .findByHabito_IdAndFechaRegistro(recordatorio.getHabito().getId(), fechaActual);

            boolean habitoCumplido = registroDelDia.map(RegistroDiario::isEstaCumplido).orElse(false);
            if (habitoCumplido) {
                continue;
            }

            boolean yaRegistrado = registroNotificacionRepository.existsByRecordatorio_IdAndFechaDisparoBetween(
                    recordatorio.getId(), inicioMinuto, finMinuto);
            if (yaRegistrado) {
                continue;
            }

            RegistroNotificacion notificacion = RegistroNotificacion.builder()
                    .recordatorio(recordatorio)
                    .usuario(recordatorio.getHabito().getUsuario())
                    .fechaDisparo(ahora)
                    .build();
            registroNotificacionRepository.save(notificacion);
        }
    }

    private static Map<DayOfWeek, DiaSemana> construirMapaDias() {
        Map<DayOfWeek, DiaSemana> mapa = new EnumMap<>(DayOfWeek.class);
        mapa.put(DayOfWeek.MONDAY, DiaSemana.LUNES);
        mapa.put(DayOfWeek.TUESDAY, DiaSemana.MARTES);
        mapa.put(DayOfWeek.WEDNESDAY, DiaSemana.MIERCOLES);
        mapa.put(DayOfWeek.THURSDAY, DiaSemana.JUEVES);
        mapa.put(DayOfWeek.FRIDAY, DiaSemana.VIERNES);
        mapa.put(DayOfWeek.SATURDAY, DiaSemana.SABADO);
        mapa.put(DayOfWeek.SUNDAY, DiaSemana.DOMINGO);
        return mapa;
    }
}
