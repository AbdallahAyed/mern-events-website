"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export default function Search({
  placeholder = "Search title...",
}: {
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (query) {
        const { url, query: newQuery } = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });

        newUrl = `${url}?${newQuery}`; // Combine url and query into a single string
      } else {
        const { url, query } = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });

        newUrl = `${url}?${query}`; // Combine url and query into a single string
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
      <Image src="/icons/search.svg" alt="search" width={24} height={24} />
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        className="p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
