import { OrganisationName } from './value-objects/organisation-name.js';
import { OrganisationSlug } from './value-objects/organisation-slug.js';

export interface OrganisationProps {
  id: string;
  name: OrganisationName;
  slug: OrganisationSlug;
  createdAt: Date;
  updatedAt: Date;
}

export class OrganisationEntity {
  readonly id: string;
  readonly name: OrganisationName;
  readonly slug: OrganisationSlug;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: OrganisationProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(params: { id: string; name: string; slug: string }): OrganisationEntity {
    const now = new Date();
    return new OrganisationEntity({
      id: params.id,
      name: OrganisationName.create(params.name),
      slug: OrganisationSlug.create(params.slug),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: OrganisationProps): OrganisationEntity {
    return new OrganisationEntity(props);
  }

  rename(newName: string): OrganisationEntity {
    return new OrganisationEntity({
      id: this.id,
      name: OrganisationName.create(newName),
      slug: this.slug,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}
