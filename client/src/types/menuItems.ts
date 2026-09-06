export interface OwnerMenuItem {
    _id: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
    isFeatured: boolean;
    sortOrder: number;
    createdAt: string;
}

export interface FetchMenuItemsResponse {
    success: boolean;
    message: string;
    data: OwnerMenuItem[];
}