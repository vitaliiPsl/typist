package com.example.typist.service.impl;

import com.example.typist.model.Test;
import com.example.typist.model.User;
import com.example.typist.payload.TestDto;
import com.example.typist.repository.TestRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
        User actor = User.builder().id("1234").email("j.doe@mail.com").build();

        TestDto testDto = TestDto.builder().wpm(79).rawWpm(85).accuracy(96).duration(30).build();

        // when
        when(testRepository.save(any(Test.class))).then(returnsFirstArg());
        TestDto res = testService.saveTest(testDto, actor);

        // then
        verify(testRepository).save(any(Test.class));
        assertThat(res.getWpm(), Matchers.is(testDto.getWpm()));
        assertThat(res.getRawWpm(), Matchers.is(testDto.getRawWpm()));
        assertThat(res.getAccuracy(), Matchers.is(testDto.getAccuracy()));
        assertThat(res.getDuration(), Matchers.is(testDto.getDuration()));
    }

    @org.junit.jupiter.api.Test
    void whenDeleteTests_givenIdOfTheUser_theDeleteTestsOfThatUser() {
        // given
        String userId = "1234-qwer";

        // when
        testService.deleteTests(userId);

        // then
        verify(testRepository).deleteByUser_Id(userId);
    }

    @org.junit.jupiter.api.Test
    void whenGetTests_givenInvalidLimit_throwException() {
        // given
        int limit = -1;

        // then
        assertThrows(RuntimeException.class, () -> testService.getTests(null, null, limit, null, null));
    }

    @org.junit.jupiter.api.Test
    void whenGetTests_givenLimitSortByAndSortDirection_thenNumberOfTestsEqualOrLessThanTheLimit() {
        // given
        int limit = 2;
        String sortBy = "wpm";
        Sort.Direction direction = Sort.Direction.ASC;

        List<Test> tests = List.of(
                Test.builder().id("1234").build(),
                Test.builder().id("4321").build()
        );

        PageRequest pageRequest = PageRequest.ofSize(limit).withSort(direction, sortBy);

        // when
        when(testRepository.findAll(pageRequest)).thenReturn(new PageImpl<>(tests));

        List<TestDto> res = testService.getTests(null, null, limit, sortBy, direction);

        // then
        verify(testRepository).findAll(pageRequest);
        assertThat(res, Matchers.hasSize(tests.size()));
    }

    @org.junit.jupiter.api.Test
    void whenGetTests_givenLimitIsZero_thenReturnAllTests() {
        // given
        int limit = 0;
        String sortBy = "wpm";
        Sort.Direction direction = Sort.Direction.ASC;

        List<Test> tests = List.of(
                Test.builder().id("1234").build(),
                Test.builder().id("4321").build()
        );

        PageRequest pageRequest = PageRequest.ofSize(Integer.MAX_VALUE).withSort(direction, sortBy);

        // when
        when(testRepository.findAll(pageRequest)).thenReturn(new PageImpl<>(tests));

        List<TestDto> res = testService.getTests(null, null, limit, sortBy, direction);

        // then
        verify(testRepository).findAll(pageRequest);
        assertThat(res, Matchers.hasSize(tests.size()));
    }

    @org.junit.jupiter.api.Test
    void whenGetTests_givenIdOfTheUser_thenReturnTestsOfGivenUser() {
        // given
        int limit = 2;
        String sortBy = "wpm";
        Sort.Direction direction = Sort.Direction.ASC;

        String userId = "qwer-1234";

        List<Test> tests = List.of(
                Test.builder().id("1234").user(User.builder().id(userId).build()).build(),
                Test.builder().id("4321").user(User.builder().id(userId).build()).build()
        );

        PageRequest pageRequest = PageRequest.ofSize(limit).withSort(direction, sortBy);

        // when
        when(testRepository.findByUser_Id(userId, pageRequest)).thenReturn(tests);

        List<TestDto> res = testService.getTests(userId, null, limit, sortBy, direction);

        // then
        verify(testRepository).findByUser_Id(userId, pageRequest);
        assertThat(res, Matchers.hasSize(limit));
    }

    @org.junit.jupiter.api.Test
    void whenGetTests_givenAfterTimestamp_thenReturnTestsTakenAfterGivenTimestamp() {
        // given
        int limit = 2;
        String sortBy = "wpm";
        Sort.Direction direction = Sort.Direction.ASC;

        LocalDateTime after = LocalDateTime.now().minusWeeks(1);

        List<Test> tests = List.of(
                Test.builder().id("1234").timestamp(LocalDateTime.now().minusWeeks(1)).build(),
                Test.builder().id("4321").timestamp(LocalDateTime.now().minusWeeks(2)).build()
        );

        PageRequest pageRequest = PageRequest.ofSize(limit).withSort(direction, sortBy);

        // when
        when(testRepository.findByTimestampAfter(after, pageRequest)).thenReturn(tests);

        List<TestDto> res = testService.getTests(null, after, limit, sortBy, direction);

        // then
        verify(testRepository).findByTimestampAfter(after, pageRequest);
        assertThat(res, Matchers.hasSize(limit));
    }

    @org.junit.jupiter.api.Test
    void whenGetTests_givenUserIdAndAfterTimestamp_thenReturnTestsTakenByGivenUserAndAfterGivenTimestamp() {
        // given
        int limit = 2;
        String sortBy = "wpm";
        Sort.Direction direction = Sort.Direction.ASC;

        String userId = "qwer-1234";
        LocalDateTime after = LocalDateTime.now().minusWeeks(1);

        List<Test> tests = List.of(
                Test.builder().id("1234")
                        .user(User.builder().id(userId).build())
                        .timestamp(LocalDateTime.now().minusWeeks(1)).build(),
                Test.builder().id("4321")
                        .user(User.builder().id(userId).build())
                        .timestamp(LocalDateTime.now().minusWeeks(2)).build()
        );

        PageRequest pageRequest = PageRequest.ofSize(limit).withSort(direction, sortBy);

        // when
        when(testRepository.findByUser_IdAndTimestampAfter(userId, after, pageRequest)).thenReturn(tests);

        List<TestDto> res = testService.getTests(userId, after, limit, sortBy, direction);

        // then
        verify(testRepository).findByUser_IdAndTimestampAfter(userId, after, pageRequest);
        assertThat(res, Matchers.hasSize(limit));
    }
}