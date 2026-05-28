export async function uploadArtifact(_data: {
  specId: string;
  runId: string;
  orgId: string;
  requirementIndex: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
}): Promise<{ presignedUrl: string }> {
  // TODO: Validate constraints, generate presigned URL, record metadata
  return { presignedUrl: 'https://placeholder.example.com' };
}
