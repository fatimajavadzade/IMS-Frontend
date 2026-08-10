// Backend-dən gələn satış sifariş statusları.
export const ORDER_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
};

export const ORDER_STATUS_LABELS = {
  PENDING: "Gözləmədə",
  COMPLETED: "Tamamlanıb",
  CANCELED: "Ləğv edilib",
};

export const ORDER_STATUS_TONES = {
  PENDING: "warn",
  COMPLETED: "good",
  CANCELED: "bad",
};

export const ORDER_STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS);