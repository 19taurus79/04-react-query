import axios from 'axios';
import type { Movie } from '../types/movie';
const token = import.meta.env.VITE_TOKEN;
axios.defaults.baseURL = 'https://api.themoviedb.org/3/search/movie';
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
interface fetchMovieProps {
  query: string;
}
interface fetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
export const fetchMovies = async ({
  query,
}: fetchMovieProps): Promise<fetchMoviesResponse> => {
  const response = await axios.get<fetchMoviesResponse>('', {
    params: {
      query,
    },
  });
  //   console.log(response.data);
  return response.data;
};
