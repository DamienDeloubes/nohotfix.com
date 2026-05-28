import { AuthorSpecStepInvalidError } from '../../errors/index.js';

export interface TestStepProps {
  instruction: string;
  expectedOutcome?: string | undefined;
}

const MAX_INSTRUCTION_LENGTH = 500;
const MAX_EXPECTED_OUTCOME_LENGTH = 500;

export class TestStep {
  readonly instruction: string;
  readonly expectedOutcome: string | undefined;

  private constructor(props: TestStepProps) {
    this.instruction = props.instruction;
    this.expectedOutcome = props.expectedOutcome;
  }

  static create(props: TestStepProps): TestStep {
    const trimmedInstruction = props.instruction?.trim() ?? '';
    if (trimmedInstruction.length === 0) {
      throw new AuthorSpecStepInvalidError('Test step instruction must not be empty', { field: 'instruction' });
    }
    if (trimmedInstruction.length > MAX_INSTRUCTION_LENGTH) {
      throw new AuthorSpecStepInvalidError(`Test step instruction must not exceed ${MAX_INSTRUCTION_LENGTH} characters`, {
        field: 'instruction',
        maxLength: MAX_INSTRUCTION_LENGTH,
      });
    }
    const trimmedOutcome = props.expectedOutcome?.trim();
    if (trimmedOutcome && trimmedOutcome.length > MAX_EXPECTED_OUTCOME_LENGTH) {
      throw new AuthorSpecStepInvalidError(`Test step expected outcome must not exceed ${MAX_EXPECTED_OUTCOME_LENGTH} characters`, {
        field: 'expectedOutcome',
        maxLength: MAX_EXPECTED_OUTCOME_LENGTH,
      });
    }
    const createProps: TestStepProps = { instruction: trimmedInstruction };
    if (trimmedOutcome) createProps.expectedOutcome = trimmedOutcome;
    return new TestStep(createProps);
  }

  equals(other: TestStep): boolean {
    return this.instruction === other.instruction && this.expectedOutcome === other.expectedOutcome;
  }

  toString(): string {
    if (this.expectedOutcome) {
      return `${this.instruction} → ${this.expectedOutcome}`;
    }
    return this.instruction;
  }
}
