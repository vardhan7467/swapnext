package com.project.Product.Exchanging.Portal.Controller;

import com.project.Product.Exchanging.Portal.Model.Messages;
import com.project.Product.Exchanging.Portal.Model.Users;
import com.project.Product.Exchanging.Portal.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<Messages> sendMessage(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam(required = false) Long productId,
            @RequestBody String content) {
        return ResponseEntity.ok(messageService.sendMessage(senderId, receiverId, productId, content));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Messages>> getHistory(
            @RequestParam Long user1Id,
            @RequestParam Long user2Id) {
        return ResponseEntity.ok(messageService.getChatHistory(user1Id, user2Id));
    }

    @GetMapping("/contacts/{userId}")
    public ResponseEntity<List<Users>> getContacts(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getContacts(userId));
    }
}
