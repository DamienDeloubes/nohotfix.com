import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { CheckboxArtifactRequirement, type CheckboxArtifactRequirementJson } from './checkbox-artifact-requirement.js';
import { FileArtifactRequirement, type FileArtifactRequirementJson } from './file-artifact-requirement.js';
import { MeasuredValueArtifactRequirement, type MeasuredValueArtifactRequirementJson } from './measured-value-artifact-requirement.js';
import { TableArtifactRequirement, type TableArtifactRequirementJson } from './table-artifact-requirement.js';
import { TextArtifactRequirement, type TextArtifactRequirementJson } from './text-artifact-requirement.js';
import { UrlArtifactRequirement, type UrlArtifactRequirementJson } from './url-artifact-requirement.js';

const MAX_ARTIFACT_REQUIREMENTS = 10;

export type ArtifactRequirementJson =
  | TextArtifactRequirementJson
  | FileArtifactRequirementJson
  | CheckboxArtifactRequirementJson
  | UrlArtifactRequirementJson
  | MeasuredValueArtifactRequirementJson
  | TableArtifactRequirementJson;

type ArtifactRequirementItem =
  | TextArtifactRequirement
  | FileArtifactRequirement
  | CheckboxArtifactRequirement
  | UrlArtifactRequirement
  | MeasuredValueArtifactRequirement
  | TableArtifactRequirement;

export class ArtifactRequirements {
  private constructor(readonly items: ArtifactRequirementItem[]) {}

  static create(
    raw: Array<{
      type: string;
      label: string;
      description?: string | null;
      required?: boolean;
      columns?: unknown[];
      rows?: unknown[][];
      unit?: string;
      expectedValue?: number;
      tolerancePercentage?: number;
      toleranceDescription?: string | null;
    }>,
  ): ArtifactRequirements {
    if (raw.length > MAX_ARTIFACT_REQUIREMENTS) {
      throw new AuthorArtifactRequirementsInvalidError(`Cannot exceed ${MAX_ARTIFACT_REQUIREMENTS} artifact requirements`);
    }

    const items = raw.map((item, index) => {
      const params = {
        index,
        label: item.label,
        description: item.description ?? null,
        required: item.required ?? false,
      };

      switch (item.type) {
        case 'text':
          return TextArtifactRequirement.create(params);
        case 'file':
          return FileArtifactRequirement.create(params);
        case 'checkbox':
          return CheckboxArtifactRequirement.create({ index, label: item.label, ...(item.required !== undefined && { required: item.required }) });
        case 'url':
          return UrlArtifactRequirement.create(params);
        case 'measured_value':
          return MeasuredValueArtifactRequirement.create({
            index,
            label: item.label,
            ...(item.description !== undefined && { description: item.description }),
            ...(item.required !== undefined && { required: item.required }),
            unit: item.unit!,
            expectedValue: item.expectedValue!,
            ...(item.tolerancePercentage !== undefined && { tolerancePercentage: item.tolerancePercentage }),
            ...(item.toleranceDescription !== undefined && { toleranceDescription: item.toleranceDescription }),
          });
        case 'table':
          return TableArtifactRequirement.create({
            index,
            label: item.label,
            ...(item.description !== undefined && { description: item.description }),
            ...(item.required !== undefined && { required: item.required }),
            columns: (item.columns ?? []) as Array<{ name: string; type: string; readOnly?: boolean; unit?: string; tolerancePercentage?: number }>,
            rows: (item.rows ?? []) as Array<Array<string | number | boolean | null | { expectedValue: number; measuredValue: number | null }>>,
          });
        default:
          throw new AuthorArtifactRequirementsInvalidError(`Unknown artifact requirement type: ${item.type}`);
      }
    });

    return new ArtifactRequirements(items);
  }

  toJson(): ArtifactRequirementJson[] {
    return this.items.map((item) => item.toJson());
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }
}
