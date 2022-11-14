import { InputHTMLAttributes } from 'react';

type SearchBarComponents = 'form' | 'input' | 'button';

export type SearchBarProps = {
  className?: Partial<Record<SearchBarComponents, string>>;
  onSearch: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;
