package com.example.typist.controller;


import com.example.typist.exception.ForbiddenException;
import com.example.typist.exception.ResourceAlreadyExistException;
import com.example.typist.exception.ResourceNotFoundException;
import com.example.typist.payload.error.ApiError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Optional;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;

@Slf4j
@ControllerAdvice
public class ExceptionHandlerController {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(BadCredentialsException e) {
        log.error("Handle bad credentials exception: {}", e.getMessage(), e);

        String error = "Invalid username or password";
        return buildResponseEntity(new ApiError(HttpStatus.UNAUTHORIZED, error, e));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiError> handleForbiddenException(ForbiddenException e) {
        log.error("Handle ForbiddenException exception: {}", e.getMessage(), e);

        return buildResponseEntity(new ApiError(HttpStatus.FORBIDDEN, e.getMessage(), e));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<ApiError> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        log.error("Handle message not readable exception: {}", e.getMessage(), e);

        String error = "Malformed JSON request";
        return buildResponseEntity(new ApiError(BAD_REQUEST, error, e));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    protected ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException e) {
        log.error("Handle message not readable exception: {}", e.getMessage(), e);

        return buildResponseEntity(new ApiError(HttpStatus.NOT_FOUND, e.getMessage(), e));
    }

    @ExceptionHandler(ResourceAlreadyExistException.class)
    protected ResponseEntity<ApiError> handleResourceAlreadyExistsException(ResourceAlreadyExistException e) {
        log.error("Handle resource already exist exception: {}", e.getMessage(), e);

        return buildResponseEntity(new ApiError(CONFLICT, e.getMessage(), e));
    }

    @ExceptionHandler(BindException.class)
    protected ResponseEntity<ApiError> handleMethodArgumentNotValid(BindException e) {
        log.error("handle bind exception: {}", e.getMessage(), e);

        Optional<FieldError> fieldError = e.getFieldErrors().stream().findFirst();
        String message = fieldError.isEmpty() ? "Invalid input" : fieldError.get().getDefaultMessage();

        ApiError apiError = new ApiError(BAD_REQUEST, message);
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(IllegalStateException.class)
    protected ResponseEntity<ApiError> handleIllegalStateException(IllegalStateException e) {
        log.error("handle illegal state exception: {}", e.getMessage(), e);

        return buildResponseEntity(new ApiError(BAD_REQUEST, e.getMessage(), e));
    }

    private ResponseEntity<ApiError> buildResponseEntity(ApiError apiError) {
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }
}
