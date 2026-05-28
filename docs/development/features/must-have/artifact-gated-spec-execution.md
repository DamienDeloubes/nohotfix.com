# Feature: Artifact-Gated Spec Execution

## Overview

Artifact-gated spec execution is the mechanism that makes a spec result verifiable and auditable. A spec cannot be marked as Passed until every declared evidence requirement — file upload, structured table, measured value, or URL — is fully satisfied. This enforcement is a hard gate with no admin override: it is the foundation of NoHotfix's defensibility.

## Complexity Assessment

- **Technical Complexity**: High — requires coordinating multiple artifact types, MIME validation, S3 storage, structured JSON table state, and a pass-button gate that evaluates all requirements simultaneously.
- **Design Complexity**: High — four artifact types each have distinct UI patterns (file slots, data grids, number inputs, URL inputs) that must coexist clearly in a single spec execution panel.
- **User Experience Complexity**: Medium — the enforcement model is easy to understand ("fill this before you can pass"), but the variety of artifact types and their configuration options requires clear affordances and progress indicators to avoid confusion.

## Detailed Description

Artifacts are the evidence layer — they are what makes a spec result verifiable and auditable. A spec can have zero or more artifact requirements. Multiple requirements of different types can be combined on a single spec; all must be satisfied before the pass button is enabled.

There are four artifact types:

### Type 1: File Upload

The tester uploads one or more files as evidence.

**Admin configures at spec creation:**

| Setting       | Options                                   | Notes                                                               |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------- |
| File type     | Screenshot / Video / Document / Log / Any | Enforced by MIME type on upload, not file extension                 |
| Minimum count | 1 (default) / 2 / 3                       | e.g., set to 2 to require a before-state and after-state screenshot |
| Label         | Optional free text                        | e.g., "Before state" / "After state" for each slot when count > 1   |

**During a run:**

- Tester drags-and-drops, uses the file picker, or pastes a screenshot from clipboard
- Each uploaded file shows a type badge inferred from MIME type
- Image files render as inline previews; videos play inline; other files show as download links
- If count > 1, labelled upload slots are shown (e.g., "Upload: Before state", "Upload: After state")

**Enforcement:** Pass blocked until the minimum file count is met and all files match the declared type.

**Examples:**

```
Screenshot                  → at least 1 screenshot
Screenshot × 2              → before-state + after-state screenshots (2 labelled slots)
Video                       → at least 1 MP4/WebM recording
Document + Log              → 1 document (PDF/Word) and 1 log file
Any                         → at least 1 file of any type
```

### Type 2: Table

The tester fills in a structured data grid during execution. Designed for specs that require verification across multiple scenarios, configurations, or data rows — where a screenshot alone doesn't capture the reasoning.

**Admin configures at spec creation:**

| Setting      | Options                                                     | Notes                                                                                                                                           |
| ------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Columns      | One or more, each with a name, data type, and required flag | Data types: Text / Number / Pass–Fail (Yes / No / N/A select). Each column is marked Required or Optional by the admin at schema creation time. |
| Minimum rows | 1 (default) or more                                         | Forces the tester to document at least N scenarios                                                                                              |
| Label        | Optional — names the table                                  | e.g., "Browser compatibility matrix"                                                                                                            |

**During a run:**

- The table renders inline in the spec panel — the tester fills it row by row
- Rows can be added dynamically; minimum row count is enforced before pass
- Pass–Fail columns render as a select: Pass / Fail / N/A
- Number columns validate that the input is numeric
- Optional columns are visually distinguished (e.g., a subtle "Optional" label in the column header) so the tester knows at a glance which cells they must fill
- Completed table is stored as structured JSON in the run record — it is part of the immutable audit trail and renders directly in the run history view without downloading anything

**Enforcement:** Pass blocked until the minimum row count is reached and all cells in required columns are filled. Optional columns may be left blank.

**Example — spec: "Browser compatibility matrix":**

Admin-defined schema:

```
Columns:
  Browser        (text)       — Required
  Version        (text)       — Required
  Result         (pass-fail)  — Required
  Notes          (text)       — Optional
Min rows: 3
```

