import Link from "next/link";
import Image from "next/image";

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
      </div>
    </header>
  );
};
