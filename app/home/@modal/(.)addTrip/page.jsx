"use client";

import AddTrip from "@/components/home/AddTrip";

export default function InterceptedImagePage({ params }) {
  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-85 flex justify-center items-center">
      <dialog
        className="rounded-lg z-20 border-none max-w-[50rem] shadow-lg shadow-gray-800"
        open
      >
        <div>
          <AddTrip />
        </div>
      </dialog>
    </div>
  );
}
