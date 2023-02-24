package com.example.typist.controller;

import com.example.typist.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/images")
public class ImageController {
    private final ImageService imageService;

    @GetMapping(value = "{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] loadImage(@PathVariable String id) {
        return imageService.loadImage(id);
    }
}
