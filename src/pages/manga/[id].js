import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchMangaBySlug,fetchChaptersByMangaSlug,fetchMangaById, fetchChaptersByMangaId, fetchComments, createComment, fetchMangas } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Button, Form } from 'react-bootstrap';
import { FaSortAmountDown, FaSortAmountUp, FaEye, FaHeart } from 'react-icons/fa';
import styles from '../../styles/Manga.module.css';


const Manga = ({ mangaData, chaptersData, commentsData }) => {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [ ids,setIds ] = useState([]);
  const { user } = useContext(AuthContext);
  const [manga, setManga] = useState(mangaData);
  const [chapters, setChapters] = useState(chaptersData);
  const [comments, setComments] = useState(commentsData);
  const [newComment, setNewComment] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const getIds = async () => {
      try {
        const data = await fetchMangaBySlug(router.query.id);
        setIds(data);
        if (data && data.length > 0) {
          setId(data.id);
        }
      } catch (error) {
        console.error("Failed to fetch mangas", error);
      }
    };
    getIds();
    

  }, []);


  const handleChapterClick = (chapterNumber) => {
    router.push(`/manga/${router.query.id}/bolum-${chapterNumber}`);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const sortedChapters = [...chapters].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return a.chapter_number - b.chapter_number;
      } else {
        return b.chapter_number - a.chapter_number;
      }
    });
    setSortOrder(newSortOrder);
    setChapters(sortedChapters);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    if (!user) {
      alert("Yorum yapabilmek için giriş yapmalısınız.");
      router.push('/login');
      return;
    }
  
    const commentData = {
      user_id: user.id,
      manga_slug: router.query.id,
      username: user.username,
      text: newComment,
    };
  
    try {
      const createdComment = await createComment(commentData);
      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment', error);
      alert('Failed to create comment. Please try again later.');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('tr-TR', { timeZone: 'UTC' });
  };

  if (!manga) return <div>Loading...</div>;

  return (
    <div className={styles['manga-detail-container']}>
      <div className={styles['manga-header']}>
        <img src={manga.cover_image} alt={manga.title} className={styles['manga-cover']} />
        <div className={styles['manga-info']}>
          <h1>{manga.title}</h1>
          <p>{manga.description}</p>
          <ul className={styles['manga-details']}>
            <li><strong>Yazar:</strong> {manga.author}</li>
            <li><strong>Çizer:</strong> {manga.artist || 'Unknown'}</li>
            <li><strong>Dil:</strong> {manga.language || 'Unknown'}</li>
            <li><strong>Tür:</strong> {manga.genre || 'Unknown'}</li>
            <li><strong>Durum:</strong> {manga.status || 'Unknown'}</li>
            <li><strong>Yayıncı:</strong> {manga.publisher || 'Unknown'}</li>
            <li><strong>Çıkış Yılı:</strong> {manga.year || 'Unknown'}</li>
            <li><strong>Puan:</strong> {manga.rating || 'Unknown'}</li>
            <li><strong>Okunma:</strong> {manga.read_count}</li>
            <li><strong>Kategoriler:</strong> {manga.categories ? manga.categories.map(category => category.name).join(', ') : 'N/A'}</li>
          </ul>
          <div className={styles['manga-buttons']}>
            <Button><FaHeart className="icon" /> Takip Et</Button>
            <Button><FaEye className="icon" /> Devam Et</Button>
          </div>
        </div>
      </div>
      <div className={styles['manga-chapters']}>
        <h2>
          Chapters
          <Button className={styles['sort-button']} onClick={handleSort}>
            {sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
          </Button>
        </h2>
        <div className={styles['chapters-list']}>
          {chapters.map((chapter) => (
            <div 
              key={chapter.id} 
              className={styles['chapter-item']} 
              onClick={() => handleChapterClick(chapter.chapter_number)}
            >
              <h3>{chapter.title}</h3>
              <p>Chapter Number: {chapter.chapter_number}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles['manga-comments']}>
        <h2>Comments</h2>
        <div className={styles['comments-list']}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles['comment-item']}>
              <p><strong>{comment.username}:</strong> {comment.text}</p>
              <small>{formatDate(comment.created_at)}</small>
            </div>
          ))}
        </div>
        <Form onSubmit={handleCommentSubmit} className={styles['add-comment']}>
          <Form.Group controlId="commentText">
            <Form.Label>Add a comment:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Write your comment here..."
            />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const mangas = await fetchMangas();

  const paths = mangas.map((manga) => ({
    params: { id: manga.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  console.log(id);
  try {
    const [mangaData, chaptersData, commentsData] = await Promise.all([
      fetchMangaBySlug(id),
      fetchChaptersByMangaSlug(id),
      fetchComments(id)
    ]);

    return {
      props: {
        mangaData,
        chaptersData,
        commentsData
      },
      revalidate: 60, // Her 1 saatte bir sayfayı yeniden oluştur
    };
  } catch (error) {
    console.error(`Failed to fetch data for manga with id ${id}`, error);
    return {
      notFound: true,
    };
  }
};

export default Manga;