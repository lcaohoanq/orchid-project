package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.domain.order.OrderDetail;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface OrderDetailRepository extends MongoRepository<OrderDetail, String> {

}
