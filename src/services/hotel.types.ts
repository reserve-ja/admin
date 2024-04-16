export type Hotel = NoneHotel | LetohHotel;

export type Pms = 'None' | 'Letoh';

interface BaseHotel {
  id: string,
  name: string,
  pms: Pms,
}

interface NoneHotel extends BaseHotel {
  pms: 'None',
  configuration: NoneConfig,
}

interface LetohHotel extends BaseHotel {
  pms: 'Letoh',
  configuration: LetohConfig,
}

export type PmsConfig = NoneConfig | LetohConfig;

export class NoneConfig {}

export class LetohConfig {
  nrSerie: string = '';
  host: string = '';
  username: string = '';
  password: string = '';
}
