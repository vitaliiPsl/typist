package com.example.typist.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Image service
 */
public interface ImageService {
    /**
     * Save multipart file image
     *
     * @param image image to save
     * @return generated image id
     */
    String saveImage(MultipartFile image);

    /**
     * Load image with given id
     *
     * @param id id of the image
     * @return retrieved image
     */
    byte[] loadImage(String id);

    /**
     * Delete image with given id
     *
     * @param id id of the image
     */
    void deleteImage(String id);
}
