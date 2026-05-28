import { Button, type ButtonProps } from '@heroui/react';

const intentClasses: Record<string, string> = {
  primary: 'bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] border-none',
  ghost: 'bg-transparent border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
  destructive: 'bg-error-500/10 text-error-500 font-medium border-none hover:bg-error-500/20',
};

interface AppButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  intent?: 'primary' | 'ghost' | 'destructive';
}

export function AppButton({ intent = 'primary', className, ...props }: AppButtonProps) {
  const intentClass = intentClasses[intent] ?? intentClasses.primary;

  return (
    <Button
      variant="ghost"
      className={`text-sm whitespace-nowrap rounded-md transition-colors [transition-duration:var(--duration-fast)] ${intentClass} ${className ?? ''}`}
      {...props}
    />
  );
}
