import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { mockNetworkRequest } from '../../utils/mockHttpservice';
import { UpsAuthResponse } from './ups.interface';

@Injectable()
export class UpsAuthService {
  private readonly logger = new Logger(UpsAuthService.name);
  private readonly CACHE_KEY = 'ups_auth_token';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) { }

  /**
   * Main entry point: Gets a valid token from cache or fetches a new one.
   */
  async getAccessToken(): Promise<string> {
    const cachedToken = await this.cacheManager.get<string>(this.CACHE_KEY);
    if (cachedToken) return cachedToken;
    return this.refreshAccessToken();
  };

  /**
   * Acquire a new token and update the cache.
   */
  async refreshAccessToken(): Promise<string> {
    const baseUrl = this.config.get<string>('UPS_BASE_URL');
    const clientId = this.config.get<string>('UPS_CLIENT_ID');
    const clientSecret = this.config.get<string>('UPS_CLIENT_SECRET');
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const url = `${baseUrl}/security/v1/oauth/token`;
    try {
      const response = await mockNetworkRequest<UpsAuthResponse>(url, { grant_type: credentials });
      const { access_token, expires_in } = response.data;

      // Store in cache with a 60-second expiry,
      const ttl = (parseInt(expires_in) - 60) * 1000;
      await this.cacheManager.set(this.CACHE_KEY, access_token, ttl); //

      return access_token;
    } catch (error) {
      this.logger.error(
        `UPS Auth Failed: ${error.response?.data?.message || error.message}`,
      );
      throw error;
    }
  }
}
