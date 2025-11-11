package com.kumo.www.feature.recordatorios.entity.id;

import com.kumo.www.feature.recordatorios.entity.enums.DiaSemana;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class RecordatorioDiaId implements Serializable {

    @Column(name = "recordatorio_id")
    private Long recordatorioId;

    @Enumerated(EnumType.STRING)
    @Column(name = "dia")
    private DiaSemana dia;

    public RecordatorioDiaId() {
    }

    public RecordatorioDiaId(Long recordatorioId, DiaSemana dia) {
        this.recordatorioId = recordatorioId;
        this.dia = dia;
    }

    public Long getRecordatorioId() {
        return recordatorioId;
    }

    public void setRecordatorioId(Long recordatorioId) {
        this.recordatorioId = recordatorioId;
    }

    public DiaSemana getDia() {
        return dia;
    }

    public void setDia(DiaSemana dia) {
        this.dia = dia;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RecordatorioDiaId that = (RecordatorioDiaId) o;
        return Objects.equals(recordatorioId, that.recordatorioId)
                && dia == that.dia;
    }

    @Override
    public int hashCode() {
        return Objects.hash(recordatorioId, dia);
    }
}
