import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  query: Record<string, string>;
};

export default function HistoryPagination({ page, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  function pageHref(nextPage: number) {
    const params = new URLSearchParams(query);
    if (nextPage === 1) params.delete("page");
    else params.set("page", String(nextPage));
    const queryString = params.toString();
    return queryString ? `/memories?${queryString}` : "/memories";
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((number) =>
      number === 1 || number === totalPages || Math.abs(number - page) <= 1,
    );

  const linkClass = "inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-[#D5DDD5] px-3 text-sm text-jar-charcoal hover:bg-jar-sage-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jar-sage";

  return (
    <nav aria-label="Memories pagination" className="flex flex-wrap items-center justify-center gap-2 py-4">
      {page > 1 ? (
        <Link href={pageHref(page - 1)} className={linkClass} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className={`${linkClass} cursor-not-allowed opacity-40`} aria-hidden="true"><ChevronLeft className="h-4 w-4" /></span>
      )}
      {pages.map((number, index) => (
        <span key={number} className="flex items-center gap-2">
          {index > 0 && number - pages[index - 1] > 1 && <span aria-hidden="true" className="px-1 text-jar-gray">…</span>}
          <Link
            href={pageHref(number)}
            aria-label={`Page ${number}`}
            aria-current={page === number ? "page" : undefined}
            className={`${linkClass} ${page === number ? "border-jar-sage bg-jar-sage text-white hover:bg-jar-sage" : ""}`}
          >
            {number}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={pageHref(page + 1)} className={linkClass} aria-label="Next page">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className={`${linkClass} cursor-not-allowed opacity-40`} aria-hidden="true"><ChevronRight className="h-4 w-4" /></span>
      )}
    </nav>
  );
}
