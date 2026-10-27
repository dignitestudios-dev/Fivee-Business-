// Pure Form 433-A asset math. Dependency-free on purpose: FiveeBackend's jest
// suite imports this file to prove it matches the backend's calculation.
const FACTOR = 0.8;
const BANK_ALLOWANCE = 1000;
const VEHICLE_DEDUCTION = 3450;
const PERSONAL_EFFECTS_DEDUCTION = 11980;

const n = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const quickSaleNet = (item: any) =>
  Math.max(0, n(item?.currentMarketValue) * FACTOR - n(item?.loanBalance));
const sum = (list: any[] | undefined, fn: (x: any, i: number) => number) =>
  (list || []).reduce((t, x, i) => t + fn(x, i), 0);

export function computeAssetEquity(a: any): number {
  const bank = Math.max(0, sum(a.bankAccounts, (x) => n(x.balance)) - BANK_ALLOWANCE);
  const investments = sum(a.investmentAccounts, (x) =>
    Math.max(0, n(x.currentMarketValue) - n(x.loanBalance))
  );
  const digital = sum(a.digitalAssets, (x) => n(x.usdEquivalent));
  const retirement = sum(a.retirementAccounts, quickSaleNet);
  const insurance = sum(a.lifeInsurancePolicies, (x) =>
    Math.max(0, n(x.currentCashValue) - n(x.loanBalance))
  );
  const property = sum(a.realProperties, quickSaleNet);
  const vehicles = sum(a.vehicles, (v, i) => {
    if (v.ownershipType === "lease") return 0;
    const base = quickSaleNet(v);
    return i === 0 || v.isJointOffer
      ? Math.max(0, base - VEHICLE_DEDUCTION)
      : base;
  });
  const valuables = Math.max(
    0,
    sum(a.valuableItems, quickSaleNet) +
      sum(a.furniturePersonalEffects, quickSaleNet) -
      PERSONAL_EFFECTS_DEDUCTION
  );
  return Math.max(
    0,
    bank + investments + digital + retirement + insurance + property + vehicles + valuables + n(a.cash)
  );
}

const pos = (v: any) => Math.max(0, n(v));

/** Business income/expense step -> Box C (mirrors calculateBusinessTotals). */
export function computeBusinessBoxC(b: any): number {
  const income =
    n(b.grossReceipts) + n(b.grossRentalIncome) + n(b.interestIncome) +
    n(b.dividends) + n(b.otherIncome);
  const expenses =
    n(b.materialsPurchased) + n(b.inventoryPurchased) + n(b.grossWagesSalaries) +
    n(b.rent) + n(b.supplies) + n(b.utilitiesTelephones) + n(b.vehicleCosts) +
    n(b.businessInsurance) + n(b.currentBusinessTaxes) + n(b.securedDebts) +
    n(b.otherBusinessExpenses);
  return Math.max(0, income - expenses);
}

const personIncome = (p: any) =>
  Math.max(0, n(p?.grossWages) + n(p?.socialSecurity) + n(p?.pension) + n(p?.otherIncome));

/** Household step -> Boxes D, E, F (mirrors calculateHouseholdIncomeExpense). */
export function computeHouseholdBoxes(
  h: { income?: any; expenses?: any },
  boxC: number
): { boxD: number; boxE: number; boxF: number } {
  const i = h.income || {};
  const e = h.expenses || {};
  const boxD = Math.max(
    0,
    personIncome(i.primaryTaxpayer) +
      personIncome(i.spouse) +
      pos(i.interestDividendsRoyalties) + pos(i.distributions) +
      pos(i.netRentalIncome) + pos(boxC) + pos(i.childSupportReceived) +
      pos(i.alimonyReceived) + pos(i.additionalSourcesIncome)
  );
  const boxE = Math.max(
    0,
    pos(e.foodClothingMiscellaneous) + pos(e.housingUtilities) +
      pos(e.vehicleLoanLeasePayments) + pos(e.vehicleOperatingCosts) +
      pos(e.publicTransportationCosts) + pos(e.healthInsurancePremiums) +
      pos(e.outOfPocketHealthCare) + pos(e.courtOrderedPayments) +
      pos(e.childDependentCare) + pos(e.lifeInsurancePremiums) +
      pos(e.currentMonthlyTaxes) + pos(e.securedDebts) + pos(e.monthlyTaxPayments)
  );
  return { boxD, boxE, boxF: Math.max(0, boxD - boxE) };
}
