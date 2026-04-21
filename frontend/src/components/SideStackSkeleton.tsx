export function SideStackSkeleton() {
  return (
    <div className="relative w-full aspect-[4/3] animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => {
        const offset = index * 6
        const scale = 1 - index * 0.04

        return (
          <div
            key={index}
            className="absolute top-0 left-0 h-full w-[75%] rounded-xl bg-muted"
            style={{
              transform: `translateX(${offset}px) scale(${scale})`,
              zIndex: 10 - index,
            }}
          />
        )
      })}
    </div>
  )
}