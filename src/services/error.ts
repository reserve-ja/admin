import { ref } from "vue";

class UserError {
  constructor(message: string) {
    this.message = message;
  }

  static fromCode(code?: string) {
    if (!code) {
      return new UserError('Erro desconhecido');
    }

    return new UserError(errorMessages[code] ?? 'Erro desconhecido');
  }

  message: string;
}

const errors = ref<UserError[]>([]);
export function useErrors() {
  const pushError = (code?: string) => {
    errors.value.push(UserError.fromCode(code));
  }

  const shiftError = () => errors.value.shift();

  return { errors, pushError, shiftError }
}

const errorMessages: Record<string, string>  = {
  'Gateway.AnotherActiveForMethod': 'Já existe outro gateway ativo utilizando o mesmo método de pagamento.',
}
