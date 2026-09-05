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

export interface AdminVenue {
  _id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  website: string | null;
  status: "active" | "paused";
  ownerId: string;
  branding: {
    logoUrl: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
    };
  };
  createdAt: string;
}

export interface FetchVenuesResponse {
  success: boolean;
  message: string;
  data: AdminVenue[];
}