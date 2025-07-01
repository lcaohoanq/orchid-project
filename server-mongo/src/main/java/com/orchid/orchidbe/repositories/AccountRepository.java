package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.domain.account.Account;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface AccountRepository extends MongoRepository<Account, String> {

    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, String id);
    Optional<Account> findByEmail(String email);


}
