import css from './MovieModal.module.css';
import type { Movie } from '../../types/movie';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}
export default function MovieModal({ movie, onClose }: MovieModalProps) {
  // Эффект для закрытия по клавише ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Отключаем скролл на фоне
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Включаем скролл обратно
    };
  }, [onClose]); // Зависимость от onClose

  // Обработка клика по бэкдропу для закрытия
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      // Проверяем, что клик был именно по бэкдропу, а не по модальному окну
      onClose();
    }
  };
  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong>{' '}
            {new Date(movie.release_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average} / 10
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
