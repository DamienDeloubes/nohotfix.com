import { ArtifactDescription } from './artifact-description.js';
import { ArtifactLabel } from './artifact-label.js';

export interface UrlArtifactRequirementJson {
  index: number;
  type: 'url';
  label: string;
  description: string | null;
  required: boolean;
}

export class UrlArtifactRequirement {
  private constructor(
    readonly index: number,
    readonly type: 'url',
    readonly label: ArtifactLabel,
    readonly description: ArtifactDescription,
    readonly required: boolean,
  ) {}

  static create(params: { index: number; label: string; description?: string | null; required?: boolean }): UrlArtifactRequirement {
    const label = ArtifactLabel.create(params.label);
    const description = ArtifactDescription.create(params.description);
    return new UrlArtifactRequirement(params.index, 'url', label, description, params.required ?? false);
  }

  toJson(): UrlArtifactRequirementJson {
    return {
      index: this.index,
      type: this.type,
      label: this.label.value,
      description: this.description.value,
      required: this.required,
    };
  }

  equals(other: UrlArtifactRequirement): boolean {
    return this.index === other.index && this.label.equals(other.label) && this.description.equals(other.description) && this.required === other.required;
  }

  toString(): string {
    return `UrlArtifactRequirement(${this.index}: ${this.label.value})`;
  }
}
