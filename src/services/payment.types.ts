export type Gateway = PixApiGateway;
export type GatewayConfig = PixApiConfig;

export enum PaymentMethod {
  Pix = "Pix",
}

export enum GatewayType {
  PixApi = "PixApi",
}

interface BaseGateway {
  id: string,
  name: string,
  isActive: boolean,
  method: PaymentMethod,
  type: GatewayType,
  configuration: PixApiConfig,
}

interface PixApiGateway extends BaseGateway {
  type: GatewayType.PixApi,
  configuration: PixApiConfig,
}

export class PixApiConfig {
  expirationInMinutes: number = 10;
  pixKey: string = '';
  baseUrl: string = '';
  authUrl: string = '';
  clientId: string = '';
  clientSecret: string = '';
  certificate: string = '';
}
