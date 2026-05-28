import type { RunSpecArtifact } from '../types.js';

export interface RunSpecArtifactRepository {
  findBySpec(specId: string, orgId: string): Promise<RunSpecArtifact[]>;
  create(data: Omit<RunSpecArtifact, 'id' | 'createdAt'>): Promise<RunSpecArtifact>;
  update(id: string, orgId: string, data: Partial<RunSpecArtifact>): Promise<RunSpecArtifact | undefined>;
}
