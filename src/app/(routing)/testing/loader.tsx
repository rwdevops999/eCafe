import { cn } from '@/lib/utils';
import { Loader2, LoaderPinwheel } from 'lucide-react';

const Loader = ({ className }: { className?: string }) => {
  return (
    <Loader2 width={24} height={24}
      className={cn('mt-2 text-primary/60 animate-spin', className)}
    />
  );
};

export default Loader;
