package app.service;

import app.model.Permission;
import app.model.Role;
import app.model.User;
import app.repository.PermissionRepository;
import app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    @Autowired
    public PermissionService(PermissionRepository permissionRepository, UserRepository userRepository) {
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
    }

    public boolean checkPermission(String permission){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(((User)auth.getPrincipal()).getEmail());
        Role role = currentUser.getRole();

        Permission checkPermission = permissionRepository.checkPermissionForRole(role, permission);

        return checkPermission != null;
    }
}
