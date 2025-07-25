package com.orchid.orchidbe.domain.category;

import com.orchid.orchidbe.apis.MyApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/categories")
@RequiredArgsConstructor
@Tag(name = "categories", description = "Operations related to Categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("")
    @Operation(summary = "Create new category", description = "Creates a new category")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Category created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or category name already exists")
    })
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<MyApiResponse<Object>> createCategory(
        @Valid @RequestBody CategoryDTO.CategoryReq categoryReq
    ) {
        categoryService.save(categoryReq);
        return MyApiResponse.created();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update category", description = "Updates an existing category by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Category updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or category name already exists"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<MyApiResponse<Object>> updateCategory(
        @PathVariable Long id,
        @Valid @RequestBody CategoryDTO.CategoryReq categoryReq
    ) {
        categoryService.update(id, categoryReq);
        return MyApiResponse.updated();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category", description = "Deletes a category by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Category deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<MyApiResponse<Object>> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return MyApiResponse.noContent();
    }
}