export interface Pagination<T> {
  total: number;
  page: number;
  size: number;
  items: T[];
}

export interface User{
    id: string
    full_name: string
    email: string
    phone_number: string
    created_at: Date
    updated_at: Date
}