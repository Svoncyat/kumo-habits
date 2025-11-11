package com.kumo.www.feature.seguridad.repository;

import com.kumo.www.feature.seguridad.entity.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmailIgnoreCase(String email);

    @Query("""
            select u
            from Usuario u
            left join fetch u.roles ur
            left join fetch ur.rol r
            where lower(u.email) = lower(:email)
            """)
    Optional<Usuario> findByEmailIgnoreCaseWithRoles(@Param("email") String email);

    boolean existsByEmailIgnoreCase(String email);
}
