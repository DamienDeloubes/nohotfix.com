import { Email } from './value-objects/email.js';
import { FirstName } from './value-objects/first-name.js';
import { LastName } from './value-objects/last-name.js';
import { WorkosUserId } from './value-objects/workos-user-id.js';

export interface UserProps {
  id: string;
  workosUserId: WorkosUserId;
  email: Email;
  firstName: FirstName | null;
  lastName: LastName | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  readonly id: string;
  readonly workosUserId: WorkosUserId;
  readonly email: Email;
  readonly firstName: FirstName | null;
  readonly lastName: LastName | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.workosUserId = props.workosUserId;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(params: { id: string; workosUserId: string; email: string; firstName?: string; lastName?: string }): UserEntity {
    const now = new Date();
    return new UserEntity({
      id: params.id,
      workosUserId: WorkosUserId.create(params.workosUserId),
      email: Email.create(params.email),
      firstName: params.firstName ? FirstName.create(params.firstName) : null,
      lastName: params.lastName ? LastName.create(params.lastName) : null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  updateProfile(params: { firstName?: string; lastName?: string }): UserEntity {
    return new UserEntity({
      id: this.id,
      workosUserId: this.workosUserId,
      email: this.email,
      firstName: params.firstName !== undefined ? FirstName.create(params.firstName) : this.firstName,
      lastName: params.lastName !== undefined ? LastName.create(params.lastName) : this.lastName,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}
