import React, { useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const [displayedPages, setDisplayedPages] = useState<number[]>([])

  React.useEffect(() => {
    const pages: number[] = []
    const totalDisplayedPages = 5

    let startPage = currentPage - Math.floor(totalDisplayedPages / 2)
    startPage = Math.max(startPage, 1)
    const maxStartPage = Math.max(1, totalPages - totalDisplayedPages + 1)
    startPage = Math.min(startPage, maxStartPage)

    for (let i = 0; i < totalDisplayedPages && startPage + i <= totalPages; i++) {
      pages.push(startPage + i)
    }

    setDisplayedPages(pages)
  }, [currentPage, totalPages])

  const firstPage = 1
  const lastPage = totalPages

  return (
    <Flex mt={4} direction="column" alignItems="center">
      <Flex>
        <Button onClick={() => onPageChange(firstPage)} disabled={currentPage === firstPage} mr={2}>
          &lt;&lt;
        </Button>
        <Button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === firstPage}
          mr={2}>
          Anterior
        </Button>
        {displayedPages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            variant={currentPage === page ? 'solid' : 'outline'}
            colorScheme="green"
            mr={2}
          >
            {page}
          </Button>
        ))}
        {totalPages > 5 && (
          <>
            {currentPage <= totalPages - 3 && <Text>...</Text>}
            <Button onClick={() => onPageChange(lastPage)}>{lastPage}</Button>
          </>
        )}
        <Button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === lastPage}
          ml={2}>
          Próximo
        </Button>
        <Button onClick={() => onPageChange(lastPage)} disabled={currentPage === lastPage} ml={2}>
          &gt;&gt;
        </Button>
      </Flex>  
    </Flex>
  )
}

export default Pagination
