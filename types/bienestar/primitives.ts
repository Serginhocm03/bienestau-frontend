export type Media = {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Formats = {
  thumbnail: Format;
  [key: string]: Format;
};

export type Format = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path?: string;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
};

export type Meta = {
  pagination?: Pagination;
};

export type Pagination =
  | {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  | {
      start: number;
      limit: number;
      total: number;
    };
