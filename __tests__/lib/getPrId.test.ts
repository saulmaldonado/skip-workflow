import { getPrId } from '../../src/lib/getPrId';

describe('Unit Test: getPrId', () => {
  it('should parse and return the expected prId', () => {
    const prId = 1;
    const mockRef = `refs/pull/${prId}/merge`;

    const result = getPrId(mockRef);

    expect(result).toBe(prId);
  });

  it('should fail and throw an Error on invalid ref format', () => {
    const prId = 1;
    const mockRef = `refs/pull/${prId}/head`;

    expect(() => {
      getPrId(mockRef);
    }).toThrow();
  });
});
