package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.domain.token.Token;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface TokenRepository extends MongoRepository<Token, String> {

    List<Token> findByAccountId(String accountId);

    Optional<Token> findByToken(String token);

    Optional<Token> findByRefreshToken(String token);

}
