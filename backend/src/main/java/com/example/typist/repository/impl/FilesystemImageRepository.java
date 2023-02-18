package com.example.typist.repository.impl;

import com.example.typist.exception.ResourceNotFoundException;
import com.example.typist.repository.ImageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@Component
@ConditionalOnMissingBean(AwsS3ImageRepository.class)
public class FilesystemImageRepository implements ImageRepository {

    @Value("${image-store.upload-path}")
    private String uploadPath;

    @Override
    public void saveImage(byte[] image, String id) {
        log.debug("Save image {} to filesystem", id);

        try {
            // create directory if it doesn't exist
            Path uploadDir = Path.of(uploadPath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectory(uploadDir);
            }

            Path path = uploadDir.resolve(id);
            Files.write(path, image);
        } catch (IOException e) {
            log.error("Exception while saving image {} to the filesystem", id, e);
            throw new IllegalStateException("Couldn't save the image", e);
        }
    }

    @Override
    public byte[] loadImage(String id) {
        log.debug("Load image {} from the filesystem: {}", id);

        try {
            Path path = getImagePath(id);
            return Files.readAllBytes(path);
        } catch (IOException e) {
            log.error("Exception while loading image {} from the filesystem", id, e);
            throw new IllegalStateException("Couldn't load the image", e);
        }
    }

    @Override
    public void deleteImage(String id) {
        log.debug("Delete image {} from the filesystem", id);

        try {
            Path path = getImagePath(id);
            Files.delete(path);
        } catch (IOException e) {
            log.error("Exception while deleting image {} from the filesystem", id, e);
            throw new IllegalStateException("Couldn't delete the image", e);
        }
    }

    private Path getImagePath(String id) {
        Path path = Path.of(uploadPath, id);

        if (!Files.exists(path)) {
            log.error("Image {} doesn't exist on the filesystem", id);
            throw new ResourceNotFoundException("Image", "name", id);
        }

        return path;
    }
}
