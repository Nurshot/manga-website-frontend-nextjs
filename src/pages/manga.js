import React, { useState, useEffect } from 'react';
import { fetchMangas, fetchCategories } from '../services/api';
import MangaList from '../components/MangaList';
import { Button } from 'react-bootstrap';
import { FaSortNumericDown, FaSortNumericUp } from 'react-icons/fa';
import styles from '../styles/MangaListPage.module.css'; // CSS Modülleri

const MangaListPage = () => {
  const [mangas, setMangas] = useState([]);
  const [sortedMangas, setSortedMangas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState('contains');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const getMangas = async () => {
      try {
        const data = await fetchMangas();
        setMangas(data);
        setSortedMangas(data);
      } catch (error) {
        console.error("Failed to fetch mangas", error);
      }
    };

    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    getMangas();
    getCategories();
  }, []);

  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const sortedMangas = [...mangas].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return a.read_count - b.read_count;
      } else {
        return b.read_count - a.read_count;
      }
    });
    setSortOrder(newSortOrder);
    setSortedMangas(sortedMangas);
  };

  const filteredMangas = sortedMangas.filter(manga => {
    const matchesCategory = selectedCategory === '' || (manga.categories && manga.categories.some(cat => cat.id === parseInt(selectedCategory)));
    const matchesSearchTerm = searchMode === 'contains'
      ? manga.title.toLowerCase().includes(searchTerm.toLowerCase())
      : manga.title.toLowerCase().startsWith(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  return (
    <div className={styles['manga-list-page']}>
      <div className={styles['filter-container']}>
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          <option value="">Tüm Kategoriler</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="İsme göre ara..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <div className={styles['search-mode-container']}>
          <label>
            <input 
              type="radio" 
              value="contains" 
              checked={searchMode === 'contains'} 
              onChange={() => handleSearchModeChange('contains')} 
            />
            İçeriyor
          </label>
          <label>
            <input 
              type="radio" 
              value="startsWith" 
              checked={searchMode === 'startsWith'} 
              onChange={() => handleSearchModeChange('startsWith')} 
            />
            Başlıyor
          </label>
        </div>
        <Button onClick={handleSort} variant="secondary" className={styles['sort-button']}>
          {sortOrder === 'asc' ? <FaSortNumericDown /> : <FaSortNumericUp />} Popülerlik
        </Button>
      </div>
      <MangaList mangas={filteredMangas} />
    </div>
  );
};

export default MangaListPage;