Tester fills in during the run:

```
| Browser | Version | Result | Notes                        |
| Chrome  | 120     | Pass   |                              |  ← Notes left blank — allowed
| Firefox | 121     | Pass   |                              |  ← Notes left blank — allowed
| Safari  | 17      | Fail   | Layout broken on mobile view |
```

The pass button activates once all three required columns are filled for each row and the minimum row count is met. The blank Notes cells do not block pass.

### Type 3: Measured Value

The tester records a single numeric measurement. Designed for performance specs or any spec where a specific number must be captured and compared against a threshold.

**Admin configures at spec creation:**

| Setting   | Options                                 | Notes                                      |
| --------- | --------------------------------------- | ------------------------------------------ |
| Label     | Free text                               | e.g., "Page load time in milliseconds"     |
| Unit      | Optional free text                      | e.g., "ms", "seconds", "KB" — display only |
| Threshold | Optional number + operator (≤ / ≥ / = ) | e.g., ≤ 5000                               |

**During a run:**

- A labelled number input renders inline in the spec panel
- Tester enters the observed value (e.g., 2340)
- If a threshold is configured and the entered value violates it, the UI surfaces a clear warning: `"Value exceeds threshold: entered 6200 ms, max ≤ 5000 ms"`
- The warning does not automatically fail the spec — the tester retains the judgement call and must explicitly mark the spec as Pass or Fail
- The recorded value and threshold are stored in the run record; the audit trail shows both the configured threshold and the observed value

**Enforcement:** Pass blocked until a numeric value is entered. The threshold triggers a warning but does not hard-block.

**Example — spec: "Claim page loads within 5 seconds":**

```
Label: Page load time
Unit: ms
Threshold: ≤ 5000
```

Tester enters `2340` → no warning → pass enabled.
Tester enters `6800` → warning shown → tester marks as Fail.

### Type 4: URL

The tester provides a link to external evidence — a Loom recording, a CI test run, a Sentry trace, a Figma prototype walkthrough, or any externally hosted artifact.

**Admin configures at spec creation:**

| Setting | Options            | Notes                                              |
| ------- | ------------------ | -------------------------------------------------- |
| Label   | Optional free text | e.g., "Link to Loom recording" / "CI test run URL" |

**During a run:**

- A labelled URL input renders inline
- Input is validated as a well-formed URL before pass is enabled
- The stored URL is displayed as a clickable link in the run history view

**Enforcement:** Pass blocked until a valid URL is entered.

**Note:** URLs are external references — NoHotfix does not fetch, cache, or validate the content of the linked resource. If the link expires after the run is completed, the URL remains in the audit record but the target may no longer be accessible. Teams using URL artifacts for compliance purposes should ensure they link to durable resources (e.g., archived CI reports, downloaded and re-hosted recordings).

### Combining Artifact Types

A single spec can require multiple artifact requirements of different types. All must be satisfied before pass is enabled.

**Example — spec: "Payment flow completes successfully":**

```
Artifact requirements:
  1. File: Screenshot × 2       (before-state: empty cart / after-state: confirmation screen)
  2. Value: Transaction time ms, threshold ≤ 3000
  3. URL: Link to Loom recording of the full flow
```

The tester must upload 2 screenshots, enter the measured transaction time, and provide a Loom URL before the pass button activates.

---

### Artifact Enforcement

- The pass button is disabled until every declared artifact requirement is satisfied across all types
- File type is validated by MIME type on upload, not file extension
- Table minimum row count is enforced before pass is enabled
- Measured value must be entered (threshold violation warns but does not hard-block)
- URL must be a well-formed URL
- Artifact enforcement cannot be bypassed on the Pass action — there is no admin override. A tester who cannot satisfy an artifact requirement must either fix the gap or Skip the spec with a written reason.

---

### Storage & Technical Constraints

- Supported types: images (PNG, JPG, GIF), PDF, video (MP4), any file up to 50MB
- Stored in S3 (or equivalent), served via signed URLs with expiry
- Artifacts are permanently linked to the run spec — they are part of the immutable audit record
- After a run is completed (go/no-go recorded), artifacts cannot be deleted or replaced
