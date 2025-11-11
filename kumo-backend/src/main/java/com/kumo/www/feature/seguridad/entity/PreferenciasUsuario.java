package com.kumo.www.feature.seguridad.entity;

import com.kumo.www.feature.seguridad.entity.enums.FormatoFecha;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.ColumnTransformer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "preferencias_usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PreferenciasUsuario {

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "usuario_id")
    private Long usuarioId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "zona_horaria", nullable = false, length = 100)
    private String zonaHoraria;

    // Usamos AttributeConverter para mapear etiquetas y ColumnTransformer para
    // castear a tipo Postgres
    @Column(name = "formato_fecha", nullable = false, columnDefinition = "formato_fecha")
    @ColumnTransformer(write = "?::formato_fecha")
    private FormatoFecha formatoFecha;
}
