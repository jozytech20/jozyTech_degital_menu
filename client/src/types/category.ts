export interface OwnerCategory {
    _id: string;
    name: string;
    description: string;
    image: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
}

export interface FetchCategoriesResponse {
    success: boolean;
    message: string;
    data: OwnerCategory[];
}