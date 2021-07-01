export enum Status {
  VALID = `valid`,
  INVALID = `invalid`,
};

export interface Validate {
  valid: boolean;
  errors: object;
}

// Клиент с биллинга
export interface ClientBilling {
  id: number;      // это внутренний уникальный номер
  title: string;   // это номер договора
  login: string;
  address?: string;
  fio?: string;
  org?: string;
  phone?: string;
  sernum?: string;
  issuer?: string;
  issuedate?: string;
};

// Клиент для отправки в Битрикс
export interface PreparedClient {
  ORIGIN_ID: number;      // Id в биллинге
  TITLE: string;          // Название компании для Битрикс
  CONTRACT: string;       // это номер договора
  CREATED_BY_ID: number;  // Кто создал 1 - Корзан Вячеслав
  ASSIGNED_BY_ID: number; // Назначенный ответственный

  org?: string;
  statusTitle: Status;    // Статус TITLE
  status: Status;         // Статус общий
};

export interface Result {
  status: Status;
  title: string;
};