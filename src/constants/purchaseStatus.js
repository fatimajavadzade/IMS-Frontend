// Backend-dən gələn satınalma statusları.
export const PURCHASE_STATUS = {
  PENDING: "PENDING",
  RECEIVED: "RECEIVED",
  REJECTED: "REJECTED",
};

export const PURCHASE_STATUS_LABELS = {
  PENDING: "Gözləmədə",
  REJECTED: "Rədd edilib",
  RECEIVED: "Qəbul edilib",
};

export const PURCHASE_STATUS_TONES = {
  PENDING: "warn",
  REJECTED: "bad",
  RECEIVED: "good",
};

export const PURCHASE_STATUS_OPTIONS = Object.keys(PURCHASE_STATUS);