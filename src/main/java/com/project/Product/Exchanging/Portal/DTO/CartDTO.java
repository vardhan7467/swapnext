package com.project.Product.Exchanging.Portal.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long id;       // The ID of the cart entry itself
    private int quantity;

    // Include productId and userId at the top level for convenience if the frontend uses them directly.
    // They will be populated from the associated entities in the Service layer.
    private Long productId;
    private Long userId;

    // Product details are nested as a separate object, matching frontend expectation (item.product.title, etc.)
    private ProductDetails product;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductDetails {
        private Long id;          // <--- ⭐ ADDED THIS LINE: Product's actual ID
        private String title;
        private String seller;    // This will be the owner's username
        private String location;
        private Double price;
        private String imageUrl;  // The image path
        private String description;
        private String category;
        private String condition;
        // No need for 'Owner' field here, 'seller' is sufficient for the owner's name.
    }
}