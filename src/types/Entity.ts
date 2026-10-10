export type BookStatus = 'Disponible' | 'Prestado';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  imageUrl: string;
  status: BookStatus;
  rating: number;
  createdAt?: string;
}

export type BookInput = Omit<Book, 'id'>;
