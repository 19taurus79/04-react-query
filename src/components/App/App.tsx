import { useEffect, useState } from 'react';

import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  // const handlePageClick = () => {
  //   setPage(page + 1);
  // };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSearchSubmit = (searchQuery: string) => {
    setQuery(searchQuery); // Update the query state with the new search term
    setPage(1); // Reset to the first page on new search
  };
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    enabled: !!query, // Only run the query if query is not empty
    queryFn: () => fetchMovies({ query, page }),
    placeholderData: keepPreviousData, // Keep previous data while loading new data
  });

  const totalPages = data?.total_pages ?? 0;
  useEffect(() => {
    if (data?.results.length === 0 && isSuccess) {
      toast.error('No movies found for your request.');
    }
  }, [data, isSuccess]);

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearchSubmit} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {(data?.total_results ?? 0) > 0 && (
        <MovieGrid movies={data?.results || []} onSelect={openModal} />
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
