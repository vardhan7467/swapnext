package com.project.Product.Exchanging.Portal.Service;

import com.project.Product.Exchanging.Portal.Model.Messages;
import com.project.Product.Exchanging.Portal.Model.Products;
import com.project.Product.Exchanging.Portal.Model.Users;
import com.project.Product.Exchanging.Portal.Repository.MessageRepository;
import com.project.Product.Exchanging.Portal.Repository.ProductRepository;
import com.project.Product.Exchanging.Portal.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Messages sendMessage(Long senderId, Long receiverId, Long productId, String content) {
        Users sender = userRepository.findById(senderId).orElseThrow();
        Users receiver = userRepository.findById(receiverId).orElseThrow();
        Products product = productId != null ? productRepository.findById(productId).orElse(null) : null;

        Messages message = new Messages();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setProduct(product);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        
        return messageRepository.save(message);
    }

    public List<Messages> getChatHistory(Long user1Id, Long user2Id) {
        Users user1 = userRepository.findById(user1Id).orElseThrow();
        Users user2 = userRepository.findById(user2Id).orElseThrow();
        return messageRepository.findChatHistory(user1, user2);
    }

    public List<Users> getContacts(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow();
        return messageRepository.findContactsForUser(user);
    }
}
