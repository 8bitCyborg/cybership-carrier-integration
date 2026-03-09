// src/shipping/shipping.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { RateRequestDto } from './dto/rateRequest.dto';
import { UpsService } from '../carriers/ups/ups.service';
import { FedexService } from '../carriers/fedex/fedex.service';
import { CarrierService } from './interfaces/carrier-service.interface';

@Injectable()
export class ShippingService {
  private readonly _carrierServices: Record<string, CarrierService>;

  constructor(
    private readonly upsService: UpsService,
    private readonly fedexService: FedexService,
  ) {
    //map carriers to their services.
    this._carrierServices = {
      UPS: this.upsService,
      FEDEX: this.fedexService,
    };
  };

  async getRatesByCarrier(dto: RateRequestDto) {
    const carrier = dto.carrier.toUpperCase();
    const service = this._carrierServices[carrier];

    if (!service) {
      throw new BadRequestException(
        `Carrier '${dto.carrier}' is not supported. Supported carriers: ${Object.keys(this._carrierServices).join(', ')}`,
      );
    };

    return service.getRate(dto);
  };

  // potential upgrade: get all rates.
  // async getAllRates(dto: RateRequestDto) {
  //   const carrierEntries = Object.entries(this._carrierServices);
  //   const results = await Promise.allSettled(
  //     carrierEntries.map(async ([name, service]) => {
  //       const rate = await service.getRate(dto);
  //       return { carrier: name, rate };
  //     }),
  //   );

  //   return results.map((result) => {
  //     if (result.status === 'fulfilled') {
  //       return result.value;
  //     }
  //     return {
  //       status: 'error',
  //       message: result.reason?.message || 'Failed to fetch rate',
  //     };
  //   });
  // };
}
