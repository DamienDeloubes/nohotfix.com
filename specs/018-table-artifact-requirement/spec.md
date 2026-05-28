# Feature Specification: Table Artifact Requirement

**Feature Branch**: `018-table-artifact-requirement`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Add the sixth and last optional required artifact type 'table' to the spec configuration, as defined in docs/development/spec-configuration.md."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a Table Artifact Requirement to a Spec (Priority: P1)

An Admin creating a spec can add one or more table artifact requirements to the spec's artifact requirements list. A table artifact represents structured tabular data with author-defined columns and rows. The Admin provides a label, an optional description, a required flag, column definitions (1-5 columns), and row data (1-50 rows). The Admin selects "Table" from the artifact type selector, which is now available alongside the existing "Text", "File", "Checkbox", and "URL" types.

When the Admin selects "Table", a table configuration section appears. The Admin first defines columns by specifying a name, a type (text, number, boolean, or measured_value), and type-specific settings. For text and number columns, the Admin can toggle read-only mode (author-set values vs tester-fillable). For measured_value columns, the Admin selects a unit and optionally sets a tolerance percentage. Boolean columns have no additional configuration.

After defining columns, the Admin adds rows. Each row contains one cell per column. For read-only text/number columns, the Admin enters the value. For fillable text/number columns and boolean columns, the cell is left empty (to be filled by the tester during execution). For measured_value columns, the Admin enters the expected value.

**Why this priority**: This is the core capability of the feature. Without the ability to add table artifact requirements during spec authoring, no other story delivers value.

**Independent Test**: Can be fully tested by creating a spec with one or more table artifact requirements (using different column type combinations) and verifying the requirements persist correctly through the create-and-view round trip.

**Acceptance Scenarios**:

1. **Given** an Admin is on the spec creation form, **When** they click "Add artifact requirement" and select "Table", **Then** a table artifact requirement configuration section appears with fields for the label, an optional description, a required toggle, a column definition area, and a row data area.
2. **Given** an Admin has added a table artifact requirement, **When** they add a column with name "Endpoint" and type "text" set to read-only, **Then** the column appears in the column list and is reflected in the row data area as a text input for each row.
3. **Given** an Admin has added a table artifact requirement with columns defined, **When** they add a row, **Then** a new row appears with cells matching each column definition -- read-only text/number cells allow the Admin to enter values, fillable text/number cells and boolean cells are shown as empty placeholders, and measured_value cells show an expected value input.
4. **Given** an Admin has defined a table with a measured_value column (unit: "ms", tolerance: 10%), **When** they add a row and enter an expected value of 200, **Then** the row stores the expected value and leaves the measured value as null (to be filled by the tester during execution).
5. **Given** an Admin has configured a complete table artifact requirement with label "API endpoint load times", 2 columns, and 3 rows, **When** they submit the spec, **Then** the spec is created with the table artifact requirement stored in the artifact requirements list with type "table", including the full column definitions and row data.
6. **Given** an Admin has added table, URL, checkbox, file, and text artifact requirements to the same spec, **When** they submit the spec, **Then** all types are stored correctly in the artifact requirements list, each with the correct type discriminator.

---

### User Story 2 - Define and Manage Table Columns (Priority: P1)

The Admin defines between 1 and 5 columns for each table artifact requirement. Each column has a name, a type, and type-specific settings. The Admin can reorder columns and remove columns. When a column is removed, the corresponding cell data in all rows is also removed.

**Why this priority**: Column definition is integral to the table creation flow and cannot be separated from the core story without losing coherence.

**Independent Test**: Can be tested by adding columns of each type, configuring type-specific settings, reordering columns, removing columns, and verifying that the column definitions and row data remain consistent.

**Acceptance Scenarios**:

1. **Given** an Admin is configuring a table artifact requirement, **When** they add a column and select type "text", **Then** a "Read-only" toggle appears, defaulting to off (fillable by tester).
2. **Given** an Admin is configuring a table artifact requirement, **When** they add a column and select type "number", **Then** a "Read-only" toggle appears, defaulting to off (fillable by tester).
3. **Given** an Admin is configuring a table artifact requirement, **When** they add a column and select type "boolean", **Then** no "Read-only" toggle appears (boolean columns are always fillable by the tester).
4. **Given** an Admin is configuring a table artifact requirement, **When** they add a column and select type "measured_value", **Then** a unit selector (ms, s, %, MB, GB, req/s) and an optional tolerance percentage input appear.
5. **Given** an Admin has defined 5 columns, **When** they attempt to add another column, **Then** the add column action is disabled and a message indicates the maximum of 5 columns has been reached.
6. **Given** an Admin has defined 3 columns and 2 rows, **When** they remove the second column, **Then** the column is removed from the definitions and the corresponding cell in each row is also removed, keeping the remaining data intact.
7. **Given** an Admin has defined 3 columns, **When** they reorder a column from position 2 to position 1, **Then** the column order is updated and the row cell data reflects the new column order.

