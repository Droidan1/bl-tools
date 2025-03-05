
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SignageData } from "@/types/signage";
import { Canvas } from "fabric";
import { renderSignageTemplate } from "./signageTemplates";

interface SignagePreviewProps {
  signageData: SignageData;
}

export const SignagePreview = ({ signageData }: SignagePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    // Initialize canvas on mount
    if (canvasRef.current && !fabricRef.current) {
      const canvas = new Canvas(canvasRef.current);
      
      // Set canvas dimensions based on signage dimensions
      const isLandscape = signageData.dimensions === "11 in x 8.5 in";
      canvas.setWidth(isLandscape ? 550 : 425);
      canvas.setHeight(isLandscape ? 425 : 550);
      
      fabricRef.current = canvas;
    }

    return () => {
      // Cleanup when component unmounts
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (fabricRef.current) {
      // Adjust canvas dimensions when orientation changes
      const isLandscape = signageData.dimensions === "11 in x 8.5 in";
      fabricRef.current.setWidth(isLandscape ? 550 : 425);
      fabricRef.current.setHeight(isLandscape ? 425 : 550);
      
      // Update canvas with the new signage data
      renderSignageTemplate(fabricRef.current, signageData);
    }
  }, [signageData]);

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center p-4">
        <div 
          className="border border-gray-200 rounded shadow-md overflow-hidden bg-white"
          style={{ 
            width: signageData.dimensions === "11 in x 8.5 in" ? "550px" : "425px",
            height: signageData.dimensions === "11 in x 8.5 in" ? "425px" : "550px"
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  );
};
