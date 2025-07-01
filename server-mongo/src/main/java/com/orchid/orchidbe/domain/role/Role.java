package com.orchid.orchidbe.domain.role;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Schema(description = "User roles")
    public enum RoleName {
        @Schema(description = "Staff role") STAFF,
        @Schema(description = "Normal user") USER,
        @Schema(description = "Manager role") MANAGER,
        @Schema(description = "Admin role") ADMIN
    }

    @Id
    @JsonProperty("id")
    private String id;

    private RoleName name;

    public Role(RoleName name) {
        this.name = name;
    }
}
