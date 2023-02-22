package com.example.typist.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailDto {
    private String to;
    private String from;
    private String subject;
    private String message;
    private String template;

    @Builder.Default
    private Map<String, Object> variables = new HashMap<>();
}
