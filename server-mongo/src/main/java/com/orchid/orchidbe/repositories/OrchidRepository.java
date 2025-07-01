package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.domain.orchid.Orchid;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface OrchidRepository extends MongoRepository<Orchid, String> {
    boolean existsByName(String name);
}
