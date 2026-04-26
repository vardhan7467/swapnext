package com.project.Product.Exchanging.Portal.Controller;

import com.project.Product.Exchanging.Portal.DTO.CartDTO;
import com.project.Product.Exchanging.Portal.DTO.CartRequest;
import com.project.Product.Exchanging.Portal.Model.Cart;
import com.project.Product.Exchanging.Portal.Service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody CartRequest request) {
        try {
            Cart cart = cartService.addToCart(request.getUserId(), request.getProductId(), request.getQuantity() > 0 ? request.getQuantity() : 1);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartDTO>> getUserCart(@PathVariable Long userId) {
        try {
            List<CartDTO> cartItems = cartService.getUsersCart(userId);
            return ResponseEntity.ok(cartItems);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCartQuantity(@RequestBody CartRequest request) {
        try {
            cartService.updateCartQuantity(request.getUserId(), request.getProductId(), request.getQuantity());
            return ResponseEntity.ok("Cart updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to update cart: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long productId) {
        try {
            cartService.deleteFromCart(userId, productId);
            return ResponseEntity.ok("Product removed from cart");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to remove product: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok("Cart cleared");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to clear cart: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected error occurred: " + e.getMessage());
        }
    }
}