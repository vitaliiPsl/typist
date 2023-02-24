package com.example.typist.service.impl;

import com.example.typist.payload.EmailDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmailServiceImplTest {

    @Mock
    JavaMailSender emailSender;

    @InjectMocks
    EmailServiceImpl emailService;

    @Captor
    ArgumentCaptor<SimpleMailMessage> simpleMessageCapture;

    @Test
    void testSendEmail() {
        // given
        EmailDto email = EmailDto.builder().to("j.doe@mail.com").subject("Test").message("Test message").build();

        // when
        emailService.sendEmail(email);

        // then
        verify(emailSender).send(simpleMessageCapture.capture());

        SimpleMailMessage message = simpleMessageCapture.getValue();
        // verify receiver
        assertThat(message.getTo(), is(notNullValue()));
        assertThat(message.getTo().length, is(1));
        assertThat(message.getTo()[0], is(email.getTo()));

        assertThat(message.getSubject(), is(email.getSubject()));
        assertThat(message.getText(), is(email.getMessage()));
    }
}