package com.example.typist.persistence;

import com.example.typist.model.entities.Test;
import com.example.typist.model.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@Transactional
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByUser(User user);

    List<Test> findAllByTestDateBetweenOrderByWpm(LocalDateTime startInterval, LocalDateTime endInterval);
}
