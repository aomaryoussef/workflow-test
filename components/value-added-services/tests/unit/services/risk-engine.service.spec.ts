import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { RiskEngineService } from '../../../src/services/risk-engine.service';
import { settings } from '../../../config/settings';
import {
  BadRequestError,
  GenericError,
  ServiceUnavailableError,
} from '../../../src/exceptions/custom-exceptions';

// TODO: rewrite the test suite

// Mock uuid to return a consistent trace_id
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-trace-id'),
}));

describe('RiskEngineService', () => {
  let service: RiskEngineService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskEngineService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RiskEngineService>(RiskEngineService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return risk score successfully', async () => {
    const bookingTime = '2023-01-01T00:00:00';
    const data = { client_id: '123' };

    const mockResponse: AxiosResponse = {
      data: { score: 100 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        url: settings.riskEngine.url,
        method: 'POST',
        headers: AxiosHeaders.from({
          'Content-Type': 'application/json',
          'api-key': settings.riskEngine.apiKey as string,
        }),
      },
    };

    jest.spyOn(httpService, 'post').mockReturnValueOnce(of(mockResponse));

    const result = await service.getRiskScore(bookingTime, data);
    expect(result).toEqual(mockResponse.data);
    expect(httpService.post).toHaveBeenCalledWith(
      settings.riskEngine.url,
      {
        booking_time: bookingTime,
        scenario: 'SCORING',
        data: data,
      },
      expect.any(Object),
    );
  });

  it('should throw BadRequestError for non-200 status', async () => {
    const bookingTime = '2023-01-01T00:00:00';
    const data = { client_id: '123' };

    const mockResponse: AxiosResponse = {
      data: { message: 'Invalid request' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {
        url: settings.riskEngine.url,
        method: 'POST',
        headers: AxiosHeaders.from({
          'Content-Type': 'application/json',
          'api-key': settings.riskEngine.apiKey as string,
        }),
      },
    };

    jest.spyOn(httpService, 'post').mockReturnValueOnce(of(mockResponse));

    await expect(service.getRiskScore(bookingTime, data)).rejects.toThrow(
      BadRequestError,
    );
  });

  it('should throw ServiceUnavailableError on timeout', async () => {
    const bookingTime = '2023-01-01T00:00:00';
    const data = { client_id: '123' };

    const timeoutError = {
      name: 'TimeoutError',
      message: 'Timeout has occurred',
    };

    jest
      .spyOn(httpService, 'post')
      .mockReturnValueOnce(throwError(timeoutError));

    await expect(service.getRiskScore(bookingTime, data)).rejects.toThrow(
      ServiceUnavailableError,
    );
  });

  it('should throw BadRequestError when error.response is present', async () => {
    const bookingTime = '2023-01-01T00:00:00';
    const data = { client_id: '123' };

    const apiError = {
      response: { message: 'API Error' },
    };

    jest.spyOn(httpService, 'post').mockReturnValueOnce(throwError(apiError));

    await expect(service.getRiskScore(bookingTime, data)).rejects.toThrow(
      BadRequestError,
    );
  });

  it('should throw GenericError for network issues or other errors', async () => {
    const bookingTime = '2023-01-01T00:00:00';
    const data = { client_id: '123' };

    const networkError = {
      message: 'Network Error',
    };

    jest
      .spyOn(httpService, 'post')
      .mockReturnValueOnce(throwError(networkError));

    await expect(service.getRiskScore(bookingTime, data)).rejects.toThrow(
      GenericError,
    );
  });
});
