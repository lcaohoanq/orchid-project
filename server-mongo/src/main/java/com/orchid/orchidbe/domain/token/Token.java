package com.orchid.orchidbe.domain.token;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.orchid.orchidbe.domain.account.Account;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tokens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonPropertyOrder({"id", "token", "refreshToken", "tokenType", "expirationDate",
    "refreshExpirationDate", "isMobile", "revoked", "expired", "accountId"})
public class Token {

    @Id
    private String id;

    private String token;
    private String refreshToken;
    private String tokenType;
    private LocalDateTime expirationDate;
    private LocalDateTime refreshExpirationDate;
    private boolean isMobile;
    private boolean revoked;
    private boolean expired;

    private String accountId;

}
