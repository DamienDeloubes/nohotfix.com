import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';

const VALID_COLUMN_TYPES = ['text', 'number', 'boolean', 'measured_value'] as const;
type ColumnType = (typeof VALID_COLUMN_TYPES)[number];

const VALID_UNITS = ['ms', 's', '%', 'MB', 'GB', 'req/s'] as const;
type MeasuredValueUnit = (typeof VALID_UNITS)[number];

const MAX_COLUMN_NAME_LENGTH = 100;

export interface TableColumnDefJson {
  name: string;
  type: ColumnType;
  readOnly?: boolean;
  unit?: MeasuredValueUnit;
  tolerancePercentage?: number;
}

export class TableColumnDef {
  private constructor(
    readonly name: string,
    readonly columnType: ColumnType,
    readonly readOnly: boolean,
    readonly unit: MeasuredValueUnit | undefined,
    readonly tolerancePercentage: number | undefined,
  ) {}

  static create(params: { name: string; type: string; readOnly?: boolean; unit?: string; tolerancePercentage?: number }): TableColumnDef {
    const name = params.name?.trim();
    if (!name || name.length === 0) {
      throw new AuthorArtifactRequirementsInvalidError('Column name must not be empty');
    }
    if (name.length > MAX_COLUMN_NAME_LENGTH) {
      throw new AuthorArtifactRequirementsInvalidError(`Column name must not exceed ${MAX_COLUMN_NAME_LENGTH} characters`);
    }

    if (!VALID_COLUMN_TYPES.includes(params.type as ColumnType)) {
      throw new AuthorArtifactRequirementsInvalidError(`Invalid column type: ${params.type}`);
    }
    const columnType = params.type as ColumnType;

    let readOnly = false;
    let unit: MeasuredValueUnit | undefined;
    let tolerancePercentage: number | undefined;

    if (columnType === 'text' || columnType === 'number') {
      readOnly = params.readOnly ?? false;
    }

    if (columnType === 'measured_value') {
      if (!params.unit) {
        throw new AuthorArtifactRequirementsInvalidError('Unit is required for measured_value columns');
      }
      if (!VALID_UNITS.includes(params.unit as MeasuredValueUnit)) {
        throw new AuthorArtifactRequirementsInvalidError(`Invalid unit: ${params.unit}. Must be one of: ${VALID_UNITS.join(', ')}`);
      }
      unit = params.unit as MeasuredValueUnit;

      if (params.tolerancePercentage !== undefined) {
        if (params.tolerancePercentage <= 0) {
          throw new AuthorArtifactRequirementsInvalidError('Tolerance percentage must be a positive number');
        }
        tolerancePercentage = params.tolerancePercentage;
      }
    }

    return new TableColumnDef(name, columnType, readOnly, unit, tolerancePercentage);
  }

  static reconstitute(props: TableColumnDefJson): TableColumnDef {
    return new TableColumnDef(props.name, props.type, props.readOnly ?? false, props.unit, props.tolerancePercentage);
  }

  toJson(): TableColumnDefJson {
    const json: TableColumnDefJson = {
      name: this.name,
      type: this.columnType,
    };
    if (this.columnType === 'text' || this.columnType === 'number') {
      if (this.readOnly) {
        json.readOnly = true;
      }
    }
    if (this.unit !== undefined) {
      json.unit = this.unit;
    }
    if (this.tolerancePercentage !== undefined) {
      json.tolerancePercentage = this.tolerancePercentage;
    }
    return json;
  }

  equals(other: TableColumnDef): boolean {
    return (
      this.name === other.name &&
      this.columnType === other.columnType &&
      this.readOnly === other.readOnly &&
      this.unit === other.unit &&
      this.tolerancePercentage === other.tolerancePercentage
    );
  }
}
