// src/components/admin/DeleteUserDialog.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onConfirm: () => void;
}

function DeleteUserDialog({
  open,
  onOpenChange,
  userName,
  onConfirm,
}: DeleteUserDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (open) {
      setConfirmText("");
    }
  }, [open]);

  const isMatch = confirmText === userName;

  const handleConfirm = () => {
    onConfirm();
    setConfirmText("");
    onOpenChange(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          This will permanently delete <strong>{userName}</strong> and, if they
          are an owner, their venue, categories, and menu items. This cannot be
          undone.
        </p>

        <p className="text-sm">
          Type <strong>{userName}</strong> to confirm.
        </p>

        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={userName}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!isMatch}
            onClick={handleConfirm}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUserDialog;
