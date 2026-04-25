import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: any;
  onGenerateAgain: () => void;
};

export function PlaylistDrawer({
  open,
  onOpenChange,
  playlist,
  onGenerateAgain,
}: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="
          w-full max-w-full
          max-h-[90vh]
          flex flex-col
          min-w-0
          bg-slate-950
          border-t border-slate-800
          overflow-hidden
        "
      >
        {/* HEADER */}
        <DrawerHeader className="border-b border-slate-800">
          <DrawerTitle className="text-white text-lg font-semibold">
            Sua playlist gerada
          </DrawerTitle>

          <DrawerDescription className="text-slate-500 text-sm">
            Preview da sua seleção de jogos
          </DrawerDescription>
        </DrawerHeader>

        {/* LISTA */}
        <div className="flex flex-1 items-center justify-center p-4 overflow-hidden">
          <div className="flex flex-row gap-3 overflow-x-auto overflow-y-hidden max-h-[70vh] px-4">
            {playlist?.games?.map((item: any) => (
              <div
                key={item.id}
                className="
                  flex flex-col gap-2 p-3
                  rounded-lg
                  border border-slate-800
                  bg-slate-900/40
                  hover:bg-slate-900/60
                  transition
                  flex-shrink-0
                  w-48
                "
              >
                {/* IMAGEM */}
                <img
                  src={item.url_image}
                  alt={item.title}
                  className="
                    w-full h-32
                    object-cover
                    rounded-md
                    border border-slate-800
                  "
                />

                {/* CONTEÚDO */}
                <div className="flex flex-col gap-1">
                  {/* TÍTULO */}
                  <div className="font-medium text-slate-200 line-clamp-2 text-sm">
                    {item.title}
                  </div>

                  {/* REVIEW */}
                  <div className="text-xs text-slate-500">
                    ⭐ {item.review_rating} • {item.total_reviews} reviews
                  </div>

                  {/* PREÇO */}
                  <div className="flex gap-2 text-xs items-center">
                    <span className="line-through text-slate-500">
                      ${item.price}
                    </span>

                    <span className="text-green-400 font-medium">
                      ${item.discount_price}
                    </span>
                  </div>

                  {/* LINK */}
                  <a
                    href={item.url_steam}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs transition"
                  >
                    Ver na Steam
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}