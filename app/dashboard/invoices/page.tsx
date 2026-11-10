import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchInvoicesPages } from "@/app/lib/data";
import { Metadata } from "next";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Invoices",
};

type SearchParams = Promise<{
  query?: string;
  page?: string;
}>;

export default function Page(props: { searchParams: SearchParams }) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<SearchFallback />}>
          <Search placeholder="Search invoices..." />
        </Suspense>
        <CreateInvoice />
      </div>

      <Suspense fallback={<InvoicesTableSkeleton />}>
        <InvoicesTable searchParams={props.searchParams} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Suspense>
          <InvoicesPagination searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function InvoicesTable({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = Number(params?.page) || 1;

  return <Table query={query} currentPage={currentPage} />;
}

async function InvoicesPagination({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const totalPages = await fetchInvoicesPages(query);

  return <Pagination totalPages={totalPages} />;
}

function SearchFallback() {
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <input
        disabled
        placeholder="Search invoices..."
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
    </div>
  );
}
