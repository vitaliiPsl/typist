package com.example.typist.service;

import com.example.typist.payload.EmailDto;

public interface EmailService {

    /**
     * Send email
     *
     * @param email email to send
     */
    void sendEmail(EmailDto email);

    /**
     * Send template email
     *
     * @param email email to send
     */
    void sendTemplateEmail(EmailDto email);
}
