export interface NgxCropperOption {
  url?: string | null;
  maxsize?: number;
  title?: string;
  uploadBtnName?: string;
  uploadBtnClass?: string | null;
  cancelBtnName?: string;
  cancelBtnClass?: string | null;
  applyBtnName?: string;
  applyBtnClass?: string | null;
  errorMsgs?: { [key: string]: string | null };
  fdName?: string;
  aspectRatio?: number;
  viewMode?: number; // 0, 1, 2, 3
}
