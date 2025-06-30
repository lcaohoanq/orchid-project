package com.orchid.orchidbe.domain.orchid;

import com.orchid.orchidbe.apis.MyApiResponse;
import com.orchid.orchidbe.domain.orchid.OrchidDTO.OrchidRes;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/orchids")
@RequiredArgsConstructor
@Tag(name = "orchids", description = "Operation related to Orchid")
public class OrchidController {

    private final OrchidService orchidService;

    @PostMapping("")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<MyApiResponse<OrchidRes>> createOrchid(
        @Valid @RequestBody OrchidDTO.OrchidReq orchid
    ) {
        return MyApiResponse.created(orchidService.add(orchid));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<MyApiResponse<Void>> updateOrchid(
        @PathVariable("id") Long id,
        @Valid @RequestBody OrchidDTO.OrchidReq orchid
    ) {
        orchidService.update(id, orchid);
        return MyApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<?> deleteOrchid(@PathVariable("id") Long id) {
        orchidService.deleteById(id);
        return MyApiResponse.success();
    }

}
