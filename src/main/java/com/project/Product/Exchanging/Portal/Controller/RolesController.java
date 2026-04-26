package com.project.Product.Exchanging.Portal.Controller;

import com.project.Product.Exchanging.Portal.Model.Roles;
import com.project.Product.Exchanging.Portal.Service.RolesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolesController {

    private final RolesService rolesService;

    @GetMapping
    public ResponseEntity<List<Roles>> getAllRoles() {
        return ResponseEntity.ok(rolesService.getAllRoles());
    }

    @PostMapping
    public ResponseEntity<Roles> createRole(@RequestBody Roles role) {
        return ResponseEntity.ok(rolesService.createRole(role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        rolesService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}