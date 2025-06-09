"use client";

import Link from "next/link";
import type { Tables } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { deleteGeneratedPlan } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Trash2, Eye } from "lucide-react";

interface HistoricalPlanItemProps {
  plan: Tables<"generated_plans">;
}

export function HistoricalPlanItem({ plan }: HistoricalPlanItemProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const planDate = new Date(plan.created_at).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteGeneratedPlan(plan.id);
    if (result.success) {
      toast({
        title: "Plan Deleted",
        description: result.message,
      });
      // Revalidation should refresh the list
    } else {
      toast({
        title: "Error Deleting Plan",
        description: result.error || "Could not delete the plan.",
        variant: "destructive",
      });
    }
    setIsDeleting(false);
  };

  return (
    <li className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Link href={`/view-plan?planId=${plan.id}`} className="flex-grow">
          <span className="font-medium text-primary block">
            Plan from {planDate}
          </span>
          <p className="text-sm text-muted-foreground mt-1">
            Goals: {plan.inputs.healthGoals.substring(0, 70)}
            {plan.inputs.healthGoals.length > 70 ? "..." : ""}
          </p>
        </Link>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/view-plan?planId=${plan.id}`}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />{" "}
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this fitness plan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Yes, delete plan"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </li>
  );
}
