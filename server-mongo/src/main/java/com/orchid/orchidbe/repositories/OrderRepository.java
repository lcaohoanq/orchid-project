package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.domain.order.Order;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByAccountId(String accountId);

}
