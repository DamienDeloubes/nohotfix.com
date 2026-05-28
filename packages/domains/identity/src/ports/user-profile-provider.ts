export interface UserProfile {
  workosUserId: string;
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
  lastSignInAt: string | null;
}

export interface UserProfileProvider {
  getByWorkosId(workosUserId: string): Promise<UserProfile>;
}
