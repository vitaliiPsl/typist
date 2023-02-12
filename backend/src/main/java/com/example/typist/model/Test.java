package com.example.typist.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tests")
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private int wpm;

    private int rawWpm;

    private int accuracy;

    private int duration;

    private LocalDateTime timestamp;

    @ManyToOne(optional = false)
    private User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Test test = (Test) o;
        return id == test.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
