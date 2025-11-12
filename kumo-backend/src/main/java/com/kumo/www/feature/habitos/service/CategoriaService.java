package com.kumo.www.feature.habitos.service;

import com.kumo.www.feature.habitos.controller.dto.CategoriaResponse;
import java.util.List;

public interface CategoriaService {

    List<CategoriaResponse> obtenerCategoriasDelUsuario();
}
