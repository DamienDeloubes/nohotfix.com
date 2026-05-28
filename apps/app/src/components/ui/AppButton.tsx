import { Button, type ButtonProps } from '@heroui/react';

const intentClasses: Record<string, string> = {
  primary: 'bg-blue-500 text-white font-medium hover:bg-blue-600 border-none',
  ghost: 'bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/60 font-medium hover:bg-[var(--glass-12)] hover:text-white',
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
      className={`text-sm whitespace-nowrap rounded-sm transition-colors [transition-duration:var(--duration-fast)] ${intentClass} ${className ?? ''}`}
      {...props}
    />
  );
}
