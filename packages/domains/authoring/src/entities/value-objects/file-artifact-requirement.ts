import { ArtifactDescription } from './artifact-description.js';
import { ArtifactLabel } from './artifact-label.js';

export interface FileArtifactRequirementJson {
  index: number;
  type: 'file';
  label: string;
  description: string | null;
  required: boolean;
}

export class FileArtifactRequirement {
  private constructor(
    readonly index: number,
    readonly type: 'file',
    readonly label: ArtifactLabel,
    readonly description: ArtifactDescription,
    readonly required: boolean,
  ) {}

  static create(params: { index: number; label: string; description?: string | null; required?: boolean }): FileArtifactRequirement {
    const label = ArtifactLabel.create(params.label);
    const description = ArtifactDescription.create(params.description);
    return new FileArtifactRequirement(params.index, 'file', label, description, params.required ?? false);
  }

  toJson(): FileArtifactRequirementJson {
    return {
      index: this.index,
      type: this.type,
      label: this.label.value,
      description: this.description.value,
      required: this.required,
    };
  }

  equals(other: FileArtifactRequirement): boolean {
    return this.index === other.index && this.label.equals(other.label) && this.description.equals(other.description) && this.required === other.required;
  }

  toString(): string {
    return `FileArtifactRequirement(${this.index}: ${this.label.value})`;
  }
}
