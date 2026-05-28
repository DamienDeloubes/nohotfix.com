import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { ArtifactDescription } from './artifact-description.js';
import { ArtifactLabel } from './artifact-label.js';
import { MeasuredValueUnit } from './measured-value-unit.js';

export interface MeasuredValueArtifactRequirementJson {
  index: number;
  type: 'measured_value';
  label: string;
  description: string | null;
  required: boolean;
  unit: string;
  expectedValue: number;
  tolerancePercentage: number | null;
  toleranceDescription: string | null;
}

interface MeasuredValueArtifactRequirementProps {
  index: number;
  type: 'measured_value';
  label: ArtifactLabel;
  description: ArtifactDescription;
  required: boolean;
  unit: MeasuredValueUnit;
  expectedValue: number;
  tolerancePercentage: number | null;
  toleranceDescription: ArtifactDescription;
}

export class MeasuredValueArtifactRequirement {
  private constructor(private readonly props: MeasuredValueArtifactRequirementProps) {}

  get index(): number {
    return this.props.index;
  }
  get type(): 'measured_value' {
    return this.props.type;
  }
  get label(): ArtifactLabel {
    return this.props.label;
  }
  get description(): ArtifactDescription {
    return this.props.description;
  }
  get required(): boolean {
    return this.props.required;
  }
  get unit(): MeasuredValueUnit {
    return this.props.unit;
  }
  get expectedValue(): number {
    return this.props.expectedValue;
  }
  get tolerancePercentage(): number | null {
    return this.props.tolerancePercentage;
  }
  get toleranceDescription(): ArtifactDescription {
    return this.props.toleranceDescription;
  }

  static create(params: {
    index: number;
    label: string;
    description?: string | null;
    required?: boolean;
    unit: string;
    expectedValue: number;
    tolerancePercentage?: number | null;
    toleranceDescription?: string | null;
  }): MeasuredValueArtifactRequirement {
    const label = ArtifactLabel.create(params.label);
    const description = ArtifactDescription.create(params.description);
    const unit = MeasuredValueUnit.create(params.unit);

    if (!Number.isFinite(params.expectedValue)) {
      throw new AuthorArtifactRequirementsInvalidError('Expected value must be a finite number');
    }

    let tolerancePercentage: number | null = null;
    let toleranceDescription: ArtifactDescription;

    if (params.tolerancePercentage != null) {
      if (!Number.isFinite(params.tolerancePercentage) || params.tolerancePercentage <= 0) {
        throw new AuthorArtifactRequirementsInvalidError('Tolerance percentage must be a positive number greater than zero');
      }
      tolerancePercentage = params.tolerancePercentage;
      toleranceDescription = ArtifactDescription.create(params.toleranceDescription);
    } else {
      toleranceDescription = ArtifactDescription.create(null);
    }

    return new MeasuredValueArtifactRequirement({
      index: params.index,
      type: 'measured_value',
      label,
      description,
      required: params.required ?? false,
      unit,
      expectedValue: params.expectedValue,
      tolerancePercentage,
      toleranceDescription,
    });
  }

  static reconstitute(props: MeasuredValueArtifactRequirementProps): MeasuredValueArtifactRequirement {
    return new MeasuredValueArtifactRequirement(props);
  }

  toJson(): MeasuredValueArtifactRequirementJson {
    return {
      index: this.index,
      type: this.type,
      label: this.label.value,
      description: this.description.value,
      required: this.required,
      unit: this.unit.value,
      expectedValue: this.expectedValue,
      tolerancePercentage: this.tolerancePercentage,
      toleranceDescription: this.toleranceDescription.value,
    };
  }

  equals(other: MeasuredValueArtifactRequirement): boolean {
    return (
      this.index === other.index &&
      this.label.equals(other.label) &&
      this.description.equals(other.description) &&
      this.required === other.required &&
      this.unit.equals(other.unit) &&
      this.expectedValue === other.expectedValue &&
      this.tolerancePercentage === other.tolerancePercentage &&
      this.toleranceDescription.equals(other.toleranceDescription)
    );
  }

  toString(): string {
    return `MeasuredValueArtifactRequirement(${this.index}: ${this.label.value} — ${this.expectedValue} ${this.unit.value})`;
  }
}
