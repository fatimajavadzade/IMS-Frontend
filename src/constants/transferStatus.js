export const TRANSFER_STATUS = {
  PENDING: "PENDING",
  IN_TRANSIT: "IN_TRANSIT",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
};

export const TRANSFER_STATUS_LABELS = {
  PENDING: "Gözləmədə",
  IN_TRANSIT: "Yolda",
  COMPLETED: "Tamamlanıb",
  REJECTED: "Rədd edilib",
};

export const TRANSFER_STATUS_TONES = {
  PENDING: "warn",
  IN_TRANSIT: "brand",
  COMPLETED: "good",
  REJECTED: "bad",
};

export const TRANSFER_STATUS_OPTIONS = Object.keys(TRANSFER_STATUS);