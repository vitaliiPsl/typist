package com.example.typist.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.UUID;

@Service
public class AwsImageService {
    @Value("${aws.s3.access-key-id}")
    private String accessKey;

    @Value("${aws.s3.secret-access-key}")
    private String secretKey;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.default-user-image}")
    public String defaultImage;

    private static final String IMAGE_EXTENSION_REGEX = "(jp?g|png|bmp)";

    private AmazonS3 getS3client() {
        AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region)
                .build();
    }

    public String saveImage(MultipartFile file) throws IOException {
        if(file == null){
            return defaultImage;
        }

        String extension = getFileExtension(file);
        if (extension == null || !extension.matches(IMAGE_EXTENSION_REGEX)) {
            return defaultImage;
        }

        String imageName = UUID.randomUUID() + "." + extension;
        InputStream imageIS = file.getInputStream();

        AmazonS3 s3client = getS3client();
        s3client.putObject(bucketName, imageName, imageIS, new ObjectMetadata());

        return imageName;
    }

    public byte[] loadImage(String imageName) throws IOException {
        if(imageName == null){
            imageName = defaultImage;
        }

        AmazonS3 s3client = getS3client();
        S3Object s3object = s3client.getObject(bucketName, imageName);

        S3ObjectInputStream inputStream = s3object.getObjectContent();
        return inputStream.readAllBytes();
    }

    private String getFileExtension(MultipartFile filePart) {
        String name = filePart.getOriginalFilename();

        if (name == null) {
            return null;
        }

        String[] nameParts = name.split("\\.");
        return nameParts[nameParts.length - 1];
    }
}
