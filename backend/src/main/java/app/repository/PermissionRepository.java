package app.repository;

import app.model.Permission;
import app.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    @Transactional(readOnly = true)
    @Query("SELECT p FROM Permission p JOIN RolePermission rp ON rp.permission = p " +
            "WHERE rp.role = :role AND p.name = :permission")
    Permission checkPermissionForRole(@Param("role")Role role, @Param("permission") String permission);
}
