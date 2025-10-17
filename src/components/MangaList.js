import React from 'react';
import Link from 'next/link';
import styles from '../styles/MangaList.module.css';

const MangaList = ({ mangas }) => {
  return (
    <div className={styles['manga-list']}>
      {mangas.map(manga => (
        <div key={manga.slug} className={styles['manga-item']}>
          <Link href={`/manga/${manga.slug}`}>
            <img src={manga.cover_image} alt={manga.title} />
            <h2>{manga.title}</h2>
          </Link>
          <p>{manga.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MangaList;