package com.example.typist.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    @NotNull(message = "Result WPM is required")
    private int wpm;

    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    @NotNull(message = "Result raw WPM is required")
    private int rawWpm;

    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    @NotNull(message = "Result accuracy is required")
    private int accuracy;

    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    @NotNull(message = "Test duration is required")
    private int duration;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UserDto user;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime timestamp;
}
