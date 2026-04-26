package com.project.Product.Exchanging.Portal.Service;

import com.project.Product.Exchanging.Portal.DTO.CartDTO;
import com.project.Product.Exchanging.Portal.Model.Cart;
import com.project.Product.Exchanging.Portal.Model.Products; // Assuming your Product model is named 'Products'
import com.project.Product.Exchanging.Portal.Model.Users;    // Assuming your User model is named 'Users'
import com.project.Product.Exchanging.Portal.Repository.CartRepository;
import com.project.Product.Exchanging.Portal.Repository.ProductRepository;
import com.project.Product.Exchanging.Portal.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Cart addToCart(Long userId, Long productId, int quantity) {
        // Find the User entity
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Find the Product entity
        Products product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Check if the product already exists in the user's cart
        // Use the repository method that filters by actual User and Product entities
        Optional<Cart> existingCart = cartRepository.findByUserAndProduct(user, product);

        Cart cartItem;
        if (existingCart.isPresent()) {
            // Update quantity if item already exists
            cartItem = existingCart.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            // Create new cart item
            cartItem = new Cart();
            cartItem.setUser(user);      // Set the actual User entity
            cartItem.setProduct(product); // Set the actual Product entity
            cartItem.setQuantity(quantity);
        }
        return cartRepository.save(cartItem);
    }

    @Transactional
    public Cart updateCartQuantity(Long userId, Long productId, int newQuantity) {
        // Find the User entity
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Find the Product entity
        Products product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Find the specific cart item by user and product
        Optional<Cart> existingCart = cartRepository.findByUserAndProduct(user, product);

        if (existingCart.isPresent()) {
            Cart cartItem = existingCart.get();
            if (newQuantity <= 0) {
                // If quantity is 0 or less, remove the item
                cartRepository.delete(cartItem);
                return null; // Indicate that the item was removed
            } else {
                cartItem.setQuantity(newQuantity);
                return cartRepository.save(cartItem);
            }
        } else {
            throw new RuntimeException("Cart item not found for user " + userId + " and product " + productId);
        }
    }

    public List<CartDTO> getUsersCart(Long userId) {
        // Find the User entity
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Crucial: Fetch cart items specifically for this user entity
        List<Cart> cartItems = cartRepository.findByUser(user);
        return cartItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // This method is critical for transforming the Cart entity into the DTO expected by the frontend
    private CartDTO convertToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId()); // The ID of the cart entry itself
        dto.setQuantity(cart.getQuantity());

        // Populate userId and productId from the associated entities
        if (cart.getUser() != null) {
            dto.setUserId(cart.getUser().getId());
        }

        // Populate ProductDetails and productId from the associated Products entity
        if (cart.getProduct() != null) {
            dto.setProductId(cart.getProduct().getId()); // Set productId at the top level of DTO

            CartDTO.ProductDetails productDetails = new CartDTO.ProductDetails();
            productDetails.setId(cart.getProduct().getId()); // Set product ID within product details as well
            productDetails.setTitle(cart.getProduct().getTitle());
            productDetails.setLocation(cart.getProduct().getLocation());
            productDetails.setPrice(cart.getProduct().getPrice());
            productDetails.setDescription(cart.getProduct().getDescription());
            productDetails.setCategory(cart.getProduct().getCategory());
            productDetails.setCondition(cart.getProduct().getCondition());

            // Handle image URL: assuming Products.getImage() gives the raw path (e.g., "product1.jpg" or "/uploads/product1.jpg")
            String imageUrl = cart.getProduct().getImage();
            // The frontend getImageUrl handles prepending base URL, so just ensure it's a relative path starting with /uploads/
            if (imageUrl != null && !imageUrl.startsWith("http")) {
                if (!imageUrl.startsWith("/uploads/") && !imageUrl.startsWith("uploads/")) {
                    imageUrl = "/uploads/" + imageUrl;
                } else if (imageUrl.startsWith("uploads/")) { // If it starts with uploads/ but not /uploads/
                    imageUrl = "/" + imageUrl;
                }
            }
            productDetails.setImageUrl(imageUrl);

            // Get owner information (assuming Products has an 'owner' ManyToOne relationship to Users)
            if (cart.getProduct().getOwner() != null) {
                productDetails.setSeller(cart.getProduct().getOwner().getUsername()); // Assuming Users has getUsername()
            } else {
                productDetails.setSeller("Unknown Seller");
            }

            dto.setProduct(productDetails);
        }

        return dto;
    }

    @Transactional
    public void deleteFromCart(Long userId, Long productId) {
        // Find the User entity
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Find the Product entity
        Products product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Find the specific cart item by user and product
        Optional<Cart> cartItemOptional = cartRepository.findByUserAndProduct(user, product);

        if (cartItemOptional.isPresent()) {
            cartRepository.delete(cartItemOptional.get());
        } else {
            throw new RuntimeException("Cart item not found for user " + userId + " and product " + productId);
        }
    }

    @Transactional
    public void clearCart(Long userId) {
        // Find the User entity
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Crucial: Delete all cart items specifically for this user entity
        cartRepository.deleteByUser(user);
    }
}