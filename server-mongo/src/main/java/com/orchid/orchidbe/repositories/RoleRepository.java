package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.domain.role.Role;
import com.orchid.orchidbe.domain.role.Role.RoleName;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface RoleRepository extends MongoRepository<Role, String> {

    boolean existsByName(RoleName name);
    Optional<Role> findByName(RoleName name);

}