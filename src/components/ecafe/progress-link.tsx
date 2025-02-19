"use client";
import { useProgressBar } from "@/hooks/use-progress-bar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";
import { useSidebar } from "../ui/sidebar";

const ProgressLink = ({ href, children, className, ...rest }:{href: string, children?: React.ReactNode; className?: string, }) => {
  const {push} = useRouter();
  const progress = useProgressBar();

  const navigateToDestination = (e) => {
    const el = document.getElementById("ecafe_sidebar");
    if (el) {
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    }

    e.preventDefault();
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
      });
  };

  return (
    <Link prefetch={true} href="" onClick={navigateToDestination} {...rest} className={className}>
      {children}
    </Link>
  );
};

export default ProgressLink;
