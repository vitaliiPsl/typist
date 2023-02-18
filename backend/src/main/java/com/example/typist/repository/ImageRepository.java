package com.example.typist.repository;

/**
 * Image repository
 */
public interface ImageRepository {
    /**
     * Save given image to the file with name equal to provided id
     * 
     * @param image image to save
     * @param id    id of the image
     */
    void saveImage(byte[] image, String id);

    /**
     * Load image with given id
     * 
     * @param id id of the image
     * @return fetched image
     */
    byte[] loadImage(String id);

    /**
     * Delete image with give id
     * 
     * @param id id of the image
     */
    void deleteImage(String id);
}
