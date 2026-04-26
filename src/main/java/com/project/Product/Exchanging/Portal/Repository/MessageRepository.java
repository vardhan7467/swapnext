package com.project.Product.Exchanging.Portal.Repository;

import com.project.Product.Exchanging.Portal.Model.Messages;
import com.project.Product.Exchanging.Portal.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Messages, Long> {
    
    @Query("SELECT m FROM Messages m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.timestamp ASC")
    List<Messages> findChatHistory(@Param("user1") Users user1, @Param("user2") Users user2);

    List<Messages> findByReceiverAndIsReadFalse(Users receiver);
    
    @Query("SELECT DISTINCT m.sender FROM Messages m WHERE m.receiver = :user UNION SELECT DISTINCT m.receiver FROM Messages m WHERE m.sender = :user")
    List<Users> findContactsForUser(@Param("user") Users user);
}
