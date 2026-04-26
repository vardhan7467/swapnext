package com.project.Product.Exchanging.Portal.Service;

import com.project.Product.Exchanging.Portal.Model.Products;
import com.project.Product.Exchanging.Portal.Model.Users;
import com.project.Product.Exchanging.Portal.Repository.ProductRepository;
import com.project.Product.Exchanging.Portal.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Products createProduct(Products product, Long userId) {
        Users owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        product.setOwner(owner);
        product.setCreatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    public List<Products> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Products> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Products> getProductsByUser(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return productRepository.findByOwner(user);
    }

    public List<Products> searchByCategory(String category) {
        return productRepository.findByCategoryContainingIgnoreCase(category);
    }

    public List<Products> searchByTitle(String keyword) {
        return productRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public Products updateProduct(Long id, Products updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setTitle(updatedProduct.getTitle());
            product.setDescription(updatedProduct.getDescription());
            product.setImage(updatedProduct.getImage());
            product.setCategory(updatedProduct.getCategory());
            product.setPrice(updatedProduct.getPrice());
            product.setCondition(updatedProduct.getCondition());
            product.setLocation(updatedProduct.getLocation());
            product.setNumber(updatedProduct.getNumber());
            product.setEmail(updatedProduct.getEmail());
            product.setMessage(updatedProduct.getMessage());
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
