import { ArtifactDescription } from './artifact-description.js';
import { ArtifactLabel } from './artifact-label.js';

export interface TextArtifactRequirementJson {
  index: number;
  type: 'text';
  label: string;
  description: string | null;
  required: boolean;
}

export class TextArtifactRequirement {
  private constructor(
    readonly index: number,
    readonly type: 'text',
    readonly label: ArtifactLabel,
    readonly description: ArtifactDescription,
    readonly required: boolean,
  ) {}

  static create(params: { index: number; label: string; description?: string | null; required?: boolean }): TextArtifactRequirement {
    const label = ArtifactLabel.create(params.label);
    const description = ArtifactDescription.create(params.description);
    return new TextArtifactRequirement(params.index, 'text', label, description, params.required ?? false);
  }

  toJson(): TextArtifactRequirementJson {
    return {
      index: this.index,
      type: this.type,
      label: this.label.value,
      description: this.description.value,
      required: this.required,
    };
  }

  equals(other: TextArtifactRequirement): boolean {
    return this.index === other.index && this.label.equals(other.label) && this.description.equals(other.description) && this.required === other.required;
  }

  toString(): string {
    return `TextArtifactRequirement(${this.index}: ${this.label.value})`;
  }
}
