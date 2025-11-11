package com.kumo.www.feature.recordatorios.entity;

import com.kumo.www.feature.recordatorios.entity.enums.DiaSemana;
import com.kumo.www.feature.recordatorios.entity.id.RecordatorioDiaId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recordatorio_dias")
@Getter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class RecordatorioDia {

    @EmbeddedId
    @EqualsAndHashCode.Include
    private RecordatorioDiaId id = new RecordatorioDiaId();

    @MapsId("recordatorioId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recordatorio_id", nullable = false)
    private Recordatorio recordatorio;

    public RecordatorioDia(Recordatorio recordatorio, DiaSemana dia) {
        this.recordatorio = recordatorio;
        this.id = new RecordatorioDiaId(recordatorio != null ? recordatorio.getId() : null, dia);
    }

    public DiaSemana getDia() {
        return id != null ? id.getDia() : null;
    }

    public void setDia(DiaSemana dia) {
        if (id == null) {
            id = new RecordatorioDiaId();
        }
        id.setDia(dia);
    }

    public void setRecordatorio(Recordatorio recordatorio) {
        this.recordatorio = recordatorio;
        if (recordatorio != null) {
            if (id == null) {
                id = new RecordatorioDiaId();
            }
            id.setRecordatorioId(recordatorio.getId());
        }
    }
}
