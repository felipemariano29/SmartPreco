import { type MarketDto } from "@/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Edit, MapPin, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

interface MarketDetailsProps {
  market: MarketDto;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MarketDetails({ market, onClose, onEdit, onDelete }: MarketDetailsProps) {
  const t = useTranslations("markets");
  const buttonT = useTranslations("common.buttons");
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("table.name")}</DialogTitle>
          <DialogDescription>
            View detailed information about this market.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {market.imageUrl && (
            <div className="flex justify-center">
              <img
                src={market.imageUrl}
                alt={market.name}
                className="h-40 w-40 rounded-md object-cover"
              />
            </div>
          )}
          
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <div className="font-semibold">{t("table.name")}:</div>
            <div>{market.name}</div>
            
            <div className="font-semibold">{t("table.address")}:</div>
            <div>{market.address}</div>
            
            <div className="font-semibold">{t("table.city")}:</div>
            <div>{market.city}</div>
            
            <div className="font-semibold">{t("table.state")}:</div>
            <div>{market.state}</div>
            
            <div className="font-semibold">{t("table.id")}:</div>
            <div className="break-all">{market.id}</div>
            
            <div className="font-semibold">Last Updated:</div>
            <div>{new Date(market.updatedAt).toLocaleString()}</div>
          </div>

          <div className="mt-2 rounded-md border bg-muted/50 p-4">
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4" />
              Location Information
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {market.address}, {market.city}, {market.state}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click the buttons below to edit or delete this market.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {buttonT("cancel")}
          </Button>
          <Button variant="outline" onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" /> {buttonT("edit")}
          </Button>
          <Button variant="destructive" onClick={onDelete} className="gap-2">
            <Trash className="h-4 w-4" /> {buttonT("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 