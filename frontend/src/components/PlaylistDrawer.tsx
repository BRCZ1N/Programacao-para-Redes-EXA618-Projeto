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
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Sua playlist gerada</DrawerTitle>
          <DrawerDescription>Preview da playlist</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
          {playlist?.games?.map((item: any) => (
            <div key={item.id} className="flex gap-3 p-3 rounded-lg border">
              <img
                src={item.url_image}
                className="w-24 h-16 object-cover rounded-md"
              />

              <div className="flex flex-col gap-1">
                <div className="font-semibold">{item.title}</div>

                <div className="text-sm">
                  ⭐ {item.review_rating} • {item.total_reviews} reviews
                </div>

                <div className="flex gap-2 text-sm">
                  <span className="line-through text-muted-foreground">
                    ${item.price}
                  </span>

                  <span className="text-green-500 font-medium">
                    ${item.discount_price}
                  </span>
                </div>

                <a
                  href={item.url_steam}
                  target="_blank"
                  className="text-blue-500 text-sm"
                >
                  Ver na Steam
                </a>
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
