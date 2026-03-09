export const authResponse = {
  "token_type": "Bearer",
  "issued_at": "1741478127000",
  "client_id": "cybership_client_id_demo_2026",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_token",
  "scope": "read:rates",
  "expires_in": "3600",
  "refresh_count": "0",
  "status": "approved"
};

export const rateResponse = {
  "RateResponse": {
    "Response": {
      "ResponseStatus": {
        "Code": "1",
        "Description": "Success"
      },
      "TransactionReference": {
        "CustomerContext": "Cybership_Demo_Context"
      }
    },
    "RatedShipment": [
      {
        "Service": {
          "Code": "03",
          "Description": "UPS Ground"
        },
        "BillingWeight": {
          "UnitOfMeasurement": { "Code": "LBS" },
          "Weight": "10.0"
        },
        "TotalCharges": {
          "CurrencyCode": "USD",
          "MonetaryValue": "12.50"
        },
        "GuaranteedDelivery": {
          "BusinessDaysInTransit": "4",
          "DeliveryByTime": "End of Day"
        }
      },
      {
        "Service": {
          "Code": "02",
          "Description": "UPS 2nd Day Air"
        },
        "BillingWeight": {
          "UnitOfMeasurement": { "Code": "LBS" },
          "Weight": "10.0"
        },
        "TotalCharges": {
          "CurrencyCode": "USD",
          "MonetaryValue": "34.20"
        },
        "GuaranteedDelivery": {
          "BusinessDaysInTransit": "2",
          "DeliveryByTime": "12:00 PM"
        }
      },
      {
        "Service": {
          "Code": "01",
          "Description": "UPS Next Day Air"
        },
        "BillingWeight": {
          "UnitOfMeasurement": { "Code": "LBS" },
          "Weight": "10.0"
        },
        "TotalCharges": {
          "CurrencyCode": "USD",
          "MonetaryValue": "68.90"
        },
        "GuaranteedDelivery": {
          "BusinessDaysInTransit": "1",
          "DeliveryByTime": "10:30 AM"
        }
      }
    ]
  }
};

export const groundRateResponse = {
  "RateResponse": {
    "Response": {
      "ResponseStatus": {
        "Code": "1",
        "Description": "Success"
      },
      "TransactionReference": {
        "CustomerContext": "Cybership_Demo_Context"
      }
    },
    // Returning as a single object to test mapper resilience
    "RatedShipment": {
      "Service": {
        "Code": "03",
        "Description": "UPS Ground"
      },
      "BillingWeight": {
        "UnitOfMeasurement": { "Code": "LBS" },
        "Weight": "10.0"
      },
      "TotalCharges": {
        "CurrencyCode": "USD",
        "MonetaryValue": "12.50"
      },
      "GuaranteedDelivery": {
        "BusinessDaysInTransit": "4",
        "DeliveryByTime": "End of Day"
      }
    }
  }
};