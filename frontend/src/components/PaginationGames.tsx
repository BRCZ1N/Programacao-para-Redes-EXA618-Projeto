import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

type Props = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
};

export function PaginationGames({ page, setPage, totalPages }: Props) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(Math.max(page - 1, 1))}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={page === pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(Math.min(page + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}