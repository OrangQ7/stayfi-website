"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  FLEX_TEMPLATE_HEIGHT,
  FLEX_TEMPLATE_WIDTH,
  FLEXIBLE_FUR_REGION_MAP,
} from "@/lib/flexibleCatTemplate";
import { getFaceFeatureColor } from "@/lib/faceFeatureColors";
import { getFaceFeaturePreset } from "@/lib/faceFeatureTemplate";
import {
  FUR_ROLE_HEX,
  type FlexibleRenderConfig,
} from "@/lib/flexibleCatTypes";
import { getPixelCatCanvasMetrics } from "@/lib/pixelCanvasMetrics";

export type FlexibleCatRendererHandle = {
  downloadPng: () => void;
};

type FlexibleCatRendererProps = {
  config: FlexibleRenderConfig;
  cellSize?: number;
  exportSize?: number;
};

function paintFlexibleCat(
  canvas: HTMLCanvasElement,
  config: FlexibleRenderConfig,
  cellSize: number,
  paddingX = 0,
  paddingY = 0,
) {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (config.backgroundColor === "white") {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Fur layer. BG and OL are intentionally skipped here.
  FLEXIBLE_FUR_REGION_MAP.forEach((row, rowIndex) => {
    row.forEach((region, colIndex) => {
      if (region === "BG" || region === "OL") {
        return;
      }

      const color = FUR_ROLE_HEX[config.furRegionPlan[region]];

      if (color === "transparent") {
        return;
      }

      context.fillStyle = color;
      context.fillRect(
        paddingX + colIndex * cellSize,
        paddingY + rowIndex * cellSize,
        cellSize,
        cellSize,
      );
    });
  });

  // Immutable outline layer.
  FLEXIBLE_FUR_REGION_MAP.forEach((row, rowIndex) => {
    row.forEach((region, colIndex) => {
      if (region !== "OL") {
        return;
      }

      context.fillStyle = "#111111";
      context.fillRect(
        paddingX + colIndex * cellSize,
        paddingY + rowIndex * cellSize,
        cellSize,
        cellSize,
      );
    });
  });

  // Feature overlay layer. These are not fur and never affect fur plans.
  const featureCells =
    config.faceMode === "features"
      ? getFaceFeaturePreset(config.faceFeaturePreset).cells
      : [];

  featureCells.forEach((cell) => {
    const color = getFaceFeatureColor(config.faceFeaturePreset, cell.role);

    if (!color) {
      return;
    }

    context.fillStyle = color;
    context.fillRect(
      paddingX + (cell.col - 1) * cellSize,
      paddingY + (cell.row - 1) * cellSize,
      cellSize,
      cellSize,
    );
  });
}

function exportFlexibleCat(config: FlexibleRenderConfig, exportSize: number) {
  const canvas = document.createElement("canvas");
  const metrics = getPixelCatCanvasMetrics(exportSize);

  canvas.width = exportSize;
  canvas.height = exportSize;

  paintFlexibleCat(
    canvas,
    config,
    metrics.cellSize,
    metrics.paddingX,
    metrics.paddingY,
  );

  return canvas.toDataURL("image/png");
}

export const FlexibleCatRenderer = forwardRef<
  FlexibleCatRendererHandle,
  FlexibleCatRendererProps
>(function FlexibleCatRenderer(
  { config, cellSize = 24, exportSize = 1024 },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const size = Math.max(FLEX_TEMPLATE_WIDTH, FLEX_TEMPLATE_HEIGHT) * cellSize;
    const metrics = getPixelCatCanvasMetrics(size);

    paintFlexibleCat(
      canvas,
      config,
      metrics.cellSize,
      metrics.paddingX,
      metrics.paddingY,
    );
  }, [cellSize, config]);

  useImperativeHandle(
    ref,
    () => ({
      downloadPng() {
        const link = document.createElement("a");
        link.href = exportFlexibleCat(config, exportSize);
        link.download = "pixel-cat-avatar.png";
        link.click();
      },
    }),
    [config, exportSize],
  );

  return (
    <canvas
      ref={canvasRef}
      width={Math.max(FLEX_TEMPLATE_WIDTH, FLEX_TEMPLATE_HEIGHT) * cellSize}
      height={Math.max(FLEX_TEMPLATE_WIDTH, FLEX_TEMPLATE_HEIGHT) * cellSize}
      className="aspect-square h-auto w-full max-w-[504px] [image-rendering:pixelated]"
      aria-label="Rendered pixel cat avatar"
    />
  );
});
