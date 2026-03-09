import { Test, TestingModule } from '@nestjs/testing';
import { UpsService } from './ups.service';
import { UpsAuthService } from './ups.auth.service';
import { UpsMapper } from './ups.mapper';
import { HttpService } from '@nestjs/axios';
import { mockNetworkRequest, errorMessageHelper } from '../../utils/mockHttpservice';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('../../utils/mockHttpservice', () => ({
  ...jest.requireActual('../../utils/mockHttpservice'),
  mockNetworkRequest: jest.fn(),
}));

describe('UpsService', () => {
  let service: UpsService;
  let authService: UpsAuthService;
  let mapper: UpsMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpsService,
        {
          provide: UpsAuthService,
          useValue: { getAccessToken: jest.fn().mockResolvedValue('test-token') },
        },
        {
          provide: UpsMapper,
          useValue: {
            upsRequestMapper: jest.fn().mockReturnValue({}),
            upsResponseMapper: jest.fn().mockReturnValue([{ carrier: 'UPS' }]),
          },
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UpsService>(UpsService);
    authService = module.get<UpsAuthService>(UpsAuthService);
    mapper = module.get<UpsMapper>(UpsMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRate', () => {
    it('should return rates on 200 success', async () => {
      // Arrange
      const mockRateResponse = { RateResponse: { RatedShipment: [] } };
      (mockNetworkRequest as jest.Mock).mockResolvedValue({ status: 200, data: mockRateResponse });

      // Act
      const result = await service.getRate({ weight: 10 } as any);

      // Assert
      expect(result).toEqual([{ carrier: 'UPS' }]);
      expect(authService.getAccessToken).toHaveBeenCalled();
      expect(mapper.upsRequestMapper).toHaveBeenCalled();
      expect(mockNetworkRequest).toHaveBeenCalled();
      expect(mapper.upsResponseMapper).toHaveBeenCalledWith(mockRateResponse);
    });

    const errorCodes = [400, 401, 403, 429];
    errorCodes.forEach((code) => {
      it(`should throw InternalServerErrorException for ${code} error with correct message from helper`, async () => {
        // Arrange
        const expectedMessage = errorMessageHelper(code);
        (mockNetworkRequest as jest.Mock).mockRejectedValueOnce({
          response: {
            status: code,
            data: {
              errors: [{ message: expectedMessage }],
            },
          },
        });

        // Act & Assert
        await expect(service.getRate({ weight: 10 } as any)).rejects.toThrow(
          new InternalServerErrorException(`UPS Rating Failed: ${expectedMessage}`),
        );
      });
    });

    it('should throw fallback error message if response structure is unexpected', async () => {
      // Arrange
      (mockNetworkRequest as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      // Act & Assert
      await expect(service.getRate({ weight: 10 } as any)).rejects.toThrow(
        new InternalServerErrorException('UPS Rating Failed: The UPS service is temporarily unavailable or the address is invalid.'),
      );
    });
  });
});
