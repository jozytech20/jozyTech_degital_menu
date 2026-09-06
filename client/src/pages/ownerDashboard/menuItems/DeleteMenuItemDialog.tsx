// src/pages/owner/menu-items/DeleteMenuItemDialog.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import type { OwnerMenuItem } from "../../../types/menuItems";

interface DeleteMenuItemDialogProps {
    item: OwnerMenuItem | null;
    deleting: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

function DeleteMenuItemDialog({ item, deleting, onOpenChange, onConfirm }: DeleteMenuItemDialogProps) {
    return (
        <AlertDialog
            open={!!item}
            onOpenChange={(open) => {
                if (!open && !deleting) onOpenChange(false);
            }}
        >
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader className="items-center gap-4 sm:flex-row sm:items-start">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                        <TriangleAlert className="size-5 text-destructive" />
                    </div>
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                        <AlertDialogTitle className="text-base font-semibold">
                            Delete menu item
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed">
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-foreground">"{item?.name}"</span>?
                            This action is permanent and cannot be undone.
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={onConfirm} disabled={deleting}>
                        {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteMenuItemDialog;