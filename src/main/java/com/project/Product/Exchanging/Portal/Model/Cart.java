package com.project.Product.Exchanging.Portal.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart")
@Data // Provides getters, setters, toString, equals, hashCode
@NoArgsConstructor // Provides a no-argument constructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to the User who owns this cart item
    // fetch = FetchType.LAZY is generally preferred for ManyToOne
    // JoinColumn defines the foreign key column in the 'cart' table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user; // Changed to 'Users' based on your provided DTO/Service

    // Link to the Product in this cart item
    // FetchType.EAGER is used here because product details are almost always needed when fetching cart items
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Products product; // Changed to 'Products' based on your provided DTO/Service

    private int quantity = 1;

    // ⭐ IMPORTANT: Removed the `getUserId/ProductId()` and `setUserId/ProductId()` helper methods.
    // These methods were creating a mismatch with how JPA manages relationships.
    // The service layer should directly set the 'user' and 'product' *entities*.
}