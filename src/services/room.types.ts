export type Room = {
  id: string,
  hotelId: string,
  externalId: string,
  name: string,
  capacity: number,
}

export type Rate = {
  id: string,
  roomId: string,
  defaultPrice: number,
  start: string,
  end: string,
  prices: {
    value: number,
    guests: number,
    paymentMethod: string,
  }[],
}
