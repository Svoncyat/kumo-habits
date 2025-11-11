package com.kumo.www.feature.seguridad.entity;

import com.kumo.www.feature.seguridad.entity.enums.EstadoUsuario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios", indexes = {
        @Index(name = "idx_usuarios_email", columnList = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "nombre", length = 100)
    private String nombre;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "clave_hash", nullable = false, length = 255)
    private String claveHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 50)
    private EstadoUsuario estado;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    private OffsetDateTime fechaModificacion;

    @OneToOne(mappedBy = "usuario")
    private PreferenciasUsuario preferencias;

    @Builder.Default
    @OneToMany(mappedBy = "usuario")
    private Set<UsuarioRol> roles = new HashSet<>();
}