---

### User Story 3 - Define and Manage Table Rows (Priority: P1)

The Admin defines between 1 and 50 rows for each table artifact requirement. Each row contains cells matching the column definitions. The Admin can add rows, remove rows, and reorder rows. Cell values depend on the column type and read-only setting.

**Why this priority**: Row definition is integral to the table creation flow. Without rows, the table artifact has no data.

**Independent Test**: Can be tested by adding rows with different cell values, reordering rows, removing rows, and verifying the data persists correctly.

**Acceptance Scenarios**:

1. **Given** an Admin has defined columns for a table, **When** they click "Add row", **Then** a new row is added with empty cells matching each column definition.
2. **Given** a table has a read-only text column "Browser" and a boolean column "Passed", **When** the Admin adds a row and enters "Chrome 120" in the Browser cell, **Then** the Browser cell stores "Chrome 120" and the Passed cell remains null (for the tester to fill).
3. **Given** a table has a measured_value column with unit "ms", **When** the Admin adds a row and enters 200 as the expected value, **Then** the cell stores `{ expectedValue: 200, measuredValue: null }`.
4. **Given** an Admin has defined 50 rows, **When** they attempt to add another row, **Then** the add row action is disabled and a message indicates the maximum of 50 rows has been reached.
5. **Given** an Admin has defined 3 rows, **When** they remove the second row, **Then** the row is removed and the remaining rows retain their data.
6. **Given** an Admin has defined 3 rows, **When** they reorder a row from position 3 to position 1, **Then** the row order is updated.

---

### User Story 4 - Validate Table Artifact Requirement Fields (Priority: P1)

The system validates table artifact requirement fields during spec creation. The label is required (max 200 chars), description is optional (max 1,000 chars), columns must have names, and row data must be consistent with column definitions. Validation is enforced on both the frontend and backend.

**Why this priority**: Validation ensures data integrity and is tightly coupled with the creation flow.

**Independent Test**: Can be tested by entering invalid values at various boundaries and verifying that inline errors appear, submission is prevented, and the server independently rejects invalid payloads.

**Acceptance Scenarios**:

1. **Given** an Admin has added a table artifact requirement, **When** they leave the label empty and attempt to submit, **Then** an inline validation error is shown on the label field indicating it is required.
2. **Given** an Admin has added a table artifact requirement, **When** they enter a label exceeding 200 characters, **Then** an inline validation error is shown indicating the maximum length, and a character counter reflects the current length.
3. **Given** an Admin has added a table artifact requirement, **When** they enter a description exceeding 1,000 characters, **Then** an inline validation error is shown indicating the maximum length, and a character counter reflects the current length.
4. **Given** an Admin has added a table artifact requirement with no columns defined, **When** they attempt to submit, **Then** an inline validation error is shown indicating at least 1 column is required.
5. **Given** an Admin has added a table artifact requirement with columns but no rows defined, **When** they attempt to submit, **Then** an inline validation error is shown indicating at least 1 row is required.
6. **Given** an Admin has added a column without a name, **When** they attempt to submit, **Then** an inline validation error is shown on the column name field indicating it is required.
7. **Given** an Admin has added a measured_value column without selecting a unit, **When** they attempt to submit, **Then** an inline validation error is shown on the unit field indicating it is required.
8. **Given** an Admin has added a row with a read-only text column but left the cell empty, **When** they attempt to submit, **Then** an inline validation error is shown indicating that read-only cells must have a value set by the author.
9. **Given** an Admin has added a row with a measured_value column but left the expected value empty, **When** they attempt to submit, **Then** an inline validation error is shown indicating that the expected value is required.
10. **Given** a payload is submitted via the API with a table artifact requirement that has more than 5 columns, **When** the server processes it, **Then** the server rejects the request with a validation error.
11. **Given** a payload is submitted via the API with a table artifact requirement that has more than 50 rows, **When** the server processes it, **Then** the server rejects the request with a validation error.
12. **Given** a payload is submitted via the API with a table artifact requirement where a row has fewer or more cells than the number of columns, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### User Story 5 - Display Table Artifact Requirements on Spec Detail Page (Priority: P2)

