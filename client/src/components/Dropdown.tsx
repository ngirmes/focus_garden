import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./Dropdown.module.css";

interface DropdownProps {
  label: ReactNode;
  triggerClassName?: string;
  align?: "left" | "right";
  children: ReactNode;
}

export default function Dropdown({ label, triggerClassName, align = "left", children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button className={triggerClassName} onClick={() => setIsOpen((open) => !open)}>
        {label}
      </button>

      {isOpen && (
        <div className={`${styles.panel} ${align === "right" ? styles.panelRight : styles.panelLeft}`}>
          {children}
        </div>
      )}
    </div>
  );
}
