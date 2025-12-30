export interface Users {
    name: string;
    google_id: string; // For now Google is the only provider
    email: string;
    photo_url: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Categories {
    name: string;
    user_id: string; // FOREIGN KEY / Optional (NULL)
    color_hex: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Transactions {
    user_id: string; // FOREIGN KEY
    category_id?: string; // FOREIGN KEY / Optional when creating an income
    amount: number;
    date: Date;
    type: string; // INCOME or EXPENSE
    description?: string;
}
