package com.example.typist.model.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@AllArgsConstructor
@Entity
@Table(name = "person")
public class User {
    @Id
    @GeneratedValue
    private long id;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "email", unique = true)
    @NotNull
    @Email(message = "Invalid email format")
    private String email;

    @Column(name = "password")
    @Size(min = 6, message = "Minimal password length - 6 symbols")
    private String password;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, orphanRemoval = true, cascade = {CascadeType.REMOVE})
    @Fetch(FetchMode.SELECT)
    private Set<Test> tests = new HashSet<>();

    public User() {}

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", nickname='" + nickname + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email);
    }
}
