package com.orchid.orchidbe.domain.order;

import com.orchid.orchidbe.domain.orchid.Orchid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "order_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetail {

    @Id
    private String id;
    private Double price;
    private Integer quantity;
    private String orchidId;
    private String orderId;

}
