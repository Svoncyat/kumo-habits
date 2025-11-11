package com.kumo.www.feature.seguridad.repository;

import com.kumo.www.feature.seguridad.entity.SolicitudExportacion;
import com.kumo.www.feature.seguridad.entity.Usuario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudExportacionRepository extends JpaRepository<SolicitudExportacion, Long> {

    List<SolicitudExportacion> findByUsuarioOrderByFechaSolicitudDesc(Usuario usuario);
}
