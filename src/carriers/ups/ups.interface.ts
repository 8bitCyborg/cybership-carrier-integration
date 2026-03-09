export interface UpsAuthResponse {
  token_type: string;
  issued_at: string;
  client_id: string;
  access_token: string;
  scope: string;
  expires_in: string;
  refresh_count: string;
  status: string;
}

export interface UpsRateResponse {
  RateResponse: {
    Response: {
      ResponseStatus: {
        Code: string;
        Description: string;
      };
      TransactionReference: {
        CustomerContext: string;
      };
    };
    RatedShipment: any; // Simplified for now as it can be object or array
  };
};
