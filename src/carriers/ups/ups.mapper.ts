// src/carriers/ups/ups.mapper.ts
import { Injectable } from '@nestjs/common';
import { RateRequestDto } from '../../shipping/dto/rateRequest.dto';

@Injectable()
export class UpsMapper {
  //the mapper that transforms our client request into the ups request object.
  upsRequestMapper(dto: RateRequestDto) {
    return {
      RateRequest: {
        Request: {
          TransactionReference: {
            CustomerContext: `Cybership_Rate_Req_${Date.now()}`,
          },
        },
        Shipment: {
          Shipper: {
            Name: 'Cybership Demo Shipper',
            Address: {
              AddressLine: ['Main Street'],
              CountryCode: dto.originCountryCode || 'US',
            },
          },
          ShipTo: {
            Name: 'Recipient',
            Address: {
              AddressLine: ['Destination Street'],
              CountryCode: dto.destinationCountryCode || 'US',
            },
          },
          Service: {
            Code: dto.serviceCode || '', // Defaults to "Shop"
          },
          Package: [
            {
              PackagingType: {
                Code: '02',
                Description: 'Customer Supplied',
              },
              Dimensions: {
                UnitOfMeasurement: { Code: 'IN' },
                Length: (dto.length || '1').toString(),
                Width: (dto.width || '1').toString(),
                Height: (dto.height || '1').toString(),
              },
              PackageWeight: {
                UnitOfMeasurement: { Code: 'LBS' },
                Weight: dto.weight.toString(),
              },
            }
          ],
        },
      },
    };
  };

  // the mapper that transforms the ups response into a clean object.
  upsResponseMapper(upsData: any) {
    const shipments = upsData?.RateResponse?.RatedShipment;
    // default mode is shop but if ground is specified with 03 and ups returns only an object, 
    // normalize it into an array so .map does not fail.
    const shipmentList = Array.isArray(shipments) ? shipments : [shipments];

    return shipmentList
      .filter((rate) => !!rate)
      .map((rate) => ({
        carrier: 'UPS',
        serviceCode: rate.Service?.Code, //can be used on the frontend to display the service name
        serviceName: rate.Service?.Description,
        totalAmount: rate.TotalCharges?.MonetaryValue || '0.00',
        currency: rate.TotalCharges?.CurrencyCode || 'USD',
        deliveryDays: rate.GuaranteedDelivery?.BusinessDaysInTransit || 'N/A',
        billingWeight: `${rate.BillingWeight?.Weight || '0'} ${rate.BillingWeight?.UnitOfMeasurement?.Code || 'LBS'}`,
      }));
  };

};