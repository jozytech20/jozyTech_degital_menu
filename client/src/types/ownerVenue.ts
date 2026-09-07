export interface OwnerVenue {
    _id: string;
    name: string;
    slug: string;
    email: string;
    phone: string;
    website: string | null;
    status: "active" | "paused";
    branding: {
        logoUrl: string;
        qrCodeUrl?: string;
        theme: {
            primaryColor: string;
            secondaryColor: string;
        };
    };
}