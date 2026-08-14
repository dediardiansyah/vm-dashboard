declare module 'midtrans-client' {
  interface Config {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface TransactionResponse {
    token: string;
    redirect_url: string;
  }

  export class Snap {
    constructor(config: Config);
    createTransaction(params: any): Promise<TransactionResponse>;
  }

  export class CoreApi {
    constructor(config: Config);
  }
} 