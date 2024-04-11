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

export type NoneConfig = {};

export type LetohConfig = {
  nrSerie: string,
  host: string,
  username: string,
  password: string,
}
