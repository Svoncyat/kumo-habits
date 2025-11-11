package com.kumo.www.feature.seguridad.controller.dto;

import com.kumo.www.feature.seguridad.entity.enums.EstadoUsuario;
import com.kumo.www.feature.seguridad.entity.enums.FormatoFecha;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilResponse {

    private Long id;
    private String nombre;
    private String email;
    private String avatarUrl;
    private String zonaHoraria;
    private FormatoFecha formatoFecha;
    private EstadoUsuario estado;
    private List<String> roles;
}