When viewing a spec that has table artifact requirements, the spec detail page displays them in the "Artifact Requirements" section alongside any other artifact types. Each table requirement shows its label, type ("Table"), description (if provided), required/optional status, and a read-only preview of the table structure including column headers and row data.

**Why this priority**: Displaying table artifact requirements allows Admins to review what they have configured. Essential for verification but does not block the creation flow.

**Independent Test**: Can be tested by creating a spec with table artifact requirements (with various column types and row data) and viewing the spec detail page to verify the table structure is displayed correctly.

**Acceptance Scenarios**:

1. **Given** a spec has a table artifact requirement with a description, **When** an Admin views the spec detail page, **Then** the requirement is displayed showing its label, description, type ("Table"), and required/optional status.
2. **Given** a spec has a table artifact requirement without a description, **When** an Admin views the spec detail page, **Then** the requirement is displayed showing its label, type ("Table"), and required/optional status -- no empty description section is shown.
3. **Given** a spec has a table artifact requirement with columns and rows, **When** an Admin views the spec detail page, **Then** a read-only table preview is shown with column headers (including type indicators and units for measured_value columns) and all row data.
4. **Given** a spec has a table artifact requirement with a measured_value column, **When** an Admin views the spec detail page, **Then** the measured_value column header shows the unit, and each cell displays the expected value. The measured value portion is shown as empty (to be filled during execution).
5. **Given** a spec has a table artifact requirement with boolean columns, **When** an Admin views the spec detail page, **Then** the boolean cells are shown as unchecked indicators (representing the tester's future input).
6. **Given** a spec has a table artifact requirement with fillable text/number columns, **When** an Admin views the spec detail page, **Then** the fillable cells are shown as empty placeholders, visually distinct from read-only cells that contain author-set values.
7. **Given** a spec has table, URL, checkbox, file, and text artifact requirements, **When** an Admin views the spec detail page, **Then** each requirement displays its correct type indicator.

---

### Edge Cases

- **Label at boundary length**: 200 characters accepted; 201 rejected. A visible character counter helps the Admin stay within limits.
- **Description at boundary length**: 1,000 characters accepted; 1,001 rejected. A visible character counter helps the Admin stay within limits.
- **Whitespace-only label**: Treated as empty after trimming. Validation rejects it as missing.
- **Whitespace-only description**: Treated as empty after trimming. Normalized to null before storage.
- **Whitespace-only column name**: Treated as empty after trimming. Validation rejects it as missing.
- **Column name uniqueness**: Not enforced. Two columns may have the same name (e.g. a user may intentionally name two columns "Score" for different contexts).
- **Duplicate labels**: Allowed. Two table artifact requirements may have the same label.
- **Mixed artifact types**: A spec may have a combination of table, URL, checkbox, file, and text artifact requirements. They share the same ordered list and are subject to the same 10-item maximum.
- **All table requirements optional**: Valid. The table data is informational.
- **All table requirements required**: Valid. The tester must fill in all designated cells before the spec can pass.
- **Empty description submitted via API**: Treated equivalently to omitted description. Normalized to null.
- **Minimum table**: 1 column and 1 row is valid. This is the smallest possible table.
- **Maximum table**: 5 columns and 50 rows is valid. This is the largest possible table.
- **Column type change**: When an Admin changes a column's type after rows have been added, existing cell data for that column in all rows is reset to the appropriate default for the new type (null for fillable, empty for read-only text/number).
- **Removing the last column**: If the Admin removes the last remaining column, validation prevents submission (minimum 1 column required). Existing rows remain but have no cells.
- **Removing the last row**: If the Admin removes the last remaining row, validation prevents submission (minimum 1 row required).
- **Tolerance percentage on measured_value columns**: Optional. When set, applies uniformly to all rows in the column. Same green/red display behavior as standalone measured values during execution.
- **Read-only cells with empty values via API**: The backend rejects read-only text columns with null/empty values and read-only number columns with null values, since the author is responsible for providing these values.
- **Measured_value cells missing expected value via API**: The backend rejects measured_value cells where expectedValue is null or missing.
- **Row cell count mismatch via API**: The backend rejects rows where the number of cells does not match the number of columns.

## Requirements _(mandatory)_

### Non-Functional Requirements (standing -- from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

**Table Artifact Requirement Type**

- **FR-001**: System MUST support the "Table" artifact requirement type, which represents structured tabular data with author-defined columns and rows that the tester fills in during execution.
- **FR-002**: System MUST require a label for each table artifact requirement, between 1 and 200 characters after trimming. The label describes what the table represents (e.g. "API endpoint load times").
- **FR-003**: System MUST trim leading and trailing whitespace from the label before validation and storage.
- **FR-004**: Table artifact requirements MUST support an optional description field, limited to 1,000 characters after trimming, providing guidance for the tester.
- **FR-005**: System MUST trim leading and trailing whitespace from the description before validation and storage. Empty or whitespace-only descriptions MUST be normalized to null.
- **FR-006**: System MUST support a required flag on each table artifact requirement indicating whether the tester must fill in all designated cells before the spec can be marked as passed during execution.
- **FR-007**: System MUST show a character counter on the label field.
- **FR-008**: System MUST show a character counter on the description field.

**Column Definitions**

- **FR-009**: System MUST support between 1 and 5 columns per table artifact requirement.
- **FR-010**: Each column MUST have a name (required, trimmed, non-empty after trimming, max 100 characters).
- **FR-011**: Each column MUST have a type from the set: `text`, `number`, `boolean`, `measured_value`.
- **FR-012**: Columns of type `text` and `number` MUST support a `readOnly` toggle. When read-only, the author sets the cell values and the tester cannot edit them during execution. Default is false (fillable by tester).
- **FR-013**: Columns of type `boolean` MUST always be fillable by the tester. No read-only toggle is shown for boolean columns.
- **FR-014**: Columns of type `measured_value` MUST require a unit from the fixed set: `ms`, `s`, `%`, `MB`, `GB`, `req/s`.
- **FR-015**: Columns of type `measured_value` MUST support an optional `tolerancePercentage` (a positive number). When set, it applies uniformly to all rows in the column and drives green/red color coding during execution.
- **FR-016**: System MUST prevent adding more than 5 columns. The add column action is disabled when 5 columns exist.
- **FR-017**: System MUST allow the Admin to reorder columns.
- **FR-018**: System MUST allow the Admin to remove a column. When a column is removed, the corresponding cell in every row MUST also be removed.

**Row Data**

- **FR-019**: System MUST support between 1 and 50 rows per table artifact requirement.
- **FR-020**: Each row MUST contain exactly one cell per column, in column order.
- **FR-021**: For read-only `text` columns, the author MUST provide a non-empty string value. The cell stores the author-set value.
- **FR-022**: For fillable `text` columns, the cell value is null (to be filled by the tester during execution).
- **FR-023**: For read-only `number` columns, the author MUST provide a numeric value. The cell stores the author-set value.
- **FR-024**: For fillable `number` columns, the cell value is null (to be filled by the tester during execution).
- **FR-025**: For `boolean` columns, the cell value is null (to be filled by the tester during execution as true or false).
- **FR-026**: For `measured_value` columns, the author MUST provide an `expectedValue` (a number). The cell stores `{ expectedValue: <number>, measuredValue: null }`.
- **FR-027**: System MUST prevent adding more than 50 rows. The add row action is disabled when 50 rows exist.
- **FR-028**: System MUST allow the Admin to reorder rows.
- **FR-029**: System MUST allow the Admin to remove a row.

**Type Selection**

- **FR-030**: System MUST offer "Table" as a selectable option in the artifact type selector, alongside the existing "Text", "File", "Checkbox", and "URL" options.
- **FR-031**: System MUST display an appropriate icon or visual indicator to distinguish the "Table" type from other types in both the creation form and the spec detail page.

**Display**

- **FR-032**: System MUST display table artifact requirements on the spec detail page showing label, type ("Table"), description (if provided), and required/optional status.
- **FR-033**: System MUST NOT display an empty description section for table artifact requirements that have no description.
- **FR-034**: System MUST display a read-only table preview on the spec detail page showing column headers (with type indicators and units for measured_value columns) and all row data.
- **FR-035**: System MUST visually distinguish read-only cells (containing author-set values) from fillable cells (shown as empty placeholders) in the table preview.
- **FR-036**: System MUST display measured_value cells in the preview showing the expected value with the unit, and the measured value portion as empty.
- **FR-037**: System MUST display boolean cells in the preview as unchecked indicators.

**Validation**

- **FR-038**: System MUST enforce all table artifact requirement validation rules on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads with appropriate error codes).
- **FR-039**: System MUST show inline validation errors adjacent to the relevant field within the table artifact requirement configuration section.
- **FR-040**: System MUST validate that each row has exactly as many cells as there are columns, and that each cell value matches the expected type for its column.

