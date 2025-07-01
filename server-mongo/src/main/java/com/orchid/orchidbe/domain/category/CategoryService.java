package com.orchid.orchidbe.domain.category;

import java.util.List;

public interface CategoryService {

    List<Category> getAll();
    Category getById(String id);
    void save(CategoryDTO.CategoryReq category);
    void update(String id, CategoryDTO.CategoryReq category);
    void delete(String id);


}
