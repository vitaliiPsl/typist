package com.example.typist.repository.impl;

import com.example.typist.exception.ResourceNotFoundException;
import com.example.typist.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

@Slf4j
@RequiredArgsConstructor
@Component
@ConditionalOnProperty(value = "aws.s3.bucket-name")
public class AwsS3ImageRepository implements ImageRepository {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Override
    public void saveImage(byte[] image, String id) {
        try {
            PutObjectRequest objectRequest = PutObjectRequest.builder().bucket(bucketName).key(id).build();
            
            s3Client.putObject(objectRequest, RequestBody.fromBytes(image));
        } catch (S3Exception e) {
            log.error("Exception while saving image {} to the S3", id, e);
            throw new IllegalStateException("Couldn't save the image", e);
        }
    }

    @Override
    public byte[] loadImage(String id) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucketName).key(id).build();
            
            return s3Client.getObjectAsBytes(getObjectRequest).asByteArray();
        } catch (NoSuchKeyException e) {
            log.error("Image {} doesn't exist on the S3 bucket", id);
            throw new ResourceNotFoundException("Image", "name", id);
        } catch (S3Exception e) {
            log.error("Exception while loading image {} from the S3", id, e);
            throw new IllegalStateException("Couldn't load the image", e);
        }
    }

    @Override
    public void deleteImage(String id) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder().bucket(bucketName).key(id).build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (S3Exception e) {
            log.error("Exception while deleting image {} from the S3", id, e);
            throw new IllegalStateException("Couldn't delete the image", e);
        }
    }

}
