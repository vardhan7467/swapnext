package com.project.Product.Exchanging.Portal.Repository;



import com.project.Product.Exchanging.Portal.Model.Products;
import com.project.Product.Exchanging.Portal.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.*;
import java.util.List;

public interface ProductRepository extends JpaRepository<Products, Long> {
        List<Products> findByOwner(Users owner);
        List<Products> findByCategoryContainingIgnoreCase(String category);
        List<Products> findByTitleContainingIgnoreCase(String title);


}
