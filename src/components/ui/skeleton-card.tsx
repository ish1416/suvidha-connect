import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const SkeletonCard = () => (
  <Card className="border shadow-xl">
    <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full justify-center min-h-[180px] md:min-h-[220px]">
      <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-2xl mb-4" />
      <Skeleton className="h-5 md:h-6 w-32 mb-2" />
      <Skeleton className="h-3 md:h-4 w-full max-w-[200px]" />
      <Skeleton className="h-3 md:h-4 w-3/4 max-w-[150px] mt-1" />
    </CardContent>
  </Card>
);
