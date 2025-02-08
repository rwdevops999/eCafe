import { cn } from '@/lib/utils';
import { Loader2, LoaderPinwheel } from 'lucide-react';

const EcafeLoader = ({ className }: { className?: string }) => {
  return (
    <Loader2 width={24} height={24}
      className={cn('text-primary/60 animate-spin', className)}
    />
  );
};

export default EcafeLoader;
