import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

//this dto only lists required fields from the ups rate endpoint.
//to accomodate other carriers, we could expand it to include fields that may be unique to them.
//but they should be consistent across carriers.
//It remains carrier agnostic as to make it work with another carrier, we just include a mapper for that carrier to translate these
//the objectnames the carrier api expects.

export class RateRequestDto {
  @IsString()
  @IsNotEmpty()
  carrier: string;

  @IsString()
  @IsNotEmpty()
  originZip: string;

  @IsString()
  @IsNotEmpty()
  destinationZip: string;

  @IsNumber()
  @Min(0.1)
  weight: number;

  /**
   * Optional Dimensions (for ups). Might be required for fedEx or usps, etc. Will probably need to force the FE client to pass these then?
   * If not provided, the Mapper will default these to 1x1x1 to prevent API failure.
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  length?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  width?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  height?: number;

  // These can be populated as hidden fields in the web-client.
  @IsString()
  @IsOptional()
  serviceCode?: string;

  @IsString()
  @IsNotEmpty()
  originCountryCode: string;

  @IsString()
  @IsNotEmpty()
  destinationCountryCode: string;

  //optional. only here to test errorcodes.
  @IsOptional()
  @IsNumber()
  errorCode?: number;
};
