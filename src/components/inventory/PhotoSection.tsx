import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Trash2 } from 'lucide-react';
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
import { toast } from "sonner";
import { deletePhoto } from '@/lib/storage';

interface PhotoSectionProps {
  photoUrl: string | null;
  onShowCamera: () => void;
  onPhotoDelete: () => void;
}

export const PhotoSection = ({ photoUrl, onShowCamera, onPhotoDelete }: PhotoSectionProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      
      // Extract the file path from the URL
      const url = new URL(photoUrl!);
      const pathSegments = url.pathname.split('/');
      const filePath = pathSegments[pathSegments.length - 1];
      
      await deletePhoto(filePath);
      onPhotoDelete();
      toast.success("Photo deleted successfully");
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error("Failed to delete photo. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">
        Photo (Optional)
      </label>
      <div className="flex flex-col gap-2">
        {photoUrl ? (
          <div className="relative group">
            <img 
              src={photoUrl} 
              alt="Captured" 
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onShowCamera}
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-4 w-4 mr-2" />
              Retake
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={onShowCamera}
            className="w-full"
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo of Tag
          </Button>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};