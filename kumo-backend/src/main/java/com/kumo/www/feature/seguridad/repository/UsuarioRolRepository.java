package com.kumo.www.feature.seguridad.repository;

import com.kumo.www.feature.seguridad.entity.UsuarioRol;
import com.kumo.www.feature.seguridad.entity.id.UsuarioRolId;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRolRepository extends JpaRepository<UsuarioRol, UsuarioRolId> {

    Set<UsuarioRol> findByUsuario_Id(Long usuarioId);
}