### Key Entities

- **Table Artifact Requirement**: An artifact requirement of type "table" with column definitions and row data. It has a label (required), an optional description, a required flag, an array of 1-5 column definitions, and an array of 1-50 rows. Each column has a name, a type, and type-specific settings (readOnly for text/number, unit and tolerancePercentage for measured_value). Each row is an array of cell values matching column order. During execution, the tester fills in designated cells (fillable text/number, boolean, measured_value) while read-only cells remain unchanged.

- **Table Column Definition**: Defines a column's name, type, and behavior. Column types are `text`, `number`, `boolean`, and `measured_value`. Text and number support read-only mode. Measured_value requires a unit and optionally includes a tolerance percentage that applies to all rows.

- **Cell Value**: A typed value within a row. The format depends on the column type: string or null for text, number or null for number, boolean or null for boolean, and `{ expectedValue, measuredValue }` for measured_value.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admins can add table artifact requirements to a spec and see them persist correctly through the create-and-view round trip, including label, description, required status, column definitions, and row data.
- **SC-002**: 100% of spec creation attempts with invalid table artifact requirement fields (empty label, label > 200 chars, description > 1,000 chars, no columns, > 5 columns, no rows, > 50 rows, missing column names, missing units for measured_value columns, missing expected values, row-column count mismatches) are rejected by both client-side and server-side validation independently.
- **SC-003**: Character counters are visible on both the label and description fields, updating in real time as the Admin types.
- **SC-004**: The spec detail page displays table artifact requirements with the correct "Table" type indicator, labels, descriptions (when present), required/optional status, and a read-only table preview showing all column headers and row data.
- **SC-005**: Admins can mix table, URL, checkbox, file, and text artifact requirements in the same spec, with each type correctly identified and persisted.
- **SC-006**: Admins can define tables using all four column types (text, number, boolean, measured_value) with correct type-specific configuration.
- **SC-007**: The table preview on the spec detail page visually distinguishes read-only cells from fillable cells, displays measured_value expected values with units, and shows boolean cells as unchecked indicators.
- **SC-008**: Admins can add, remove, and reorder both columns and rows within a table artifact requirement.

