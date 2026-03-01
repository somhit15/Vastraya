export interface Category {
    $id: string;
    name: string;
    slug: string;
    image_url?: string;
    $createdAt: string;
}

export interface Product {
    $id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    sale_price?: number;
    sizes: string[];
    category_id: string;
    images: string[];
    stock_status: 'in_stock' | 'out_of_stock';
    is_featured: boolean;
    $createdAt: string;
    $updatedAt: string;
}

export interface CartItem extends Product {
    selectedSize: string;
    quantity: number;
}
