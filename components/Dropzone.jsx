"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";

export default function Dropzone({ onUpload }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: true,
    onDrop: async (acceptedFiles) => {
      console.log("Accepted files:", acceptedFiles);

      setFiles(acceptedFiles);
      setIsUploading(true);

      const urls = [];

      for (const file of acceptedFiles) {
        const fileName = `${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
          .from("property-images")
          .upload(fileName, file);

        if (error) {
          console.error("Upload error:", error.message);
          continue;
        }

        const { data } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        console.log("Public URL:", data.publicUrl);
        urls.push(data.publicUrl);
      }

      console.log("Calling onUpload with:", urls);

      if (onUpload) {
        onUpload(urls);
      }

      setIsUploading(false);
    },
  });

  return (
    <div
      {...getRootProps()}
      className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-gray-400"
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <p>Drop the images here...</p>
      ) : (
        <p>Drag & drop property images here, or click to select files</p>
      )}

      {isUploading && (
        <p className="mt-3 text-sm text-gray-500">Uploading images...</p>
      )}

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt="preview"
              className="h-32 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
