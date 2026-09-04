export interface AuthUser {
  id: string;
  name: string;
  role: "owner" | "superAdmin";
  venueId: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}