package com.example.typist.payload.error;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {
    private String message;

    private HttpStatus status;

    private String debugMessage;

    public ApiError(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public ApiError(HttpStatus status, String message, Throwable throwable) {
        this.status = status;
        this.message = message;
        this.debugMessage = throwable.getMessage();
    }
}