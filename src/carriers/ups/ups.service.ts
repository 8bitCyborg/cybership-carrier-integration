import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UpsAuthService } from './ups.auth.service';
import { UpsMapper } from './ups.mapper';
import { RateRequestDto } from '../../shipping/dto/rateRequest.dto';
import { mockNetworkRequest } from 'src/utils/mockHttpservice';
import { UpsRateResponse } from './ups.interface';

@Injectable()
export class UpsService {
  private readonly logger = new Logger(UpsService.name);

  constructor(
    private readonly authService: UpsAuthService,
    private readonly mapper: UpsMapper,
    private readonly httpService: HttpService,
  ) { }

  async getRate(dto: RateRequestDto) {
    const accessToken = await this.authService.getAccessToken(); // get the oauth token.
    const payload = this.mapper.upsRequestMapper(dto); // map our clean DTO to the nested UPS JSON.

    // If serviceCode is '03' or any specific string, we use 'rate'.
    // If it's empty/undefined, we use 'shop' to get all available options.
    const requestOption = (dto.serviceCode && dto.serviceCode.trim() !== '')
      ? 'rate'
      : 'shop';

    const url = `${process.env.UPS_BASE_URL}/api/rating/v1/rates/${requestOption}`;

    try {
      const { data } = await mockNetworkRequest<UpsRateResponse>(url, payload);
      return this.mapper.upsResponseMapper(data);

    } catch (error) {
      this.logger.error(`UPS API Error: ${error.message}`);
      const upsError = error.response?.data?.errors?.[0]?.message
        || 'The UPS service is temporarily unavailable or the address is invalid.';

      throw new InternalServerErrorException(`UPS Rating Failed: ${upsError}`);
    }
  }
}