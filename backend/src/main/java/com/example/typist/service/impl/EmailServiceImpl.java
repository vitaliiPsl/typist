package com.example.typist.service.impl;

import com.example.typist.payload.EmailDto;
import com.example.typist.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;

@RequiredArgsConstructor
@Slf4j
@Service
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender emailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${email.from}")
    private String from;

    @Async
    @Override
    public void sendEmail(EmailDto email) {
        log.debug("Send email to {}", email.getTo());

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(email.getTo());
        message.setSubject(email.getSubject());
        message.setText(email.getMessage());

        emailSender.send(message);
    }

    @SneakyThrows
    @Async
    @Override
    public void sendTemplateEmail(EmailDto email) {
        log.debug("Send email to {} using template {}", email.getTo(), email.getTemplate());

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

        Context context = new Context();
        context.setVariables(email.getVariables());

        helper.setFrom(from);
        helper.setTo(email.getTo());
        helper.setSubject(email.getSubject());

        String html = templateEngine.process(email.getTemplate(), context);
        helper.setText(html, true);

        emailSender.send(message);
    }
}
