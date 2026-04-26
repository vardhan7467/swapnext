package com.project.Product.Exchanging.Portal.Service;

import com.project.Product.Exchanging.Portal.Model.Roles;
import com.project.Product.Exchanging.Portal.Repository.RolesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolesService {

    private final RolesRepository rolesRepository;

    public List<Roles> getAllRoles() {
        return rolesRepository.findAll();
    }

    public Roles createRole(Roles role) {
        return rolesRepository.save(role);
    }

    public void deleteRole(Long id) {
        rolesRepository.deleteById(id);
    }
}