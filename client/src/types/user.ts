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

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "superAdmin";
  isActive: boolean;
  venueId: string | null;
  createdAt: string;
}

export interface FetchUsersResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
}