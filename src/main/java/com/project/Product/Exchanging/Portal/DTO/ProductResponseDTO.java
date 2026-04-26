package com.project.Product.Exchanging.Portal.DTO;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String image;
    private String category;
    private Double price;
    private LocalDateTime created_at;
    private Long ownerId;
    private String ownerName;
    private String location;
    private String condition;
    private String email;
    private String number;
    private String message;

}
