import React, { useState, useEffect } from 'react';

const BookSelector = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchChapterImage(currentChapter, currentPage);
  }, [currentChapter, currentPage]);

//books data ko fetch krne ke liye

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://18.177.140.79:8080/books/');
      const data = await response.json();//sara data data mein store ho gya 
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchBookDetails = async (bookId) => {
    try {
      const response = await fetch(`http://18.177.140.79:8080/books/${bookId}/`);
      const data = await response.json();
      setSelectedBook(data.id);//api ke andar id array hai 
      setChapters(data.chapter_ids || []);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  const fetchChapterDetails = async (chapterId) => {
    try {
      const response = await fetch(`http://18.177.140.79:8080/chapters/${chapterId}/`);
      const data = await response.json();
      setSelectedChapter(data);
      setCurrentPage(0); // current page ko first page par set krr dega
    } catch (error) {
      console.error('Error fetching chapter details:', error);
    }
  };

  const fetchChapterImage = async (chapterId, page) => {
    try {
      const response = await fetch(`http://18.177.140.79:8080/chapters/${chapterId}/`);
      const data = await response.json();
      const image = data.pages[page].image.file;
      
      setImageURL(image);
    } catch (error) {
      console.error('Error fetching chapter image:', error);
    }
  };

  const handleBookClick = (book) => {
    fetchBookDetails(book.id);
  };

  // const handleChapterClick = (chapter) => {
  //   fetchChapterDetails(chapter);
  // };

  const handleChapterClick = (chapter) => {
    fetchChapterDetails(chapter);
    setCurrentChapter(chapter);
    setCurrentPage(0); // Reset current page to the first page of the chapter
  };

  
  const handleNextPage = () => {
    if (currentPage === selectedChapter.pages.length - 1) {
      // Last page current chapter ka 
      if (currentChapter < chapters.length) {
        // Move to the next chapter
        setCurrentChapter(currentChapter + 1);
      }
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage === 0) {
      // First page of the current chapter
      const previousChapter = currentChapter - 1;
      if (previousChapter >= 1) {
        // Move to the previous chapter's last page
        setCurrentChapter(previousChapter);
        setCurrentPage(chapters[previousChapter - 1].pages.length - 1);
      }
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {books.map((book) => (
          <button key={book.id} onClick={() => handleBookClick(book)}>
            {book.title}
          </button>
        ))}
      </div>

      {selectedBook && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {chapters.map((chapter) => (
            <button key={chapter} onClick={() => handleChapterClick(chapter)}>
              {chapter}
            </button>
          ))}
        </div>
      )}

      {selectedChapter && (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={imageURL}
              alt="Chapter Image"
              onClick={handleNextPage}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={handlePreviousPage}>Previous</button>
            <button onClick={handleNextPage}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSelector;
