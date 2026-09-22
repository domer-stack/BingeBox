/* Seriesboxd — core app logic & localStorage state */

const STORAGE_KEY = 'seriesboxd_user';

const defaultUser = {
  username: 'guest',
  displayName: 'Guest User',
  avatar: 'https://i.pravatar.cc/150?u=guest',
  bio: 'Sign in to start tracking your TV journey.',
  watchlist: [],
  watched: [],
  ratings: {},
  reviews: {},
  diary: [],
  signedIn: false
};

function getUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { ...defaultUser };
  } catch {
    return { ...defaultUser };
  }
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function signIn(username, displayName) {
  const user = getUser();
  user.username = username || 'user';
  user.displayName = displayName || username || 'Seriesboxd User';
  user.avatar = `https://i.pravatar.cc/150?u=${user.username}`;
  user.bio = 'TV lover. Tracking every show I watch.';
  user.signedIn = true;
  saveUser(user);
  return user;
}

function signOut() {
  localStorage.removeItem(STORAGE_KEY);
}

function toggleWatchlist(showId) {
  const user = getUser();
  const id = Number(showId);
  const idx = user.watchlist.indexOf(id);
  if (idx >= 0) {
    user.watchlist.splice(idx, 1);
    saveUser(user);
    showToast('Removed from watchlist');
    return false;
  }
  user.watchlist.push(id);
  saveUser(user);
  showToast('Added to watchlist');
  return true;
}

function markWatched(showId, rating = null) {
  const user = getUser();
  const id = Number(showId);
  if (!user.watched.includes(id)) {
    user.watched.push(id);
    user.diary.unshift({
      showId: id,
      date: new Date().toISOString().split('T')[0],
      rating: rating
    });
    const wlIdx = user.watchlist.indexOf(id);
    if (wlIdx >= 0) user.watchlist.splice(wlIdx, 1);
  }
  if (rating !== null) user.ratings[id] = rating;
  saveUser(user);
  showToast('Marked as watched');
}

function rateShow(showId, rating) {
  const user = getUser();
  user.ratings[Number(showId)] = rating;
  saveUser(user);
}

function addReview(showId, text, rating) {
  const user = getUser();
  const id = Number(showId);
  user.reviews[id] = { text, rating, date: new Date().toISOString().split('T')[0] };
  if (rating) user.ratings[id] = rating;
  markWatched(id, rating);
  saveUser(user);
  showToast('Review published');
}

function isInWatchlist(showId) {
  return getUser().watchlist.includes(Number(showId));
}

function isWatched(showId) {
  return getUser().watched.includes(Number(showId));
}

function getUserRating(showId) {
  return getUser().ratings[Number(showId)] || null;
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function initHeader(activePage = '') {
  const user = getUser();
  const header = document.querySelector('.site-header');
  if (!header) return;

  const navLinks = [
    { href: 'index.html', label: 'Home', id: 'home' },
    { href: 'browse.html', label: 'Shows', id: 'browse' },
    { href: 'lists.html', label: 'Lists', id: 'lists' },
    { href: 'diary.html', label: 'Diary', id: 'diary' },
    { href: 'profile.html', label: 'Profile', id: 'profile' }
  ];

  header.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="logo">
        <span class="logo-icon">▶</span>
        Seriesboxd
      </a>
      <nav class="main-nav">
        ${navLinks.map(l => `<a href="${l.href}" class="${activePage === l.id ? 'active' : ''}">${l.label}</a>`).join('')}
      </nav>
      <div class="header-search">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"/></svg>
        <input type="search" id="global-search" placeholder="Search shows, lists, members..." autocomplete="off">
      </div>
      <div class="header-actions">
        ${user.signedIn
          ? `<a href="profile.html" class="btn btn-ghost"><img src="${user.avatar}" alt="" style="width:32px;height:32px;border-radius:50%"></a>`
          : `<button class="btn btn-secondary" id="sign-in-btn">Sign In</button>
             <button class="btn btn-primary" id="sign-up-btn">Create Account</button>`
        }
      </div>
    </div>
  `;

  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        window.location.href = `browse.html?q=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }

  document.getElementById('sign-in-btn')?.addEventListener('click', openAuthModal);
  document.getElementById('sign-up-btn')?.addEventListener('click', openAuthModal);
}

function openAuthModal() {
  let overlay = document.querySelector('.modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h2>Welcome to Seriesboxd</h2>
        <p>Your life in TV. Track shows, write reviews, build lists.</p>
        <input type="text" id="auth-username" placeholder="Username" maxlength="20">
        <input type="text" id="auth-display" placeholder="Display name (optional)">
        <div class="modal-actions">
          <button class="btn btn-primary" id="auth-submit">Get Started — It's Free</button>
          <button class="btn btn-secondary" id="auth-cancel">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
    document.getElementById('auth-cancel')?.addEventListener('click', () => overlay.classList.remove('open'));
    document.getElementById('auth-submit')?.addEventListener('click', () => {
      const username = document.getElementById('auth-username').value.trim();
      const display = document.getElementById('auth-display').value.trim();
      if (!username) {
        showToast('Please enter a username');
        return;
      }
      signIn(username, display);
      overlay.classList.remove('open');
      location.reload();
    });
  }
  overlay.classList.add('open');
  document.getElementById('auth-username')?.focus();
}

function initFooter() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <strong>Seriesboxd</strong> — The social network for TV lovers.<br>
        Inspired by Letterboxd. Built for binge-watchers.
      </div>
      <div class="footer-links">
        <a href="browse.html">Browse Shows</a>
        <a href="lists.html">Lists</a>
        <a href="diary.html">Diary</a>
        <a href="profile.html">Profile</a>
      </div>
    </div>
  `;
}

function setupInteractiveStars(container, onRate) {
  const stars = container.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseFloat(star.dataset.value);
      onRate(value);
      container.innerHTML = renderStars(value, true);
      setupInteractiveStars(container, onRate);
    });
    star.addEventListener('mouseenter', () => {
      const hoverVal = parseFloat(star.dataset.value);
      stars.forEach(s => {
        const v = parseFloat(s.dataset.value);
        s.classList.toggle('empty', v > hoverVal);
      });
    });
  });
  container.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('empty'));
  });
}

function filterShows(query, genre, sort) {
  let results = [...SHOWS];
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.creator.toLowerCase().includes(q) ||
      s.genre.some(g => g.toLowerCase().includes(q))
    );
  }
  if (genre && genre !== 'all') {
    results = results.filter(s => s.genre.includes(genre));
  }
  switch (sort) {
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'reviews':
      results.sort((a, b) => b.reviews - a.reviews);
      break;
    case 'newest':
      results.sort((a, b) => b.year - a.year);
      break;
    case 'oldest':
      results.sort((a, b) => a.year - b.year);
      break;
    case 'title':
      results.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      results.sort((a, b) => b.reviews - a.reviews);
  }
  return results;
}

document.addEventListener('DOMContentLoaded', () => {
  initFooter();
});
