export type Tip = {
  id: string;
  title: string;
  summary: string;
  type?: string;
  linkUrl?: string | null;
  internalRoute?: string | null;
  imageUrl?: string | null;
  body?: string | null;
};
