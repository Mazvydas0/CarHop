"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Modal({ children }) {
  const router = useRouter();
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeModal = (e) => {
    e.target === dialogRef.current && router.back();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={closeModal}
      onClose={router.back}
      className="backdrop:backdrop-blur-sm rounded-lg"
    >
      <div>{children}</div>
    </dialog>
  );
}
