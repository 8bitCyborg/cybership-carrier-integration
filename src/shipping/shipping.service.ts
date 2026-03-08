// src/shipping/shipping.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { UpsService } from '../carriers/ups/ups.service';
import { RateRequestDto } from './dto/rateRequest.dto';

@Injectable()
export class ShippingService {
  constructor(private readonly upsService: UpsService) { }

  async getRates(dto: RateRequestDto) {
    // Determine which carrier service to use
    const carrier = dto.carrier.toUpperCase();

    switch (carrier) {
      case 'UPS':
        return this.upsService.getRate(dto);

      // Future Expansion:
      // case 'FEDEX':
      //   return this.fedexService.getRate(dto);

      default:
        throw new BadRequestException(
          `Carrier '${dto.carrier}' is not supported. Supported carriers: UPS`,
        );
    }
  }
}
