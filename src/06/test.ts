import { answerPart1 } from './index';

describe('answerPart1', () => {
  it('returns 26 after 18 days for sample input', () => {
    const numFish = answerPart1({ file: './sample.txt', days: 18});
    expect(numFish).toBe(26);
  })

  it('returns 5934 after 80 days for sample input', () => {
    const numFish = answerPart1({ file: './sample.txt', days: 80});
    expect(numFish).toBe(5934);
  })
})
