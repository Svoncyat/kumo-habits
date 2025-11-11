package com.kumo.www.feature.habitos.repository;

import com.kumo.www.feature.habitos.entity.Categoria;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByUsuario_Id(Long usuarioId);

    List<Categoria> findByIdInAndUsuario_Id(Collection<Long> categoriaIds, Long usuarioId);

    Optional<Categoria> findByIdAndUsuario_Id(Long id, Long usuarioId);

    boolean existsByUsuario_IdAndNombreIgnoreCase(Long usuarioId, String nombre);
}
