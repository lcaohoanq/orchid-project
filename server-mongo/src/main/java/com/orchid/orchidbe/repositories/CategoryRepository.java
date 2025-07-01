package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.domain.category.Category;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface CategoryRepository extends MongoRepository<Category, String> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, String id);
}
