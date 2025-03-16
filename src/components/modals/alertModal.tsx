import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

import React from "react";

type DeleteWarningProps = {
  onConfirm: () => void;
  title: string;
  description: string;
  buttonLabel: string;
  buttonClassName: string;
};

const DeleteWarning: React.FC<DeleteWarningProps> = ({
  onConfirm,
  title,
  description,
  buttonLabel,
  buttonClassName,
}) => {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className={buttonClassName}>
          {buttonLabel}
        </AlertDialogTrigger>
        <AlertDialogContent className={cn("p-12", buttonClassName)}>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteWarning;