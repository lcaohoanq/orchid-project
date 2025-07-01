package com.orchid.orchidbe.domain.orchid;

import com.orchid.orchidbe.domain.orchid.OrchidDTO.OrchidReq;
import java.util.List;

public interface OrchidService {

    List<OrchidDTO.OrchidRes> getAll();
    OrchidDTO.OrchidRes getById(String id);
    OrchidDTO.OrchidRes add(OrchidDTO.OrchidReq orchid);
    void update(String id, OrchidReq orchid);
    void deleteById(String id);

}
