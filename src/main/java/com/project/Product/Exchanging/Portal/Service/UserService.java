package com.project.Product.Exchanging.Portal.Service;

import com.project.Product.Exchanging.Portal.Model.Users;
import com.project.Product.Exchanging.Portal.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public Users createUser(Users user){
        return userRepository.save(user);
    }

    public List<Users> getAllUsers(){
        return userRepository.findAll();
    }

    public Optional<Users> getUserById(Long id){
        return userRepository.findById(id);
    }

    public Users updateUser(Long id, Users updatedUser) {
        Users existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if email is changing and already exists for someone else
        if (!existingUser.getEmail().equals(updatedUser.getEmail())) {
            if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                throw new RuntimeException("Email already in use by another user");
            }
        }

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(updatedUser.getPassword());

        return userRepository.save(existingUser);
    }


    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }
}
