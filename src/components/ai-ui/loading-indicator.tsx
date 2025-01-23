export function LoadingIndicator() {
  return (
    <div className="flex justify-end py-1.5 pl-11">
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary/30 animate-[bounce_1.4s_ease-in-out_0s_infinite]" />
        <span className="size-2 rounded-full bg-primary/30 animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="size-2 rounded-full bg-primary/30 animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
}