## Assumptions

- **A-001**: The artifact requirements foundation (add, remove, reorder, validate base fields, 10-item limit, drag-and-drop) was established in feature 014 (Text Artifact Requirement). This feature extends that foundation by adding the "table" variant to the discriminated union -- it does not re-implement list management.
- **A-002**: The `spec_library.artifact_requirements` JSONB column already exists (confirmed in 001_initial_schema migration). No database migration is required.
- **A-003**: The artifact requirements Zod schema is a discriminated union on the `type` field. This feature adds the "table" variant alongside the existing "text", "file", "checkbox", and "url" variants.
- **A-004**: The table artifact type includes column definitions and row data as defined in `docs/development/spec-configuration.md`. The column types are `text`, `number`, `boolean`, and `measured_value`, each with type-specific configuration.
- **A-005**: The "required" flag defaults to false (optional) when a new table artifact requirement is added, consistent with other artifact type behavior.
- **A-006**: Execution-side behavior (tester filling in cells, tolerance color coding, enforcement gating) is out of scope. This feature covers authoring-side configuration and display only.
- **A-007**: This feature targets the create form only (edit does not exist yet), consistent with the pattern established in features 014-017.
- **A-008**: The `MeasuredValueUnit` type (`ms`, `s`, `%`, `MB`, `GB`, `req/s`) is already defined in the shared types from the spec-configuration.md. This feature reuses it for measured_value columns.
- **A-009**: Column name length is not explicitly constrained beyond requiring non-empty after trimming. A reasonable display-friendly maximum is assumed (e.g. 100 characters) and will be determined during planning.
- **A-010**: When an Admin changes a column's type, existing row data for that column is reset to the appropriate default for the new type, preventing invalid cell values.
