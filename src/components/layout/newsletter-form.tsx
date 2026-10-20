"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className="mt-4 flex w-full max-w-sm items-center gap-2 rounded-full border border-base-300 bg-base-100 p-1.5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!email) return;
        setDone(true);
        setEmail("");
      }}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={done ? "Thanks for subscribing!" : "Email here"}
        className="input input-ghost w-full border-0 bg-transparent text-sm focus:outline-none"
      />
      <button
        type="submit"
        className="btn btn-primary btn-circle btn-sm shrink-0"
        aria-label="Subscribe"
      >
        <Send className="size-4" />
      </button>
    </form>
  );
}
