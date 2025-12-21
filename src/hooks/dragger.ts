"use client";
import { useRef, useState, useEffect } from "react";

export function useRightDrag({ minRight = 0, maxRight = 0 } = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const onMouseMove = (e : MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;

      // calculate right based on mouse position
      let newRight = viewportWidth - e.clientX - containerWidth;

      newRight = Math.min(minRight, Math.max(newRight, maxRight));

      containerRef.current.style.right = `${newRight}px`;
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, minRight, maxRight]);

  return {
    containerRef,
    onMouseDown
  };
}
