import { RESOURCE } from '@/constants/config';
import type { Book, BookInput } from '@/types/Entity';

import { api } from './api';

export const getItems = async (): Promise<Book[]> => {
  const { data } = await api.get<Book[]>(RESOURCE);
  return data;
};

export const getItemById = async (id: string): Promise<Book> => {
  const { data } = await api.get<Book>(`${RESOURCE}/${id}`);
  return data;
};

export const createItem = async (book: BookInput): Promise<Book> => {
  const { data } = await api.post<Book>(RESOURCE, {
    ...book,
    createdAt: new Date().toISOString(),
  });
  return data;
};

export const updateItem = async (id: string, book: BookInput): Promise<Book> => {
  const { data } = await api.put<Book>(`${RESOURCE}/${id}`, book);
  return data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`${RESOURCE}/${id}`);
};
