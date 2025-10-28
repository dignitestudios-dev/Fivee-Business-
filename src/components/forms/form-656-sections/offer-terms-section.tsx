"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface OfferTermsSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function OfferTermsSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: OfferTermsSectionProps) {
  const onSubmit = async () => {
    onNext();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 7: Offer Terms
        </h2>
        <p className="text-gray-600">
          By submitting this offer, I have read, understand and agree to the
          following terms and conditions:
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terms, Conditions, and Legal Agreement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            a) I request that the IRS accept the offer amount listed in this
            offer as payment of my outstanding tax debt arising under Title 26
            (including interest, penalties, and any additional amounts required
            by law) as of the date listed on this form. I authorize the IRS to
            amend Section 1 or Section 2 if I failed to list any of my assessed
            tax debt or tax debt assessed before acceptance of my offer. By
            submitting a joint offer, both signers grant approval to the
            Internal Revenue Service to disclose the existence of any separate
            liabilities owed.
          </p>
          <p>
            b) I also authorize the IRS to amend Section 1 or Section 2 by
            removing any tax years on which there is currently no outstanding
            liability. I understand that my offer will be accepted, by law,
            unless the IRS notifies me otherwise, in writing, within 24 months
            of the date the IRS receives my offer. I also understand that if any
            tax debt that is included in the offer is in dispute in any judicial
            proceeding that tax debt will not be included in determining the
            expiration of the 24-month period. I instruct the IRS to disregard
            any period on my Form 656 for court ordered restitution or under the
            jurisdiction of the Department of Justice.
          </p>
          <p>
            c) I voluntarily submit the payments made on this offer and
            understand that they will not be returned even if I withdraw the
            offer or the IRS rejects or returns the offer. Unless I designate
            how to apply each required payment in Section 5, the IRS will apply
            my payment in the best interest of the government, choosing which
            tax years and tax debts to pay off. The IRS will also keep my
            application fee unless the offer is not accepted for processing. IRS
            will keep my payments, fees, and some refunds.
          </p>
          <p>
            d) I understand that if I checked the Low-Income Certification in
            Section 1, then no payments are required. If I qualify for the
            Low-Income Certification and voluntarily submit payments, all money
            will be applied to my tax debt and will not be returned to me.
          </p>
          <p>
            e) Treas. Reg. section 301.7122(e)(5) states, in part, that
            acceptance of an offer in compromise will conclusively settle the
            liability for the tax periods specified in the offer. To enforce the
            regulation as a contract term, I agree that I cannot file an amended
            return for the tax years listed on Form 656 after the offer is
            accepted. Further, I agree that I will not file an amended return
            for the tax years listed on Form 656 after I have submitted my offer
            and while my offer remains pending [see section 7(j) below] with the
            Service. The filing of the amended return could be considered
            grounds for termination. In addition, any refunds related to an
            amended return filed for a tax year which has an ending date prior
            to offer acceptance will be offset to the tax liability. If I
            receive a refund prior to offer acceptance, or based on an amended
            return for any tax periods extending to the date my offer is
            accepted, I will return the refund within 30 days of receiving the
            refund. The IRS will keep any refund, including interest, that I
            might be due for tax assessed before the date the IRS accepts my
            offer. Systemic offset of overpayments will continue in accordance
            with IRC 6402(a) prior to the offer acceptance date. I understand
            that my tax refund may be offset to the tax liability while the
            offer is pending, but that assistance could be available for
            taxpayers (other than businesses) facing an economic hardship.
          </p>
          <p>
            f) I understand that the amount I am offering may not include part
            or all of an expected or current tax refund, money already paid,
            funds attached by any collection action, or anticipated benefits
            from a capital or net operating loss.
          </p>
          <p>
            g) The IRS will keep any monies it has collected prior to this
            offer. Under section 6331(k), the IRS may levy on my property and
            rights to property up to the time that the IRS official signs and
            acknowledges my offer as pending. The IRS may keep any proceeds
            arising from such a levy. No levy will be issued on individual
            shared responsibility payments. However, if the IRS served a
            continuous levy on wages, salary, or certain federal payments under
            sections 6331(e) or (h), then the IRS could choose to either retain
            or release the levy.
          </p>
          <p>
            h) The IRS will keep any payments that I make related to this offer.
            I agree that any funds submitted with this offer will be treated as
            a payment. I also agree that any funds submitted with periodic
            payments made after the submission of this offer and prior to the
            acceptance, rejection, or return of this offer will be treated as
            payments.
          </p>
          <p>
            i) If my offer is accepted and my final payment is more than the
            agreed amount, the IRS will not return the difference, but will
            apply the entire payment to my tax debt.
          </p>
          <p>
            j) Once an authorized IRS official signs this form, my offer is
            considered pending as of that signature date and it remains pending
            until the IRS accepts, rejects, or returns my offer, or I withdraw
            my offer. An offer is also considered pending for 30 days after any
            rejection of my offer by the IRS, and during the time that any
            rejection of my offer is being considered by the Appeals Office. An
            offer will be considered withdrawn when the IRS receives my written
            notification of withdrawal by personal delivery or certified mail or
            when I inform the IRS of my withdrawal by other means and the IRS
            acknowledges in writing my intent to withdraw the offer. For joint
            offers in compromise, if one spouse withdraws the offer, the offer
            will be considered to be withdrawn. Pending status of an offer and
            right to appeal
          </p>
          <p>
            k) I waive the right to an Appeals hearing if I do not request a
            hearing in writing within 30 days of the date the IRS notifies me of
            the decision to reject the offer.
          </p>
          <p>
            l) As both an express condition and as a contractual promise, I will
            strictly comply with all provisions of the internal revenue laws,
            including requirements to timely file tax returns and timely pay
            taxes for the five year period beginning with the date of acceptance
            of this offer and ending through the fifth year. I agree to promptly
            pay any liabilities assessed after acceptance of this offer for tax
            years ending prior to acceptance of this offer that were not
            otherwise identified in Section 1 or Section 2 of this agreement. I
            also understand that during the five year period I cannot request an
            installment agreement for unpaid taxes incurred before or after the
            accepted offer. I understand that I cannot request an offer for a
            tax liability during the five year period. If this is an offer being
            submitted for joint tax debt, and one of us does not comply with
            future obligations, only the non-compliant taxpayer will be in
            default of this agreement. An accepted offer will not be defaulted
            solely due to the assessment of an individual shared responsibility
            payment. I understand failure to pay any restitution-based
            assessments will provide basis for the default of my offer
            acceptance for administrative tax periods included on this Form 656.
            I must comply with my future tax obligations and understand I remain
            liable for the full amount of my tax debt until all terms and
            conditions of this offer have been met.
          </p>
          <p>
            m) I agree that I will remain liable for the full amount of the tax
            liability, accrued penalties and interest, until I have met all of
            the terms and conditions of this offer. Penalties and interest will
            continue to accrue until all payment terms of the offer have been
            met. If I file for bankruptcy before the terms and conditions of the
            offer are met, I agree that the IRS may file a claim for the full
            amount of the tax liability, accrued penalties and interest, and
            that any claim the IRS files in the bankruptcy proceeding will be a
            tax claim.
          </p>
          <p>
            n) Once the IRS accepts my offer in writing, I have no right to
            challenge the tax debt(s) in court or by filing a refund claim or
            refund suit for any liability or period listed in Section 1 or
            Section 2, even if the IRS defaults or rescinds the offer.
          </p>
          <p>
            o) If I fail to meet any of the terms of this offer, the IRS may
            revoke the certificate of release of federal tax lien and file a new
            notice of federal tax lien; levy or sue me to collect any amount
            ranging from one or more missed payments to the original amount of
            the tax debt (less payments made) plus penalties and interest that
            have accrued from the time the underlying tax liability arose. The
            IRS will continue to add interest, as required by section 6601 of
            the Internal Revenue Code, on the amount the IRS determines is due
            after default. I agree that if I provide false information or
            documents in conjunction with this offer or conceal my assets or my
            ability to pay, then the IRS may reopen my offer and exercise its
            discretion in the further treatment of the offer, including a
            termination of the offer contract. If the IRS terminates my offer
            contract, I will be liable for the full amount of the tax liability,
            accrued penalties and interest. I understand what will happen if I
            fail to meet the terms of my offer (e.g., default).
          </p>
          <p>
            p) To have my offer considered, I agree to the extension of the time
            limit provided by law to assess my tax debt (statutory period of
            assessment). I agree that the date by which the IRS must assess my
            tax debt will now be the date by which my debt must currently be
            assessed plus the period of time my offer is pending plus one
            additional year if the IRS rejects, returns, or terminates my offer
            or I withdraw it. (Paragraph (j) of this section defines pending and
            withdrawal.) I understand that I have the right not to waive the
            statutory period of assessment or to limit the waiver to a certain
            length or certain periods or issues. I understand, however, that the
            IRS may not consider my offer if I refuse to waive the statutory
            period of assessment or if I provide only a limited waiver. I also
            understand that the statutory period for collecting my tax debt will
            be suspended during the time my offer is pending with the IRS, for
            30 days after any rejection of my offer by the IRS, and during the
            time that any rejection of my offer is being considered by the
            Independent Office of Appeals. By submitting this offer I
            immediately withdraw any pending installment agreement that is on
            file for all tax periods and I understand a pending installment
            agreement (an installment agreement that has been accepted for
            processing but the IRS has not accepted its terms) will not be
            automatically reinstated after the offer is closed. I agree to waive
            time limits provided by law.
          </p>
          <p>
            q) The IRS may file a Notice of Federal Tax Lien during
            consideration of the offer or for offers that will be paid over
            time. If the offer is accepted, the tax lien(s) for the periods and
            taxes listed in Section 1 will generally be released within 45 days
            after the final payment has been received and verified. The time it
            takes to transfer funds to the IRS from commercial institutions
            varies based on the form of payment. If I have not finished paying
            my offer amount, then the IRS may be entitled to any proceeds from
            the sale of my property. The IRS will not file a Notice of Federal
            Tax Lien on any individual shared responsibility debt. I understand
            the IRS may file a Notice of Federal Tax Lien on my property.
          </p>
          <p>
            r) I authorize the IRS to correct any typographical or clerical
            errors or make minor modifications to my Form 656 that I signed in
            connection to this offer. Correction Agreement
          </p>
          <p>
            s) By authorizing the IRS to contact third parties, I understand
            that I will not be notified of which third parties the IRS contacts
            as part of the offer application process, including tax periods that
            have not been assessed, as stated in §7602 (c ) of the Internal
            Revenue Code. In addition, I authorize the IRS to request a consumer
            report on me from a credit bureau. I authorize the IRS to contact
            relevant third parties in order to process my offer.
          </p>
          <p>
            t) I understand that if the liability sought to be compromised is
            the joint and individual liability of myself and my co- obligor(s)
            and I am submitting this offer to compromise my individual liability
            only, then if this offer is accepted, it does not release or
            discharge my co-obligor(s) from liability. The United States still
            reserves all rights of collection against the co-obligor(s). I am
            submitting an offer as an individual for a joint liability.
          </p>
          <p>
            u) If your offer includes any shared responsibility payment (SRP)
            amount that you owe for not having minimum essential health coverage
            for you and, if applicable, your dependents per Internal Revenue
            Code Section 5000A - Individual shared responsibility payment, it is
            not subject to penalties (except applicable bad check penalty) or to
            lien and levy enforcement actions. However, interest will continue
            to accrue until you pay the total SRP balance due. We may apply your
            federal tax refunds to the SRP amount that you owe until it is paid
            in full. I understand the IRS Shared Responsibility Payment (SRP).
          </p>
          <p>
            v) The IRS is required to make certain information, such as taxpayer
            name, city/state/zip, liability amount, and offer terms, available
            for public inspection and review for one year after the date of
            offer acceptance. I understand the IRS is required to make certain
            information public.
          </p>
          <p>
            w) By sending and receiving encrypted messages through the IRS
            Secure Messaging platform, I agree to accept offer final
            determination letters on this platform. Secure Messaging
          </p>
          <p>
            x) If I submit a joint offer in compromise, it will remain joint
            unless both my spouse and I submit amended Forms 656. I understand
            that my joint offer in compromise will remain joint.
          </p>
        </CardContent>
      </Card>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={onSubmit}
      />
    </form>
  );
}
