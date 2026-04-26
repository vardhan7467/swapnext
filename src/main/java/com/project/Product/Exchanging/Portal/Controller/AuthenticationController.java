package com.project.Product.Exchanging.Portal.Controller;

import com.project.Product.Exchanging.Portal.DTO.LoginRequest;
import com.project.Product.Exchanging.Portal.DTO.LoginResponse;
import com.project.Product.Exchanging.Portal.Service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthenticationController {

    private final AuthenticationService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}   