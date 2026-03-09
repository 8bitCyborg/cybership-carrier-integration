import { Injectable } from '@nestjs/common';
import { CarrierService } from '../../shipping/interfaces/carrier-service.interface';
import { RateRequestDto } from '../../shipping/dto/rateRequest.dto';

@Injectable()
export class FedexService implements CarrierService {
  async getRate(dto: RateRequestDto) {
    return 'Fedex Rate';
  };
};
