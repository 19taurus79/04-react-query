import { useState } from 'react';

import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import { Toaster } from 'react-hot-toast';
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
    setQuery(searchQuery);
  };
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    enabled: !!query, // Only run the query if query is not empty
    queryFn: () => fetchMovies({ query, page }),
    placeholderData: keepPreviousData, // Keep previous data while loading new data
  });
  // console.log('queryFilms', data);
  const totalPages = data?.total_pages ?? 0;
  // useEffect(() => {
  //   if (!query) {
  //     setMovies([]); // Убедитесь, что фильмы сброшены, если запрос пустой
  //     setIsLoading(false); // Лоадер должен быть выключен, если нет запроса
  //     setIsError(false); // Ошибка сброшена
  //     return; // Skip fetching if no query is provided
  //   }
  //   setMovies([]); // Reset movies state on new search
  //   setIsLoading(true); // Set loading state
  //   setIsError(false); // Reset error state
  //   fetchMovies({ query })
  //     .then((response) => {
  //       if (response.results.length === 0) {
  //         toast.error('No movies found for your request.');
  //         return;
  //       } else {
  //         setMovies(response.results);
  //       }

  //       setIsLoading(false); // Reset loading state
  //     })
  //     .catch((error) => {
  //       setIsError(true); // Set error state
  //       console.error('Error fetching movies:', error);
  //     })
  //     .finally(() => {
  //       setIsLoading(false); // Ensure loading state is reset even on error
  //     });
  // }, [query]);

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
      <MovieGrid movies={data?.results || []} onSelect={openModal} />
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
