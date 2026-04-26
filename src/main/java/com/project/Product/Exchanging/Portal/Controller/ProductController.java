package com.project.Product.Exchanging.Portal.Controller;

import com.project.Product.Exchanging.Portal.Model.Products;
import com.project.Product.Exchanging.Portal.Service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<Products> createProduct(
            @RequestBody Products products,
            @PathVariable Long userId) {
        return ResponseEntity.ok(productService.createProduct(products, userId));
    }

    @GetMapping
    public ResponseEntity<List<Products>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/upload/user/{userId}")
    public ResponseEntity<Products> uploadProduct(
            @RequestParam("image") MultipartFile file,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Double price,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String number,
            @PathVariable Long userId) {
        try {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads", filename);
            Files.createDirectories(uploadPath.getParent());
            Files.copy(file.getInputStream(), uploadPath, StandardCopyOption.REPLACE_EXISTING);

            Products product = new Products();
            product.setTitle(title);
            product.setDescription(description);
            product.setPrice(price);
            product.setCategory(category);
            product.setCondition(condition);
            product.setLocation(location);
            product.setMessage(message);
            product.setEmail(email);
            product.setNumber(number);
            product.setImage("/uploads/" + filename); // ✅ Correct URL path for frontend

            return ResponseEntity.ok(productService.createProduct(product, userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Products> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

        @GetMapping("/search/category")
        public ResponseEntity<List<Products>> searchByCategory(@RequestParam String category) {
            return ResponseEntity.ok(productService.searchByCategory(category));
        }

    @GetMapping("/user/{ownerId}")
    public ResponseEntity<List<Products>> getProductsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(productService.getProductsByUser(ownerId));
    }

        @GetMapping("/search/title")
        public ResponseEntity<List<Products>> searchByTitle(@RequestParam String keyword) {
            return ResponseEntity.ok(productService.searchByTitle(keyword));
        }

    @PutMapping("/{id}")
    public ResponseEntity<Products> updateProduct(@PathVariable Long id, @RequestBody Products products) {
        return ResponseEntity.ok(productService.updateProduct(id, products));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
