import Cloudflare from 'cloudflare';

export class CloudflareService {
  private cloudflare: any;
  private zoneId: string;

  constructor() {
    this.cloudflare = new Cloudflare({ apiToken: process.env.CLOUDFLARE_API_TOKEN });
    this.zoneId = process.env.CLOUDFLARE_ZONE_ID || '';
  }

  async addSubdomain(subdomain: string, ipAddress: string) {
    try {
      const response = await this.cloudflare.dnsRecords.add(this.zoneId, {
        type: 'A',
        name: subdomain,
        content: ipAddress,
        proxied: true
      });

      return { success: true, result: response.result };
    } catch (error: any) {
      console.error('Cloudflare API error:', error);

      if (error.errors?.length > 0) {
        const errorCode = error.errors[0].code;
        const errorMessage = error.errors[0].message;

        switch (errorCode) {
          case 81058:
            return { success: false, error: 'Subdomain already exists', code: errorCode };
          case 1004:
            return { success: false, error: 'Invalid DNS record', code: errorCode, message: errorMessage };
          case 7003:
            return { success: false, error: 'Invalid Zone ID', code: errorCode, message: errorMessage };
          default:
            return { success: false, error: 'Cloudflare API error', code: errorCode, message: errorMessage };
        }
      }

      return { success: false, error: 'Unknown error occurred', message: error.message };
    }
  }
}