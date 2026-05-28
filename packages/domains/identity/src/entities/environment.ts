import { EnvironmentName } from './value-objects/environment-name.js';

export interface EnvironmentProps {
  id: string;
  orgId: string;
  name: EnvironmentName;
  position: number;
  createdAt: Date;
}

export class EnvironmentEntity {
  readonly id: string;
  readonly orgId: string;
  readonly name: EnvironmentName;
  readonly position: number;
  readonly createdAt: Date;

  private constructor(props: EnvironmentProps) {
    this.id = props.id;
    this.orgId = props.orgId;
    this.name = props.name;
    this.position = props.position;
    this.createdAt = props.createdAt;
  }

  static create(params: { id: string; orgId: string; name: string; position: number }): EnvironmentEntity {
    return new EnvironmentEntity({
      id: params.id,
      orgId: params.orgId,
      name: EnvironmentName.create(params.name),
      position: params.position,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: EnvironmentProps): EnvironmentEntity {
    return new EnvironmentEntity(props);
  }

  rename(newName: string): EnvironmentEntity {
    return new EnvironmentEntity({
      id: this.id,
      orgId: this.orgId,
      name: EnvironmentName.create(newName),
      position: this.position,
      createdAt: this.createdAt,
    });
  }
}
