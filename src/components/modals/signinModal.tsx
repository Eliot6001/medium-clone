import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useStoreModal";
import Auth from '@/Auth'

export function DialogCloseButton() {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type == "signInModal";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <Auth />
      </DialogContent>
    </Dialog>
  );
}
