"use client";

import { useState } from "react";

function getInitial(name?: string | null): string {
  const first = Array.from(name?.trim() ?? "")[0];
  return first ? first.toUpperCase() : "U";
}

/**
 * Signed-in user avatar. Renders the Better Auth `user.image` when one is
 * available and falls back to the first letter of the user's name when the
 * image is missing or fails to load.
 */
export function UserAvatar({
  name,
  image,
  className = "",
}: {
  name?: string | null;
  image?: string | null;
  className?: string;
}) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showImage = Boolean(image) && failedImage !== image;

  if (showImage && image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatar URLs can come from any identity provider
      <img
        src={image}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        onError={() => setFailedImage(image)}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-full bg-primary font-bold text-primary-content ${className}`}
    >
      {getInitial(name)}
    </span>
  );
}
