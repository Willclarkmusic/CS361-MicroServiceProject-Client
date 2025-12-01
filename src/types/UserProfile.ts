export interface UserProfile {
  userId: number;
  username: string;
  phoneNumber: string;
  avatarURL: string;
  userBio: string | null;
  createdAt?: string;
  updatedAt?: string;
}
