package com.example.typist.repository;

import com.example.typist.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface TestRepository extends JpaRepository<Test, Long> {
}
