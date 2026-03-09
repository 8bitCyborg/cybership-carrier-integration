import { access } from "fs";
import { authResponse, rateResponse, groundRateResponse } from "./mockResponses";

export const errorMessageHelper = (statusCode: number = 400) => {
  switch (statusCode) {
    case 400:
      return 'The server does not understand this request.';
    case 401:
      return 'This request is unauthorized.';
    case 403:
      return 'The server understood the request, but is refusing to fulfill it.';
    case 429:
      return 'Server is busy at the moment. Please try again later.';
    default:
      return 'The server encountered an unexpected error.';
  }
};

// this would ideally be a global abstraction of the axios httpservice that handles the fetch/refresh of tokens for the different carriers.
// probaly use a mutex to lock it as well.
// mocking the api calls here instead.
export async function mockNetworkRequest<T = any>(
  url: string,
  payload?: any,
  status = 200,
): Promise<{ status: number; data: T }> {
  if (status >= 400) {
    throw {
      response: {
        status,
        data: {
          errors: [{ message: errorMessageHelper(status) }]
        },
      },
    };
  };
  console.log('Payload', payload); //added here to visualize payload building.

  const isAuth = url.includes('auth') || url.includes('/oauth');
  const rateRequestResponse = url.slice(-4) === 'rate' ? groundRateResponse : rateResponse;
  let responseData = isAuth ? authResponse : rateRequestResponse;

  return { status, data: responseData as any };
};


