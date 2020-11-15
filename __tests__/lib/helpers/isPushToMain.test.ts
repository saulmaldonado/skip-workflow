import { isPushToMain } from '../../../src/lib/helpers/isPushToMain';

describe('Unit Test: isPushToMain', () => {
  const mockRefMain = 'refs/heads/main';
  const mockRefMaster = 'refs/heads/master';
  it('should return true for matching ref', () => {
    const result = isPushToMain(mockRefMain);
    const result2 = isPushToMain(mockRefMaster);

    expect(result).toBe(true);
    expect(result2).toBe(true);
  });
});
