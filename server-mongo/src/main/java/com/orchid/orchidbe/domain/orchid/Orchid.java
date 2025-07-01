package com.orchid.orchidbe.domain.orchid;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.orchid.orchidbe.domain.orchid.OrchidDTO.OrchidRes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orchids")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orchid {


    @Id
    private String id;

    private boolean isNatural;

    private String description;

    @JsonProperty("orchidName")
    private String name;

    @JsonProperty("image")
    private String url;

    private Double price;

    private String categoryId;

    public static OrchidRes from(Orchid orchid) {
        return new OrchidRes(
            orchid.getId(),
            orchid.isNatural(),
            orchid.getDescription(),
            orchid.getName(),
            orchid.getUrl(),
            orchid.getPrice(),
            orchid.getCategoryId()
        );
    }

    public static Orchid toEntity(OrchidDTO.OrchidReq dto) {
        return Orchid.builder()
            .isNatural(dto.isNatural())
            .description(dto.description())
            .name(dto.name())
            .url(dto.url() == null
                     ? "https://images.unsplash.com/photo-1610397648930-477b8c7f0943?q=80&w=730&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                     : dto.url()) // Ensure URL is not null
            .price(dto.price())
            .categoryId(dto.categoryId())
            .build();
    }

}
