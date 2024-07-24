export type Gateway = ApiPixGateway | OpenPixGateway;
export type GatewayConfig = ApiPixConfig | OpenPixConfig;

export enum PaymentMethod {
  Pix = "Pix",
}

export enum PaymentStatus {
  Requested = "Requested",
  Paid = "Paid",
  Canceled = "Canceled",
  Refunded = "Refunded",
}

export enum GatewayType {
  ApiPix = "ApiPix",
  OpenPix = "OpenPix",
}

export type Payment = {
  id: string,
  bookingId: string,
  amount: number,
  method: PaymentMethod,
  status: PaymentStatus,
  createdAt: Date,
}

interface BaseGateway {
  id: string,
  name: string,
  isActive: boolean,
  method: PaymentMethod,
  type: GatewayType,
  configuration: GatewayConfig,
}

interface ApiPixGateway extends BaseGateway {
  type: GatewayType.ApiPix,
  configuration: ApiPixConfig,
}

export class ApiPixConfig {
  expirationInMinutes: number = 10;
  pixKey: string = '';
  baseUrl: string = '';
  authUrl: string = '';
  clientId: string = '';
  clientSecret: string = '';
  certificate: string = '';
}

interface OpenPixGateway extends BaseGateway {
  type: GatewayType.OpenPix,
  configuration: OpenPixConfig,
}

export class OpenPixConfig {
  expirationInMinutes: number = 15;
  appId: string = '';
}
