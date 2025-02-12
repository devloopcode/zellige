import { Salam } from '../src';

describe('index', () => {
  describe('Salam', () => {
    it('should return a string containing the message', () => {
      const message = 'Hello';

      const result = Salam(message);

      expect(result).toMatch(message);
    });
  });
});
