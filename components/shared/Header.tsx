import Link from "next/link";
import Image from "next/image";
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image
            src="/images/logo.svg"
            width={128}
            height={38}
            alt="Evently Logo"
          />
        </Link>

        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};
