import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { fetchChapterImagesByNumber } from '../../../services/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from '../../../styles/Chapter.module.css';
import { AuthContext } from '../../../context/AuthContext';

const Chapter = () => {
  const router = useRouter();
  const { id, chapterNumber } = router.query;
  const [images, setImages] = useState([]);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const [showNextChapterMessage, setShowNextChapterMessage] = useState(false);
  const [numericChapterNumber, setNumericChapterNumber] = useState([]);
  const [alertShown, setAlertShown] = useState(false);  // Alert'in gösterilip gösterilmediğini takip eden durum
  const { isAuthenticated } = useContext(AuthContext);  // AuthContext'i kullan

  useEffect(() => {
    const getChapterImages = async () => {
      if (!router.isReady) return;

      const numericId = router.query.id;
      const numericChapterNumber = chapterNumber && chapterNumber.split('-')[1];
      setNumericChapterNumber(numericChapterNumber);
      console.log('Fetching images for mangaId:', numericId, 'chapterNumber:', numericChapterNumber);

      if (!numericId || !numericChapterNumber) return;

      try {
        const data = await fetchChapterImagesByNumber(numericId, numericChapterNumber);
        console.log('Fetched images:', data);
        setImages(data);
        window.scrollTo(0, 0);  // Sayfa yüklendiğinde en üste kaydırma
      } catch (error) {
        console.error("Bölüm resimleri getirilirken bir hata oluştu!", error);
      }
    };

    getChapterImages();
  }, [router.isReady, id, chapterNumber]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !showNextChapterMessage) {
        window.scrollBy(0, 50);  // Sayfayı biraz daha aşağı kaydır
        setShowNextChapterMessage(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapterNumber, showNextChapterMessage]);

  useEffect(() => {
    if (showNextChapterMessage) {
      const timer = setTimeout(() => {
        handleNextChapter();
      }, 1000);  // 1 saniye sonra sonraki bölüme geç

      return () => clearTimeout(timer);
    }
  }, [showNextChapterMessage]);

  const handleNextChapter = () => {
    setShowNextChapterMessage(false);
    router.push(`/manga/${router.query.id}/bolum-${parseInt(numericChapterNumber, 10) + 1}`);
    window.scrollTo(0, 0);  // Sonraki bölüme geçildiğinde en üste kaydırma
  };

  const handlePreviousChapter = () => {
    if (parseInt(chapterNumber, 10) > 1) {
      router.push(`/manga/${router.query.id}/bolum-${parseInt(numericChapterNumber, 10) - 1}`);
      window.scrollTo(0, 0);  // Önceki bölüme geçildiğinde en üste kaydırma
    }
  };

  const toggleNavButtons = () => {
    setShowNavButtons(!showNavButtons);
  };

  return (
    <>
      <Head>
        <title>{`Bölüm ${chapterNumber} - Manga ${id}`}</title>
        <meta name="description" content={`Manga ${id}'nin ${chapterNumber}. bölümünü okuyun.`} />
        <meta property="og:title" content={`Bölüm ${chapterNumber} - Manga ${id}`} />
        <meta property="og:description" content={`Manga ${id}'nin ${chapterNumber}. bölümünü okuyun.`} />
        <meta property="og:type" content="article" />
      </Head>
      <div className={styles['chapter-container']} onClick={toggleNavButtons}>
        {!isAuthenticated && !alertShown && (
          <div className={styles['alert-box']}>
            Görüntülemek için giriş yapmanız gerekmektedir.
          </div>
        )}
        <div className={styles['chapter-images']}>
          {isAuthenticated ? (
            images.map((image, index) => (
              <LazyLoadImage
                key={index}
                src={image}
                alt={`Sayfa ${index + 1}`}
                className={styles['chapter-image']}
                effect="blur"
              />
            ))
          ) : (
            !alertShown && setAlertShown(true)
          )}
        </div>
        {showNavButtons && (
          <div className={styles['navigation-buttons']}>
            <button onClick={handlePreviousChapter} className={styles['nav-button']}>&lt;</button>
            <button onClick={handleNextChapter} className={styles['nav-button']}>&gt;</button>
          </div>
        )}
        {showNextChapterMessage && (
          <div className={styles['next-chapter-message']}>
            Sonraki bölüme geçiliyor...
          </div>
        )}
      </div>
    </>
  );
};

export default Chapter;