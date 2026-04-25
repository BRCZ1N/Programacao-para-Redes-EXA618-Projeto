import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../components/ui/empty";

type Props = {
  action?: React.ReactNode;
};

export function EmptyDemo({ action }: Props) {
  return (
    <Empty className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center bg-slate-950/40 rounded-xl">
      <div className="flex flex-col items-center gap-5">
        <EmptyHeader className="flex flex-col items-center gap-4">

          {/* TITLE */}
          <EmptyTitle className="text-2xl font-semibold text-slate-100">
            Sua biblioteca está vazia
          </EmptyTitle>

          {/* DESCRIPTION */}
          <EmptyDescription className="max-w-md text-sm text-slate-400 leading-relaxed">
            Gere sua primeira playlist e descubra novos jogos para jogar.
          </EmptyDescription>

        </EmptyHeader>

        {/* ACTION */}
        {action && (
          <EmptyContent className="mt-8 w-full flex justify-center">
            {action}
          </EmptyContent>
        )}
      </div>
    </Empty>
  );
}