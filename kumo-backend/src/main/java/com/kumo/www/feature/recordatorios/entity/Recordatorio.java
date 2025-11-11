package com.kumo.www.feature.recordatorios.entity;

import com.kumo.www.feature.habitos.entity.Habito;
import com.kumo.www.feature.recordatorios.entity.enums.DiaSemana;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recordatorios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Recordatorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habito_id", nullable = false)
    private Habito habito;

    @Column(name = "hora_recordatorio", nullable = false)
    private LocalTime horaRecordatorio;

    @Column(name = "mensaje", columnDefinition = "TEXT")
    private String mensaje;

    @Builder.Default
    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo = true;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    private OffsetDateTime fechaModificacion;

    @OneToMany(mappedBy = "recordatorio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @Setter(AccessLevel.NONE)
    private Set<RecordatorioDia> dias = new HashSet<>();

    public void establecerDias(Set<DiaSemana> diasSemana) {
        if (this.dias == null) {
            this.dias = new HashSet<>();
        }
        this.dias.clear();
        if (diasSemana == null || diasSemana.isEmpty()) {
            return;
        }

        diasSemana.stream()
                .filter(Objects::nonNull)
                .distinct()
                .forEach(dia -> {
                    RecordatorioDia recordatorioDia = new RecordatorioDia();
                    recordatorioDia.setRecordatorio(this);
                    recordatorioDia.setDia(dia);
                    this.dias.add(recordatorioDia);
                });
    }
}
