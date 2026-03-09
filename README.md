# Carrier Integration Service

A NestJS-based service for integrating with various shipping carriers (starting with UPS). This service provides a unified API for fetching shipping rates.
All carrier APIs will be called from the Shipping module using the same request body. Requests and responses are 'mapped' so the client does not have to bother about structuring requests to fit each carrier's requirement.

## Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher recommended)
- [Yarn](https://yarnpkg.com/) or NPM

## Getting Started

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
yarn install
```

### Configuration

Create a `.env` file in the root directory and add your carrier credentials (see `.env.example`).

### Running the Project

To start the application in development mode with hot-reloading:

```bash
yarn start:dev
```
The server will be available at `http://localhost:3000`.


## API Endpoints

### Get Shipping Rates

**POST** `/shipping/rates`

Fetch shipping rates from a specified carrier.

#### Payload Structure

The request body should be a JSON object with the following fields:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `carrier` | `string` | Yes | The carrier name (e.g., "ups"). |
| `originZip` | `string` | Yes | The origin ZIP/postal code. |
| `destinationZip` | `string` | Yes | The destination ZIP/postal code. |
| `weight` | `number` | Yes | The package weight (minimum 0.1). |
| `originCountryCode` | `string` | Yes | The origin country code (e.g., "US"). |
| `destinationCountryCode` | `string` | Yes | The destination country code (e.g., "US"). |
| `length` | `number` | No | Package length (defaults to 1). |
| `width` | `number` | No | Package width (defaults to 1). |
| `height` | `number` | No | Package height (defaults to 1). |
| `serviceCode` | `string` | No | Specific carrier service code. |
| `errorCode` | `number` | No | Used to simulate specific error response |

#### Example Request

```json
{
  "carrier": "ups",
  "originZip": "10001",
  "destinationZip": "90210",
  "weight": 5,
  "originCountryCode": "US",
  "destinationCountryCode": "US",
  "length": 10,
  "width": 10,
  "height": 10,
  "errorCode": 400,
}
```

#### Example 200 Response
```json
[
  {
    "carrier": "ups",
    "service": "UPS Ground",
    "rate": 15.50,
    "currency": "USD",
    "deliveryDate": "2026-03-12"
  }
]
```

## Testing
Run unit tests:

```bash
yarn test
```
To test errors, just add an errorCode property to the request payload in Postman or CURL. Excluding it will return a 200 response.
Adding a serviceCode property with a string property of '03' determines if the response is 'Ground Rate' or 'Shop Rates'.


## Extensibility
Adding a new UPS service is just a matter of adding a function for it in the ups service file and calling it from the shipping controller.

Adding a new carrier is just a matter of creating a new module for it, following the pattern in UPS carrier. The new module will have it's own mapper, service file, etc.


## Potential Update
The HttpService would ideally be an axios abstraction that lives in it's own class and can be reused across different carriers and operations.
The different carrier modules can define their own token/refresh methods and the httpService simply calls that when it's used, etc.
