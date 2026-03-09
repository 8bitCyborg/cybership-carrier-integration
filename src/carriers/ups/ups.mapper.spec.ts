import { UpsMapper } from './ups.mapper';
import { rateResponse } from '../../utils/mockResponses';

describe('UpsMapper', () => {
  let mapper: UpsMapper;

  beforeEach(() => {
    mapper = new UpsMapper();
  });

  describe('upsResponseMapper', () => {
    it('should correctly transform UPS JSON to our internal Clean Format', () => {
      // Act
      const result = mapper.upsResponseMapper(rateResponse);

      // Assert
      // Assuming your internal format has a 'price' and 'service' field
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].totalAmount).toBe('12.50');
      expect(result[0].serviceName).toBe('UPS Ground');
    });

    it('should handle empty or malformed responses gracefully', () => {
      const malformedData = {};
      const result = mapper.upsResponseMapper(malformedData);

      // Your mapper should return an empty array or handle the error, not crash
      expect(result).toEqual([]);
    });
  });
});