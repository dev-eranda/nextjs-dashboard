import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main>
      <Suspense fallback={<FormSkeleton />}>
        <EditInvoice params={params} />
      </Suspense>
    </main>
  );
}

async function EditInvoice({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </>
  );
}

function FormSkeleton() {
  return <div className="h-96 animate-pulse rounded-md bg-gray-50" />;
}
