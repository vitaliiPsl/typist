package com.example.typist.service.impl;

import com.example.typist.model.Test;
import com.example.typist.model.User;
import com.example.typist.payload.TestDto;
import com.example.typist.repository.TestRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TestServiceImplTest {

    @Mock
    TestRepository testRepository;

    @Spy
    ModelMapper mapper;

    @InjectMocks
    TestServiceImpl testService;

    @org.junit.jupiter.api.Test
    void whenSaveTest_givenValidRequest_thenSaveTest() {
        // given
        User actor = User.builder().id(3).email("j.doe@mail.com").build();

        TestDto testDto = TestDto.builder().wpm(79).rawWpm(85).accuracy(96).duration(30).build();

        // when
        when(testRepository.save(any(Test.class))).then(returnsFirstArg());
        TestDto res = testService.saveTest(testDto, actor);

        // then
        verify(testRepository).save(any(Test.class));
        assertThat(res.getWpm(), org.hamcrest.Matchers.is(testDto.getWpm()));
        assertThat(res.getRawWpm(), org.hamcrest.Matchers.is(testDto.getRawWpm()));
        assertThat(res.getAccuracy(), org.hamcrest.Matchers.is(testDto.getAccuracy()));
        assertThat(res.getDuration(), org.hamcrest.Matchers.is(testDto.getDuration()));
    }

}