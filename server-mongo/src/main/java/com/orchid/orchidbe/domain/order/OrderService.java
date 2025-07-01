package com.orchid.orchidbe.domain.order;

import com.orchid.orchidbe.domain.order.OrderDTO.OrderRes;
import java.util.List;

public interface OrderService {

    List<OrderDTO.OrderRes> getAll();
    OrderRes getById(String id);
    void add(OrderDTO.OrderReq order);
    void update(String id, OrderDTO.OrderReq order);
    void delete(String id);
    List<OrderDTO.OrderRes> getByUserId(String userId);

}
