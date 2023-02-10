package com.example.typist.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String msg) {
        super(msg);
    }

    public ResourceNotFoundException(String resource, String key, String value) {
        super(String.format("%s with %s '%s' doesn't exist", resource, key, value));
    }
}
