package com.example.typist.service.impl;

import com.example.typist.repository.ImageRepository;
import com.example.typist.service.ImageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;

    @Value("${image-store.allowed-extensions-regex}")
    private String imageExtensionRegex;

    @Override
    public String saveImage(MultipartFile image) {
        log.debug("Save image: {}", image);

        if (image == null) {
            log.error("Image is null");
            throw new IllegalStateException("Image is null");
        }

        try {
            String imageId = generateImageId(image);
            byte[] imageBytes = image.getBytes();

            imageRepository.saveImage(imageBytes, imageId);

            return imageId;
        } catch (IOException e) {
            log.debug("Exception while saving image", e);
            throw new IllegalStateException("Couldn't save the image", e);
        }  
    }

    @Override
    public byte[] loadImage(String id) {
        log.debug("Load image with id: {}", id);

        return imageRepository.loadImage(id);
    }

    @Override
    public void deleteImage(String id) {
        log.debug("Delete image with id {}", id);

        imageRepository.deleteImage(id);
    }

    protected String generateImageId(MultipartFile image) {
        String extension = getImageExtension(image);

        if (extension == null || !extension.matches(imageExtensionRegex)) {
            log.error("Invalid image extension: {}", extension);
            throw new IllegalStateException(getInvalidImageExtensionMessage(extension));
        }

        return UUID.randomUUID() + "." + extension;
    }

    protected String getImageExtension(MultipartFile filePart) {
        String name = filePart.getOriginalFilename();

        if (name == null) {
            return null;
        }

        String[] nameParts = name.split("\\.");
        return nameParts[nameParts.length - 1];
    }

    protected String getInvalidImageExtensionMessage(String extension) {
        String message = "Invalid image extension: %s. Allowed extensions: %s";

        String allowedExtensions = String.join(",", imageExtensionRegex.split("\\|"));

        return String.format(message, extension, allowedExtensions);
    }
}
