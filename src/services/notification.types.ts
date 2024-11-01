export interface Channel {
  id: string,
  name: string,
  isEnabled: boolean,
  type: ChannelType,
  configuration: {
    host: string,
    port: number,
    user: string,
    password: string,
  },
  shouldNotifyBookingConfirmation: boolean,
  shouldNotifyBookingConfirmationToHotel: boolean,
};

export enum ChannelType {
  Email = 'Email',
}

export interface NewChannel {
  name: string,
  type: ChannelType,
  configuration: {
    host: string,
    port: number,
    user: string,
    password: string,
  }
};

export function emptyChannel() {
  return {
    id: '',
    type: ChannelType.Email,
    name: '',
    isEnabled: false,
    shouldNotifyBookingConfirmation: false,
    shouldNotifyBookingConfirmationToHotel: false,
    configuration: { host: '', port: 0, user: '', password: '' },
  }
}
