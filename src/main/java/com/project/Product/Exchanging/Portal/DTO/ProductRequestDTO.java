package com.project.Product.Exchanging.Portal.DTO;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductRequestDTO {

    @NotBlank(message = "Product title is required")
    @Size(max = 100, message = "Title must be under 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description can’t exceed 1000 characters")
    private String description;

    @Size(max = 255, message = "Image URL is too long")
    private String image;

    private String category;
    private LocalDateTime created_at;

    private Double price;
    private String location;
    private String condition;
    private String email;
    private String number;
    private String message;
}
