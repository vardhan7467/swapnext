package com.project.Product.Exchanging.Portal.Repository;

import com.project.Product.Exchanging.Portal.Model.Cart;
import com.project.Product.Exchanging.Portal.Model.Users;    // Assuming your User model is named 'Users'
import com.project.Product.Exchanging.Portal.Model.Products; // Assuming your Product model is named 'Products'
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // ⭐ Primary method to get all cart items for a specific user.
    // JOIN FETCH c.product ensures the product details are loaded eagerly
    // within the same query, preventing N+1 problems when converting to DTOs.
    @Query("SELECT c FROM Cart c JOIN FETCH c.product WHERE c.user = :user")
    List<Cart> findByUser(@Param("user") Users user);

    // Method to find a specific cart item given a user AND a product.
    Optional<Cart> findByUserAndProduct(Users user, Products product);

    // Method to delete all cart items for a specific user.
    // Spring Data JPA can infer this from the method name if you pass the entity.
    @Modifying
    @Transactional // Required for modifying operations
    void deleteByUser(Users user);

    // If you prefer to delete by IDs directly without fetching User/Product entities first,
    // these are also valid but might be less "JPA idiomatic" for relationships.
    // However, for delete operations, they can be efficient.
    @Modifying
    @Transactional
    @Query("DELETE FROM Cart c WHERE c.user.id = :userId AND c.product.id = :productId")
    void deleteByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Cart c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}