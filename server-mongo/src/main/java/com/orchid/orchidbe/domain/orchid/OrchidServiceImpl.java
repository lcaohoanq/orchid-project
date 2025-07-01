package com.orchid.orchidbe.domain.orchid;

import com.orchid.orchidbe.domain.category.CategoryService;
import com.orchid.orchidbe.repositories.OrchidRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrchidServiceImpl implements OrchidService {

    private final OrchidRepository orchidRepository;
    private final CategoryService categoryService;

    @Override
    public List<OrchidDTO.OrchidRes> getAll() {
        return orchidRepository.findAll().stream().map(Orchid::from).toList();
    }

    @Override
    public OrchidDTO.OrchidRes getById(String id) {
        var orchid = orchidRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Orchid not found with id: " + id));
        return Orchid.from(orchid);
    }

    @Override
    public OrchidDTO.OrchidRes add(OrchidDTO.OrchidReq orchidDto) {
        if (orchidRepository.existsByName(orchidDto.name())) {
            throw new IllegalArgumentException("Orchid with this name already exists");
        }

        var orchid = Orchid.toEntity(orchidDto);
        var saved = orchidRepository.save(orchid);
        return Orchid.from(saved);
    }

    @Override
    public void update(String id, OrchidDTO.OrchidReq orchidDto) {
        var orchid = orchidRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Orchid not found with id: " + id));

        orchid.setNatural(orchidDto.isNatural());
        orchid.setDescription(orchidDto.description());
        orchid.setName(orchidDto.name());
        orchid.setUrl(orchidDto.url());
        orchid.setPrice(orchidDto.price());
        orchid.setCategoryId(orchidDto.categoryId());

        orchidRepository.save(orchid);
    }

    @Override
    public void deleteById(String id) {
        var orchid = orchidRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Orchid not found with id: " + id));
        orchidRepository.delete(orchid);
    }
}
