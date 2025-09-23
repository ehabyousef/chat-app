import { Skeleton } from "@/components/ui/skeleton";
const skeletonMessages = Array(10).fill(null);
export function MessageSkeleton() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => {
        const isEnd = idx % 2 !== 0;
        return (
          <div
            key={idx}
            className={`flex w-full ${isEnd ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-center space-x-4 max-w-[70%] ${
                isEnd ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
              <div className="space-y-2">
                <Skeleton
                  className={`h-4 ${isEnd ? "w-[200px]" : "w-[250px]"}`}
                />
                <Skeleton
                  className={`h-4 ${isEnd ? "w-[150px]" : "w-[200px]"}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
