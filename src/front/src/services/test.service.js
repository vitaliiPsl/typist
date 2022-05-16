class TestService{
    getTestResult(textTokens, inputTokens, wordsCount, time){
        let statistic = this.getTestStatistic(textTokens, inputTokens, wordsCount);
        console.log(statistic);

        let rawWpm = this.calculateRawWpm(statistic.correct, statistic.mistakes, time);
        let accuracy = this.calculateAccuracy(statistic.correct, statistic.mistakes);

        return {wpm: rawWpm, accuracy: accuracy, time: time};
    }


    getTestStatistic(textTokens, inputTokens, wordsCount) {
        let correct = 0;
        let mistakes = 0;

        for(let i = 0; i < wordsCount; i++){
            let input = inputTokens[i];
            let token = textTokens[i];

            for(let j = 0; j < input.length && j < token.length; j++){
                input[j] === token[j] ? correct++ : mistakes++;
            }
        }

        return {correct, mistakes};
    }

    calculateRawWpm(correct, wrong, time) {
        return Math.round(((correct + wrong) / 5) / (time / 60));
    }

    calculateAccuracy(correct, wrong) {
        if (correct === 0 && wrong === 0) return 0;

        return Math.round((correct / (correct + wrong)) * 100);
    }
}

export default new TestService();