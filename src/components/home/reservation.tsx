"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarCheck, CheckCircle2, Clock, Users } from "lucide-react";

const times = ["12:00", "13:30", "18:00", "19:30", "20:30", "21:30"];

export function Reservation() {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section id="reservation" className="bg-base-100 py-16 lg:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-lg">
          <div className="absolute inset-4 rounded-full bg-secondary/15 blur-xl" />
          <div className="relative h-full overflow-hidden rounded-[2.5rem] border-8 border-cream shadow-soft">
            <Image
              src="/images/reservation.jpg"
              alt="A plated steak dinner with fries"
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 py-3 shadow-soft">
            <span className="grid size-10 place-items-center rounded-full bg-primary/15 text-primary">
              <Clock className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Open daily</p>
              <p className="text-xs text-base-content/60">11:00 — 23:00</p>
            </div>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
            Reserve a table
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Save Your Seat For A Memorable Evening
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-base-content/70 sm:text-base">
            Grab a table for two or bring the whole family. Pick a time that
            suits you and we will have everything ready when you arrive — no
            queue, no waiting.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-base-content/80">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-primary" /> Free cancellation
              up to two hours before
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-primary" /> Groups of up to
              twelve welcome
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-primary" /> Window tables
              available on request
            </li>
          </ul>

          <button
            type="button"
            onClick={() => {
              setConfirmed(false);
              setOpen(true);
            }}
            className="btn btn-primary mt-8 rounded-full px-7 font-semibold"
          >
            <CalendarCheck className="size-4" /> Make Reservation
          </button>
        </div>
      </div>

      {open ? (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box max-w-md rounded-box border border-base-300">
            {confirmed ? (
              <div className="py-6 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="size-7" />
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-ink">
                  Table requested
                </h3>
                <p className="mt-2 text-sm text-base-content/70">
                  This is a demo reservation — no table has been booked. In a
                  production build this form would write to the reservations
                  collection.
                </p>
                <button
                  type="button"
                  className="btn btn-primary mt-6 rounded-full"
                  onClick={() => setOpen(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setConfirmed(true);
                }}
              >
                <h3 className="text-xl font-extrabold text-ink">
                  Book your table
                </h3>
                <p className="mt-1 text-sm text-base-content/60">
                  Tell us when you would like to visit.
                </p>

                <div className="mt-5 space-y-3">
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold">Name</span>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="input input-bordered w-full rounded-xl"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="form-control w-full">
                      <span className="label-text mb-1 font-semibold">Date</span>
                      <input
                        required
                        name="date"
                        type="date"
                        className="input input-bordered w-full rounded-xl"
                      />
                    </label>
                    <label className="form-control w-full">
                      <span className="label-text mb-1 font-semibold">Time</span>
                      <select
                        name="time"
                        className="select select-bordered w-full rounded-xl"
                        defaultValue="19:30"
                      >
                        {times.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold">Guests</span>
                    <div className="relative">
                      <Users className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-base-content/50" />
                      <input
                        required
                        name="guests"
                        type="number"
                        min={1}
                        max={12}
                        defaultValue={2}
                        className="input input-bordered w-full rounded-xl pl-10"
                      />
                    </div>
                  </label>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost rounded-full"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-full">
                    Request table
                  </button>
                </div>
              </form>
            )}
          </div>
          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close reservation form"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
    </section>
  );
}
