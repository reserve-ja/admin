export type Room = {
  id: string,
  hotelId: string,
  externalId: string,
  name: string,
  description: string,
  capacity: number,
  photos: string[],
}

export type Rate = {
  id: string,
  roomId: string,
  defaultPrice: number,
  start: string,
  end: string,
  prices: RatePrice[],
}

export type RatePrice = {
  amount: number,
  guests: number,
  paymentMethod: string,
}
