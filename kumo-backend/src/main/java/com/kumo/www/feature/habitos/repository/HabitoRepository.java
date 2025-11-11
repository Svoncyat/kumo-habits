package com.kumo.www.feature.habitos.repository;

import com.kumo.www.feature.habitos.entity.Habito;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitoRepository extends JpaRepository<Habito, Long> {

    @Query("select distinct h from Habito h "
            + "left join fetch h.categorias hc "
            + "left join fetch hc.categoria "
            + "where h.usuario.id = :usuarioId "
            + "order by h.fechaCreacion desc")
    List<Habito> findAllWithCategoriasByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("select h from Habito h "
            + "left join fetch h.categorias hc "
            + "left join fetch hc.categoria "
            + "where h.id = :habitoId and h.usuario.id = :usuarioId")
    Optional<Habito> findByIdAndUsuarioIdWithCategorias(@Param("habitoId") Long habitoId,
            @Param("usuarioId") Long usuarioId);

    boolean existsByUsuario_IdAndNombreIgnoreCase(Long usuarioId, String nombre);

    boolean existsByUsuario_IdAndNombreIgnoreCaseAndIdNot(Long usuarioId, String nombre, Long habitoId);
}
