package com.orchid.orchidbe.domain.order;

import com.orchid.orchidbe.domain.account.Account;
import com.orchid.orchidbe.domain.order.OrderDTO.OrderRes;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    private String id;

    private Double totalAmount;

    private Date orderDate;

    private OrderStatus orderStatus;

    private String accountId;

    public enum OrderStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        CANCELLED,
    }

    public static OrderRes fromEntity(Order order) {
        return new OrderRes(
            order.getId(),
            order.getTotalAmount(),
            order.getOrderDate(),
            order.getOrderStatus(),
            order.getAccountId()
        );
    }

    public static Order toEntity(OrderDTO.OrderReq orderReq, Account account) {
        return Order.builder()
            .totalAmount(orderReq.totalAmount())
            .orderDate(orderReq.orderDate())
            .orderStatus(orderReq.orderStatus())
            .accountId(account.getId())
            .build();
    }

}

