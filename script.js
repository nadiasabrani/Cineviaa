// Dynamic Favorites + Nav Smooth Scroll - Clean Version

document.addEventListener('DOMContentLoaded', function() {
  // Extract movies
  const mainCardsSelector = '.card:not(#favorites-list .card)';
  const mainCards = document.querySelectorAll(mainCardsSelector);
  const movies = [];

  mainCards.forEach(card => {
    const title = card.querySelector('h3').textContent.trim();
    const rating = card.querySelector('span').textContent.trim();
    const imgSrc = card.querySelector('img').src;
    const heart = card.querySelector('.heart');
    movies.push({ id: title, title, rating, imgSrc, heart });
  });

  // Favorites persistence
  let favorites = new Set(JSON.parse(localStorage.getItem('cineviaFavorites') || '[]'));

  // Update hearts
  movies.forEach(movie => {
    if (favorites.has(movie.id)) {
      movie.heart.classList.add('active');
      movie.heart.style.color = '#ff4757';
      movie.heart.style.opacity = '1';
    }
  });

  // Populate favorites
  function populateFavorites() {
    const favList = document.getElementById('favorites-list');
    favList.innerHTML = favorites.size === 0 ? '<p style="text-align: center; color: #aaa; padding: 40px;">Aucun film en favoris. Ajoutez-en en cliquant sur ❤️ !</p>' : '';
    movies.filter(movie => favorites.has(movie.id)).forEach(movie => {
      const cardClone = movie.heart.closest('.card').cloneNode(true);
      const cloneHeart = cardClone.querySelector('.heart');
      cloneHeart.classList.add('active');
      cloneHeart.style.color = '#ff4757';
      cloneHeart.style.opacity = '1';
      cloneHeart.style.pointerEvents = 'none';
      cardClone.onclick = (e) => {
        if (e.target.classList.contains('heart')) return;
        showMovieModal(movie.title, movie.rating, movie.imgSrc);
      };
      favList.appendChild(cardClone);
    });
  }

  // Heart toggle
  document.addEventListener('click', e => {
    if (e.target.classList.contains('heart') && !e.target.closest('#favorites-list')) {
      e.stopPropagation();
      const heart = e.target;
      const card = heart.closest('.card');
      const title = card.querySelector('h3').textContent.trim();
      if (heart.classList.contains('active')) {
        heart.classList.remove('active');
        heart.style.color = 'white';
        heart.style.opacity = '0.7';
        favorites.delete(title);
      } else {
        heart.classList.add('active');
        heart.style.color = '#ff4757';
        heart.style.opacity = '1';
        favorites.add(title);
      }
      localStorage.setItem('cineviaFavorites', JSON.stringify(Array.from(favorites)));
      populateFavorites();
    }
  });

  populateFavorites();

  // Search - prefix match
  document.querySelector('.right input').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll(mainCardsSelector).forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = title.startsWith(query) ? 'block' : 'none';
    });
  });

  // Nav smooth scroll
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.href.split('#')[1];
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Modal
  document.addEventListener('click', e => {
    if (e.target.closest('.card') && !e.target.classList.contains('heart')) {
      const card = e.target.closest('.card');
      showMovieModal(card.querySelector('h3').textContent, card.querySelector('span').textContent, card.querySelector('img').src);
    }
  });

  function showMovieModal(title, rating, imgSrc) {
    const modal = document.createElement('div');
    modal.className = 'movie-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <img src="${imgSrc}" alt="${title}">
        <h2>${title}</h2>
        <p>Rating: ${rating}</p>
        <p>Description: A thrilling cinematic experience.</p>
        <button onclick="window.open('https://www.youtube.com/results?search_query=${encodeURIComponent(title)}+official+trailer', '_blank')">Watch Trailer</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
  }
});
