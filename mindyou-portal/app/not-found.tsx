import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Page not found | Mind You",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-personal/8 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-enterprise/5 blur-3xl animate-float-1" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src="/72-3966.svg"
          alt="Mind You"
          width={226}
          height={48}
          className="mb-10 h-9 w-auto sm:h-10"
          priority
        />

        <p className="font-display text-[64px] font-semibold leading-none tracking-tight text-personal-dark sm:text-[80px]">
          404
        </p>
        <h1 className="mt-4 font-display text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">
          This page wandered off
        </h1>
        <p className="mt-3 max-w-[340px] font-body text-[14px] leading-relaxed text-ink/70 sm:text-[15px]">
          The link may be broken or the page may have moved. Let&rsquo;s get you
          back somewhere familiar.
        </p>

        <Link
          href="/"
          className="mt-9 inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-b from-personal to-personal-dark px-8 text-[14px] font-bold tracking-wider text-white shadow-[var(--shadow-button)] transition-all duration-200 hover:shadow-[var(--shadow-glow-personal)] active:shadow-[var(--shadow-button)]"
        >
          Back to homepage
        </Link>
      </div>

      <div className="relative z-10 px-6 pb-6 text-center sm:pb-8">
        <p className="font-body text-[11px] leading-relaxed text-ink-50">
          National Privacy Commission No. PIC-007-095-2026 | SEC Registration
          No. CS202006851
          <br />
          &copy; 2026 Mind You Mental Health Systems, Inc. | All Rights Reserved
        </p>
      </div>
    </div>
  );
}
