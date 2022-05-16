package com.example.typist.model.entities;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.Objects;

@Data
@Entity
@Table(name = "test")
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "wpm")
    @Min(0)
    private int wpm;

    @Column(name = "accuracy")
    @Min(0)
    @Max(100)
    private int accuracy;

    @Column(name = "time")
    @Min(value = 10, message = "minimal test time is 10 seconds")
    private int time;

    @JsonAlias("data")
    @Column(name = "date")
    private LocalDateTime testDate = LocalDateTime.now();

    @JsonBackReference
    @ManyToOne(optional = false)
    private User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Test test = (Test) o;
        return id == test.id && wpm == test.wpm && accuracy == test.accuracy && time == test.time && Objects.equals(testDate, test.testDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, wpm, accuracy, time, testDate);
    }

    @Override
    public String toString() {
        return "Test{" +
                "id=" + id +
                ", wpm=" + wpm +
                ", accuracy=" + accuracy +
                ", time=" + time +
                ", testDate=" + testDate +
                '}';
    }
}
