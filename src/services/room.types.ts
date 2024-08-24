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
  ratePlanId: string,
  price: number,
  date: string,
}

export enum WeekDay {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}
