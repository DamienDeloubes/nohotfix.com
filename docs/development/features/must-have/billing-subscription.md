# Feature: Billing & Subscription Management

_Last updated: 2026-03-01_

## Overview

NoHotfix operates on a flat monthly subscription model with a 14-day free trial and no permanent free tier. Billing is handled through **Stripe** as the payment provider. Subscription state is enforced at the organisation level — all members of an org share a single subscription. Access is gated for orgs whose trial has expired and who have not subscribed.

## Complexity Assessment

- **Technical Complexity**: Medium — Stripe integration (checkout, webhooks, subscription state), trial countdown logic, and access enforcement middleware require careful coordination; webhook reliability is critical for keeping subscription state accurate.
- **Design Complexity**: Low — the billing UI is limited to a single Settings page and contextual banners; no complex flow design required beyond the Stripe-hosted checkout.
- **User Experience Complexity**: Low — the trial countdown and upgrade flow are industry-standard patterns; the key UX task is making the upgrade path frictionless and communicating the trial status clearly without being intrusive.

---

## Detailed Description

### Payment Provider

**Stripe** is the payment provider for v1. Stripe Checkout (hosted) is used for the initial subscription flow. Stripe Customer Portal (hosted) is used for plan and payment management after subscription. No payment details are stored by NoHotfix — all sensitive card handling is delegated to Stripe.

---

### Trial

**Trial clock:** The 14-day free trial starts at **org creation time** — the moment the Admin completes signup and names their team. The clock runs from that instant, not from first login or first playbook created.

**Trial access:** Full product access during the trial. No feature limitations. No prompts to upgrade (other than the countdown banner in the final 3 days).

**Trial countdown banner:** A non-blocking banner appears at the top of every page during the last 3 days of the trial. It shows the exact number of days remaining and a "Upgrade now" link. The banner is informational — it does not prevent use of any feature.

**Format:** _"Your trial ends in [X days] — upgrade to keep access."_ — shown on all pages for the trial owner (Admin) only. Members do not see the trial countdown banner.

---

### Trial Expiry

When the 14-day trial period ends without a paid subscription being activated:

**For Admin users:**

- A full-page **upgrade prompt** replaces the dashboard and all product pages
- The message reads: _"Your trial has ended. Subscribe to continue using NoHotfix."_
- A single "Subscribe now" button initiates the upgrade flow (see below)
- No other navigation is accessible — the Admin is locked to the upgrade prompt until they subscribe
- **Exception:** Admin can still access Account Settings (to change name/email/password) and the logout action

**For Member users:**

- A full-page **access suspended** message: _"Your team's trial has ended. Contact your Admin to subscribe."_
- Members cannot access any product functionality until the org subscribes
- No action available to Members — the upgrade can only be initiated by an Admin

**Grace period:** There is a **3-day grace period** after the trial ends before the full access block is applied. During the grace period, the upgrade prompt banner is shown on every page (for all users), but the product remains fully accessible. This gives Admins who missed the trial-end date a window to upgrade without losing a day's work mid-run.

---

### Upgrade Flow

1. Admin clicks "Subscribe now" from the upgrade prompt or from Settings → Billing
2. A Stripe Checkout session is created for the organisation
3. Admin is redirected to the **Stripe-hosted checkout page** — email is pre-filled from the Admin's account
4. Admin enters payment details and completes checkout
5. Stripe sends a `checkout.session.completed` webhook to NoHotfix
6. NoHotfix updates the org's subscription state to `active` and records the Stripe `customer_id` and `subscription_id`
7. Admin is redirected back to the NoHotfix dashboard — access restored immediately

**Failure handling:** If the Stripe Checkout session is abandoned or payment fails, the Admin is returned to the upgrade prompt. No partial state is recorded. Admin can retry immediately.

---

### Subscription States

| State          | Description                                          | Access                                  |
| -------------- | ---------------------------------------------------- | --------------------------------------- |
| `trialing`     | Trial period active                                  | Full access                             |
| `grace_period` | Trial ended, within 3-day grace window               | Full access + persistent upgrade banner |
| `past_due`     | Trial ended, grace period elapsed, no subscription   | Full block (upgrade prompt)             |
| `active`       | Paid subscription current                            | Full access                             |
| `cancelled`    | Subscription cancelled; billing period not yet ended | Full access until period end            |
| `expired`      | Subscription cancelled and billing period ended      | Full block (upgrade prompt)             |

---

### Billing Management

**Location:** Settings → Billing (Admin only — this tab is not shown to Members)

**Content:**

- Current plan name and status badge (e.g., "Active", "Trial — 8 days remaining")
- Current billing period (start and end date)
- Next payment amount and date (for active subscriptions)
- "Manage subscription" button — opens the **Stripe Customer Portal** in a new tab
  - In the Stripe portal, Admins can: update payment method, download invoices, cancel subscription
- For trialing orgs: a prominent "Subscribe now" button instead of "Manage subscription"

**Admin-only access:** The Billing tab in Settings is only rendered for Admin users. Members see no billing information. If a Member somehow navigates to the billing URL, they are redirected to their account settings with no error message.

---

### Cancellation

Cancellation is handled entirely through the Stripe Customer Portal. When a subscription is cancelled:

1. Stripe sends a `customer.subscription.deleted` or `customer.subscription.updated` (with `cancel_at_period_end: true`) webhook
2. NoHotfix records the cancellation and the `cancel_at` date
3. The org retains full access until the end of the paid billing period
4. A cancellation banner is shown on all pages for Admin: _"Your subscription ends on [date]. After that date, your team will lose access."_
5. After the `cancel_at` date passes, the org moves to `expired` state — full access block, same as `past_due`

Re-subscribing after expiry follows the same upgrade flow as a trial expiry.

---

### Webhook Events Handled

| Stripe Event                    | Action                                                         |
| ------------------------------- | -------------------------------------------------------------- |
| `checkout.session.completed`    | Activate subscription; record `customer_id`, `subscription_id` |
| `customer.subscription.updated` | Update subscription state and billing period                   |
| `customer.subscription.deleted` | Record cancellation; schedule expiry                           |
| `invoice.payment_failed`        | Flag payment failure; notify Admin by email                    |
| `invoice.payment_succeeded`     | Record successful renewal; extend billing period               |

---

### Pricing

Price points are **TBD** — pending market research before first external customer conversation. The billing module is built to support a single plan in v1. Multi-tier plans (if introduced) are a v2 addition.

See `docs/project-scope.md` → Pricing Model for the commercial rationale.
