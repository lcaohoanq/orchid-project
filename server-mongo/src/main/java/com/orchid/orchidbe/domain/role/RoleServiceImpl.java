package com.orchid.orchidbe.domain.role;

import com.orchid.orchidbe.domain.role.Role.RoleName;
import com.orchid.orchidbe.domain.role.RoleDTO.RoleReq;
import com.orchid.orchidbe.repositories.RoleRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public List<Role> getAll() {
        return roleRepository.findAll();
    }

    @Override
    public Role getById(String id) {
        return roleRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));
    }

    @Override
    public Role getByName(RoleName name) {
        return roleRepository.findByName(name)
            .orElseThrow(() -> new IllegalArgumentException("Role with name " + name + " not found"));
    }

    @Override
    public void add(RoleReq role) {
        RoleName newName = role.name();
        if (roleRepository.existsByName(newName)) {
            throw new IllegalArgumentException("Role with name " + newName + " already exists");
        }

        roleRepository.save(new Role(newName));
    }

    @Override
    @Transactional
    public void update(String id, RoleDTO.RoleReq role) {
        var existingRole = getById(id);
        RoleName newName = role.name();

        if (existingRole.getName() != newName) {

            log.info("Updating role with id {}: name changed from {} to {}", id, existingRole.getName(), newName);
            existingRole.setName(newName);
            roleRepository.save(existingRole);
        }
    }


    @Override
    @Transactional
    public void delete(String id) {
        var existingRole = getById(id);
        roleRepository.delete(existingRole);
    }
}
