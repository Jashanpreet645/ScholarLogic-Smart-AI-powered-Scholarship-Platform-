import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-muted/20 dark:bg-white/5 animate-pulse rounded-md backdrop-blur-[2px] border border-black/5 dark:border-white/5 shadow-inner",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
