import { ArtifactLabel } from './artifact-label.js';

export interface CheckboxArtifactRequirementJson {
  index: number;
  type: 'checkbox';
  label: string;
  required: boolean;
}

export class CheckboxArtifactRequirement {
  private constructor(
    readonly index: number,
    readonly type: 'checkbox',
    readonly label: ArtifactLabel,
    readonly required: boolean,
  ) {}

  static create(params: { index: number; label: string; required?: boolean }): CheckboxArtifactRequirement {
    const label = ArtifactLabel.create(params.label);
    return new CheckboxArtifactRequirement(params.index, 'checkbox', label, params.required ?? false);
  }

  toJson(): CheckboxArtifactRequirementJson {
    return {
      index: this.index,
      type: this.type,
      label: this.label.value,
      required: this.required,
    };
  }

  equals(other: CheckboxArtifactRequirement): boolean {
    return this.index === other.index && this.label.equals(other.label) && this.required === other.required;
  }

  toString(): string {
    return `CheckboxArtifactRequirement(${this.index}: ${this.label.value})`;
  }
}
