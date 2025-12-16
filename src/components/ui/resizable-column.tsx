"use client";

import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { ReactNode } from "react";

interface ResizableColumnProps {
  width: number;
  minWidth?: number;
  children: ReactNode;
  onResize: (newWidth: number) => void;
}

export function ResizableColumn({
  width,
  minWidth = 80,
  children,
  onResize,
}: ResizableColumnProps) {
  return (
    <ResizableBox
      width={width}
      height={0}
      axis="x"
      resizeHandles={["e"]}
      minConstraints={[minWidth, 0]}
      onResize={(e, data) => onResize(data.size.width)}
      handleSize={[8, 8]}
      className="flex items-center"
    >
      <div style={{ width, whiteSpace: "nowrap" }}>{children}</div>
    </ResizableBox>
  );
}
