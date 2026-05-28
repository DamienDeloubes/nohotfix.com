import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { ArtifactDescription } from './artifact-description.js';
import { ArtifactLabel } from './artifact-label.js';
import { TableColumnDef, type TableColumnDefJson } from './table-column-def.js';

const MIN_COLUMNS = 1;
const MAX_COLUMNS = 5;
const MIN_ROWS = 1;
const MAX_ROWS = 50;

type CellValue = string | number | boolean | null | { expectedValue: number; measuredValue: number | null };

export interface TableArtifactRequirementJson {
  index: number;
  type: 'table';
  label: string;
  description: string | null;
  required: boolean;
  columns: TableColumnDefJson[];
  rows: CellValue[][];
}

export class TableArtifactRequirement {
  private constructor(
    readonly index: number,
    readonly type: 'table',
    readonly label: ArtifactLabel,
    readonly description: ArtifactDescription,
    readonly required: boolean,
    readonly columns: TableColumnDef[],
    readonly rows: CellValue[][],
  ) {}

  static create(params: {
    index: number;
    label: string;
    description?: string | null | undefined;
    required?: boolean;
    columns: Array<{
      name: string;
      type: string;
      readOnly?: boolean;
      unit?: string;
      tolerancePercentage?: number;
    }>;
    rows: CellValue[][];
  }): TableArtifactRequirement {
    const label = ArtifactLabel.create(params.label);
    const description = ArtifactDescription.create(params.description);

    if (!params.columns || params.columns.length < MIN_COLUMNS) {
      throw new AuthorArtifactRequirementsInvalidError(`Table must have at least ${MIN_COLUMNS} column`);
    }
    if (params.columns.length > MAX_COLUMNS) {
      throw new AuthorArtifactRequirementsInvalidError(`Table must not exceed ${MAX_COLUMNS} columns`);
    }

    const columns = params.columns.map((col) => TableColumnDef.create(col));

    if (!params.rows || params.rows.length < MIN_ROWS) {
      throw new AuthorArtifactRequirementsInvalidError(`Table must have at least ${MIN_ROWS} row`);
    }
    if (params.rows.length > MAX_ROWS) {
      throw new AuthorArtifactRequirementsInvalidError(`Table must not exceed ${MAX_ROWS} rows`);
    }

    for (let rowIndex = 0; rowIndex < params.rows.length; rowIndex++) {
      const row = params.rows[rowIndex]!;
      if (row.length !== columns.length) {
        throw new AuthorArtifactRequirementsInvalidError(`Row ${rowIndex + 1} has ${row.length} cells but expected ${columns.length} (one per column)`);
      }

      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        TableArtifactRequirement.validateCell(row[colIndex]!, columns[colIndex]!, rowIndex);
      }
    }

    return new TableArtifactRequirement(params.index, 'table', label, description, params.required ?? false, columns, params.rows);
  }

  private static validateCell(cell: CellValue, col: TableColumnDef, rowIndex: number): void {
    const pos = `row ${rowIndex + 1}, column "${col.name}"`;

    switch (col.columnType) {
      case 'text':
        if (col.readOnly) {
          if (typeof cell !== 'string' || cell.length === 0) {
            throw new AuthorArtifactRequirementsInvalidError(`Read-only text cell at ${pos} must be a non-empty string`);
          }
        } else {
          if (cell !== null) {
            throw new AuthorArtifactRequirementsInvalidError(`Fillable text cell at ${pos} must be null`);
          }
        }
        break;

      case 'number':
        if (col.readOnly) {
          if (typeof cell !== 'number') {
            throw new AuthorArtifactRequirementsInvalidError(`Read-only number cell at ${pos} must be a number`);
          }
        } else {
          if (cell !== null) {
            throw new AuthorArtifactRequirementsInvalidError(`Fillable number cell at ${pos} must be null`);
          }
        }
        break;

      case 'boolean':
        if (cell !== null) {
          throw new AuthorArtifactRequirementsInvalidError(`Boolean cell at ${pos} must be null`);
        }
        break;

      case 'measured_value':
        if (
          cell === null ||
          typeof cell !== 'object' ||
          typeof (cell as { expectedValue?: unknown }).expectedValue !== 'number' ||
          (cell as { measuredValue?: unknown }).measuredValue !== null
        ) {
          throw new AuthorArtifactRequirementsInvalidError(`Measured value cell at ${pos} must be { expectedValue: number, measuredValue: null }`);
        }
        break;
    }
  }

  static reconstitute(props: TableArtifactRequirementJson): TableArtifactRequirement {
    return new TableArtifactRequirement(
      props.index,
      'table',
      ArtifactLabel.create(props.label),
      ArtifactDescription.create(props.description),
      props.required,
      props.columns.map((col) => TableColumnDef.reconstitute(col)),
      props.rows,
    );
  }

  toJson(): TableArtifactRequirementJson {
    return {
      index: this.index,
      type: this.type,
      label: this.label.value,
      description: this.description.value,
      required: this.required,
      columns: this.columns.map((col) => col.toJson()),
      rows: this.rows,
    };
  }

  equals(other: TableArtifactRequirement): boolean {
    if (
      this.index !== other.index ||
      !this.label.equals(other.label) ||
      !this.description.equals(other.description) ||
      this.required !== other.required ||
      this.columns.length !== other.columns.length ||
      this.rows.length !== other.rows.length
    ) {
      return false;
    }

    for (let i = 0; i < this.columns.length; i++) {
      if (!this.columns[i]!.equals(other.columns[i]!)) {
        return false;
      }
    }

    return JSON.stringify(this.rows) === JSON.stringify(other.rows);
  }

  toString(): string {
    return `TableArtifactRequirement(${this.index}: ${this.label.value}, ${this.columns.length} columns, ${this.rows.length} rows)`;
  }
}
