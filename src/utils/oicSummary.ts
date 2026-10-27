import api from "@/lib/services";
import { OIC_RULES } from "@/lib/oicRules";
import { FORM_433A_SECTIONS, FORM_433B_SECTIONS } from "@/lib/constants";
import type { CalculationSummary } from "@/lib/features/form433aSlice";

const num = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const section = async (
  fetcher: (caseId: string, s: any) => Promise<any>,
  caseId: string,
  name: string
) => {
  try {
    const resp = await fetcher(caseId, name);
    return resp?.data?.data ?? {};
  } catch {
    return {};
  }
};

type Boxes = Pick<CalculationSummary, "boxA" | "boxB" | "boxC" | "boxD" | "boxE" | "boxF">;

const withOffer = (s: Boxes, calc: any, assetBase: number): CalculationSummary => {
  const boxG = s.boxF * OIC_RULES.shortPaymentMonths;
  const boxH = s.boxF * OIC_RULES.periodicPaymentMonths;
  const paymentTimeline = calc?.paymentTimeline || "";
  const futureIncome =
    paymentTimeline === "5_months_or_less" ? boxG : paymentTimeline === "6_to_24_months" ? boxH : 0;
  // The backend stores the authoritative offer; only fall back to the formula
  // when it has not been calculated yet.
  const minimumOfferAmount =
    calc?.minimumOfferAmount !== undefined
      ? num(calc.minimumOfferAmount)
      : assetBase + futureIncome;
  return {
    ...s,
    boxG,
    boxH,
    futureIncome,
    paymentTimeline,
    minimumOfferAmount,
    monthlyPaymentAmount:
      paymentTimeline === "5_months_or_less" ? minimumOfferAmount / 5 : 0,
  };
};

/** Form 433-A summary built only from values stored by the backend. */
export async function fetch433aSummary(caseId: string): Promise<CalculationSummary> {
  const get = (name: string) => section(api.get433aSectionInfo as any, caseId, name);
  const [assets, bizAssets, bizIncome, household, calc] = await Promise.all([
    get(FORM_433A_SECTIONS[2]),
    get(FORM_433A_SECTIONS[4]),
    get(FORM_433A_SECTIONS[5]),
    get(FORM_433A_SECTIONS[6]),
    get(FORM_433A_SECTIONS[7]),
  ]);
  return withOffer(
    {
      boxA: num(assets.boxA),
      boxB: num(bizAssets.boxB),
      boxC: num(bizIncome.boxC),
      boxD: num(household.income?.boxD ?? household.boxD),
      boxE: num(household.expenses?.boxE ?? household.boxE),
      boxF: num(household.boxF),
    },
    calc,
    num(assets.boxA) + num(bizAssets.boxB)
  );
}

/** Form 433-B summary built only from values stored by the backend. */
export async function fetch433bSummary(caseId: string): Promise<CalculationSummary> {
  const get = (name: string) => section(api.get433bSectionInfo as any, caseId, name);
  const [assets, income, expense, calc] = await Promise.all([
    get(FORM_433B_SECTIONS[1]),
    get(FORM_433B_SECTIONS[2]),
    get(FORM_433B_SECTIONS[3]),
    get(FORM_433B_SECTIONS[4]),
  ]);
  const boxB = num(income.BoxB);
  const boxC = num(expense.BoxC);
  const boxD = num(expense.BoxD ?? Math.max(0, boxB - boxC));
  return withOffer(
    { boxA: num(assets.BoxA), boxB, boxC, boxD, boxE: 0, boxF: boxD },
    calc,
    num(assets.BoxA)
  );
}
