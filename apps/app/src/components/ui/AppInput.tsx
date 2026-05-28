import { Input, type InputProps } from '@heroui/react';

type AppInputProps = InputProps;

export function AppInput({ className, ...props }: AppInputProps) {
  return (
    <Input
      className={`bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] h-10 text-sm text-white placeholder:text-white/30 outline-none hover:bg-[var(--glass-8)] focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)] px-3 ${className ?? ''}`}
      {...props}
    />
  );
}
