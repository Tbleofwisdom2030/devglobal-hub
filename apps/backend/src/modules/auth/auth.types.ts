export interface RegisterDTO {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    role: string;
    emailVerified: boolean;
  };
  tokens: TokenResponse;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileDTO {
  fullName?: string;
  avatarUrl?: string;
}

export interface VerifyEmailDTO {
  token: string;
}