// IRS Form 433-A/433-B (OIC) constants. These MUST match FiveeBackend
// (form433a.service.ts / form433b-oic.service.ts); the backend is authoritative.
export const OIC_RULES = {
  quickSaleFactor: 0.8,
  bankAllowance: 1000,
  vehicleDeduction: 3450,
  personalEffectsDeduction: 11980,
  shortPaymentMonths: 12,
  periodicPaymentMonths: 24,
} as const;
