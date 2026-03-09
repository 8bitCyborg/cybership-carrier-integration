import { RateRequestDto } from '../dto/rateRequest.dto';

export interface CarrierService {
  getRate(dto: RateRequestDto): Promise<any>;
}
