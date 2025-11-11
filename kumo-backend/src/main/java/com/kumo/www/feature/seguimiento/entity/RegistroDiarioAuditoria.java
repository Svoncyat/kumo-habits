package com.kumo.www.feature.seguimiento.entity;

import com.kumo.www.feature.habitos.entity.Habito;
import com.kumo.www.feature.seguridad.entity.Usuario;
import com.kumo.www.shared.enums.TipoOperacionAuditoria;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "registros_diarios_auditoria", indexes = {
        @Index(name = "idx_auditoria_habito_id", columnList = "habito_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class RegistroDiarioAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_operacion", nullable = false, length = 20)
    private TipoOperacionAuditoria tipoOperacion;

    @Column(name = "registro_id")
    private Long registroId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habito_id", nullable = false)
    private Habito habito;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_modificador_id", nullable = false)
    private Usuario usuarioModificador;

    @Column(name = "fecha_registro_auditada")
    private LocalDate fechaRegistroAuditada;

    @Column(name = "valor_anterior", precision = 10, scale = 2)
    private BigDecimal valorAnterior;

    @Column(name = "esta_cumplido_anterior")
    private Boolean estaCumplidoAnterior;

    @Column(name = "valor_nuevo", precision = 10, scale = 2)
    private BigDecimal valorNuevo;

    @Column(name = "esta_cumplido_nuevo")
    private Boolean estaCumplidoNuevo;

    @Column(name = "fecha_operacion", nullable = false)
    private OffsetDateTime fechaOperacion;
}
