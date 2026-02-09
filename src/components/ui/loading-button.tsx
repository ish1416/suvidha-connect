import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton = ({ loading, children, disabled, ...props }: LoadingButtonProps) => (
  <Button disabled={loading || disabled} {...props}>
    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
    {children}
  </Button>
);
