import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MangaList from '../components/MangaList';
import { fetchMangas, fetchLatestChapters } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import styles from '../styles/Homepage.module.css';

const Homepage = ({ mangas = [], latestChapters = [] }) => {
  const router = useRouter();

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr });
  };

  const handleChapterClick = (mangaId, chapterNumber) => {
    router.push(`/manga/${mangaId}/bolum-${chapterNumber}`);
  };

  const bannerImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW3PubwMgrxvZHZBcbyokypBILrMmfpP5nqQ&s"; // Define your image URL here

  console.log(latestChapters);
  return (
    <>
      <Head>
        <title>Popüler Seriler ve Son Yayımlanan Mangalar | Manga Site</title>
        <meta name="description" content="Popüler seriler ve son yayımlanan manga bölümlerini keşfedin. En yeni mangaları ve bölümleri takip edin." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.home}>
        <div className={`${styles.banner} hero-light-items set-bg`} style={{ backgroundImage: `url(${bannerImageUrl})` }}>
          <h2>Popüler Seriler</h2>
          <div className="popular-series">
            <div className={styles['series-info']}>
              <h3>Sas Stopwatch</h3>
              <p>Merhaba, ezik Joo. baktın? Sıradan </p>
              <button>Seri Sayfası</button>
            </div>
          </div>
        </div>
            
        <h2>Son Yayımlanan Bölümler</h2>
        <div className={styles['latest-chapters']}>
          {latestChapters.length > 0 ? (
            latestChapters.map(chapter => (
              <div key={chapter.id} className={styles['chapter-item']} onClick={() => handleChapterClick(chapter.manga_slug, chapter.chapter_number)}>
                <div className={styles['chapter-info']}>
                  <h3>{chapter.manga_title}</h3>
                  <h4>Bölüm {chapter.chapter_number}</h4>
                </div>
              </div>
            ))
          ) : (
            <p>Henüz yayımlanan bölüm yok.</p>
          )}
        </div>

        <h2>Son Yayımlanan Mangalar</h2>
        <MangaList mangas={mangas} />
      </div>
    </>
  );
};

export const getStaticProps = async () => {
  try {
    const mangas = await fetchMangas();
    const latestChapters = await fetchLatestChapters();

    return {
      props: {
        mangas: mangas || [],
        latestChapters: latestChapters || []
      },
      revalidate: 1, 
    };
  } catch (error) {
    
    return {
      props: {
        mangas: [],
        latestChapters: []
      }
    };
  }
};

export default Homepage;