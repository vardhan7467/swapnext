package com.project.Product.Exchanging.Portal.Controller;

import com.project.Product.Exchanging.Portal.DTO.CartDTO;
import com.project.Product.Exchanging.Portal.Model.Cart;
import com.project.Product.Exchanging.Portal.Service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000") // Ensure this matches your frontend URL
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity) {
        try {
            Cart cart = cartService.addToCart(userId, productId, quantity);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) { // Catch RuntimeException for more specific error handling
            return ResponseEntity.badRequest().body(null); // Return empty body or a specific error object if needed
        } catch (Exception e) {
            // General catch-all for unexpected errors
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
    public ResponseEntity<String> updateCartQuantity(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam int quantity) {
        try {
            cartService.updateCartQuantity(userId, productId, quantity);
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