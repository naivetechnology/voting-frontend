import { create } from 'zustand';
import { getCategories } from '@/services/categoryService';
import { queryClient } from '@/lib/queryClient';

interface Category {
  id: string;
  name: string;
}

interface CategoryStore {
  categories: Category[];
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  fetchCategories: async () => {
    const categories = await queryClient.fetchQuery({
      queryKey: ['categories'],
      queryFn: getCategories,
    });

    set({ categories });
  },
}));
