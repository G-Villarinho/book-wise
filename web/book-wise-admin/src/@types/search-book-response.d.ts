export type SearchBookResponse = {
  externalBookId: string;
  totalPages: number;
  title: string;
  description: string;
  coverImageURL: string;
  authors: string[];
  categories: string[];
};
