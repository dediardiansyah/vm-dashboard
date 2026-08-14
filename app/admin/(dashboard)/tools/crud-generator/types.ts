export interface Column {
  key: string
  type: string
  selected: boolean
  config?: {
    isSortable?: boolean
    isFilterable?: boolean
    renderType?: 'text' | 'badge' | 'date' | 'image' | 'html'
    rows?: number
    min?: number
    max?: number
    step?: number
    imageWidth?: number
    imageHeight?: number
    imageClassName?: string
    selectOptions?: Array<{
      label: string
      value: string
    }>
    badgeConfig?: {
      variants: Record<string, string>
      defaultVariant?: string
    }
  }
}

export interface GenerateOptions {
  name: string
  columns: Column[]
  apiEndpoint: string
}

export interface FieldDetail {
  name: string
  key: string
}

export interface ColumnConfig {
  key: string;
  config: {
    isSortable?: boolean;
    isFilterable?: boolean;
    renderType?: 'text' | 'badge' | 'date' | 'image' | 'html';
    badgeConfig?: {
      variants: Record<string, any>;
    };
  };
}