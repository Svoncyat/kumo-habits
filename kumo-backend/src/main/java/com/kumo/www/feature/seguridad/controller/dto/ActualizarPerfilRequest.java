package com.kumo.www.feature.seguridad.controller.dto;

import com.kumo.www.feature.seguridad.entity.enums.FormatoFecha;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class ActualizarPerfilRequest {

    @NotBlank
    @Size(min = 3, max = 100)
    private String nombre;

    @Size(max = 500)
    private String avatarUrl;

    @Size(max = 100)
    private String zonaHoraria;

    private FormatoFecha formatoFecha;
}
