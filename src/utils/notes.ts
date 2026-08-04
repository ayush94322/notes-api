export interface GetNotesOptions {
    page: number;
    limit: number;
    search?: string;
    favorite?: boolean;
    archived?:boolean;
    sort: "createdAt" | "updatedAt" | "title";
    order: "asc" | "desc";
    userId: string;
}