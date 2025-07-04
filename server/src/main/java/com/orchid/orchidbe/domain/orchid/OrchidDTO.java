package com.orchid.orchidbe.domain.orchid;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public interface OrchidDTO {

    record OrchidReq(
        boolean isNatural,
        String description,

        @NotBlank(message = "Name is not blank")
        String name,
        String url,

        @Min(value = 0, message = "Price must be greater than or equal to 0")
        @Max(value = 1000000000, message = "Price must be less than or equal to 1,000,000,000")
        Double price,

        @NotNull(message = "Category ID cannot be null")
        Long categoryId
    ) {

    }

    record OrchidRes(
        Long id,
        boolean isNatural,
        String description,
        String name,
        String url,
        Double price,
        Long categoryId
    ) {

    }

}
