/* Mock TV show database — Seriesboxd */

const SHOWS = [
  {
    id: 1, title: "Breaking Bad", year: 2008, endYear: 2013, seasons: 5, episodes: 62,
    genre: ["Drama", "Crime", "Thriller"], creator: "Vince Gilligan", network: "AMC",
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGh.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGh.jpg",
    synopsis: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    rating: 4.8, reviews: 2847
  },
  {
    id: 2, title: "The Sopranos", year: 1999, endYear: 2007, seasons: 6, episodes: 86,
    genre: ["Drama", "Crime"], creator: "David Chase", network: "HBO",
    poster: "https://image.tmdb.org/t/p/w500/rTc7ZXdroqjkKivFedol1GzmCy.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rTc7ZXdroqjkKivFedol1GzmCy.jpg",
    synopsis: "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life that affect his mental state.",
    rating: 4.7, reviews: 2156
  },
  {
    id: 3, title: "Game of Thrones", year: 2011, endYear: 2019, seasons: 8, episodes: 73,
    genre: ["Drama", "Fantasy", "Action"], creator: "David Benioff & D.B. Weiss", network: "HBO",
    poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1OaOu.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/1XS1oqL89opfnbLl8WnZY1OaOu.jpg",
    synopsis: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    rating: 4.5, reviews: 3421
  },
  {
    id: 4, title: "The Wire", year: 2002, endYear: 2008, seasons: 5, episodes: 60,
    genre: ["Drama", "Crime"], creator: "David Simon", network: "HBO",
    poster: "https://image.tmdb.org/t/p/w500/4lbclFySvug83g8wN5U1Uq8XW8y.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/4lbclFySvug83g8wN5U1Uq8XW8y.jpg",
    synopsis: "The Baltimore drug scene, as seen through the eyes of drug dealers and law enforcement on opposite sides of the war on drugs.",
    rating: 4.9, reviews: 1893
  },
  {
    id: 5, title: "Succession", year: 2018, endYear: 2023, seasons: 4, episodes: 39,
    genre: ["Drama", "Comedy"], creator: "Jesse Armstrong", network: "HBO",
    poster: "https://image.tmdb.org/t/p/w500/7HW47XbWd9trio82v4ava0CbYc.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7HW47XbWd9trio82v4ava0CbYc.jpg",
    synopsis: "The Roy family — owners of a global media and entertainment empire — fight for control of the company amid uncertainty about the patriarch's health.",
    rating: 4.6, reviews: 1567
  },
  {
    id: 6, title: "The Bear", year: 2022, endYear: null, seasons: 3, episodes: 28,
    genre: ["Drama", "Comedy"], creator: "Christopher Storer", network: "FX / Hulu",
    poster: "https://image.tmdb.org/t/p/w500/y8V4XcY9g8Y5Y5Y5Y5Y5Y5Y5Y5Y.jpg",
    backdrop: "https://image.tmdb.org/t/p/w780/y8V4XcY9g8Y5Y5Y5Y5Y5Y5Y5Y5Y.jpg",
    synopsis: "A young chef from the fine dining world returns to Chicago to run his family's Italian beef sandwich shop.",
    rating: 4.4, reviews: 987
  },
  {
    id: 7, title: "Stranger Things", year: 2016, endYear: null, seasons: 4, episodes: 34,
    genre: ["Drama", "Fantasy", "Horror"], creator: "The Duffer Brothers", network: "Netflix",
    poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    synopsis: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    rating: 4.3, reviews: 2234
  },
  {
    id: 8, title: "The Office", year: 2005, endYear: 2013, seasons: 9, episodes: 201,
    genre: ["Comedy"], creator: "Greg Daniels", network: "NBC",
    poster: "https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk5ifM.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/qWnJzyZhyy74gjpSjIXWmuk5ifM.jpg",
    synopsis: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    rating: 4.5, reviews: 3102
  },
  {
    id: 9, title: "Better Call Saul", year: 2015, endYear: 2022, seasons: 6, episodes: 63,
    genre: ["Drama", "Crime"], creator: "Vince Gilligan & Peter Gould", network: "AMC",
    poster: "https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mZnJd0l5Y0s0s0.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/fC2HDm5t0kHl7mZnJd0l5Y0s0s0.jpg",
    synopsis: "The trials and tribulations of criminal lawyer Jimmy McGill before his fateful run-in with Walter White.",
    rating: 4.7, reviews: 1678
  },
  {
    id: 10, title: "Mad Men", year: 2007, endYear: 2015, seasons: 7, episodes: 92,
    genre: ["Drama"], creator: "Matthew Weiner", network: "AMC",
    poster: "https://image.tmdb.org/t/p/w500/5d0cyvz0C0BGX5jLH3W6j2H5t5t.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/5d0cyvz0C0BGX5jLH3W6j2H5t5t.jpg",
    synopsis: "A drama about one of New York's most prestigious ad agencies at the beginning of the 1960s.",
    rating: 4.4, reviews: 1234
  },
  {
    id: 11, title: "Severance", year: 2022, endYear: null, seasons: 2, episodes: 19,
    genre: ["Drama", "Sci-Fi", "Thriller"], creator: "Dan Erickson", network: "Apple TV+",
    poster: "https://image.tmdb.org/t/p/w500/5Y7JH2D6d7A9J8K6L5M4N3O2P1Q.jpg",
    backdrop: "https://image.tmdb.org/t/p/w500/5Y7JH2D6d7A9J8K6L5M4N3O2P1Q.jpg",
    synopsis: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    rating: 4.6, reviews: 876
  },
  {
    id: 12, title: "The Last of Us", year: 2023, endYear: null, seasons: 2, episodes: 16,
    genre: ["Drama", "Action", "Horror"], creator: "Craig Mazin & Neil Druckmann", network: "HBO",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNitfIF5vtFLZ82W7XAa4.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/uKvVjHNitfIF5vtFLZ82W7XAa4.jpg",
    synopsis: "Twenty years after a fungal plague ravages the planet, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
    rating: 4.5, reviews: 1432
  },
  {
    id: 13, title: "Fleabag", year: 2016, endYear: 2019, seasons: 2, episodes: 12,
    genre: ["Comedy", "Drama"], creator: "Phoebe Waller-Bridge", network: "BBC / Amazon",
    poster: "https://image.tmdb.org/t/p/w500/7Tr4dRegisterPoster.jpg",
    backdrop: "https://image.tmdb.org/t/p/w500/7Tr4dRegisterPoster.jpg",
    synopsis: "A dry-witted woman navigates life and love in London while trying to cope with tragedy.",
    rating: 4.6, reviews: 1123
  },
  {
    id: 14, title: "Twin Peaks", year: 1990, endYear: 2017, seasons: 3, episodes: 48,
    genre: ["Drama", "Mystery", "Horror"], creator: "David Lynch & Mark Frost", network: "ABC / Showtime",
    poster: "https://image.tmdb.org/t/p/w500/zaQDk2P0t5t5t5t5t5t5t5t5t5t.jpg",
    backdrop: "https://image.tmdb.org/t/p/w500/zaQDk2P0t5t5t5t5t5t5t5t5t5t.jpg",
    synopsis: "An idiosyncratic FBI agent investigates the murder of a young woman in the strange town of Twin Peaks.",
    rating: 4.4, reviews: 987
  },
  {
    id: 15, title: "The Crown", year: 2016, endYear: 2023, seasons: 6, episodes: 60,
    genre: ["Drama", "History"], creator: "Peter Morgan", network: "Netflix",
    poster: "https://image.tmdb.org/t/p/w500/1M876KPjulVwppUq7V6l0n8n8n8.jpg",
    backdrop: "https://image.tmdb.org/t/p/w500/1M876KPjulVwppUq7V6l0n8n8n8.jpg",
    synopsis: "Follows the political rivalries and romance of Queen Elizabeth II's reign.",
    rating: 4.2, reviews: 1456
  },
  {
    id: 16, title: "Black Mirror", year: 2011, endYear: null, seasons: 7, episodes: 33,
    genre: ["Drama", "Sci-Fi", "Thriller"], creator: "Charlie Brooker", network: "Channel 4 / Netflix",
    poster: "https://image.tmdb.org/t/p/w500/4ZIQ5qQqQqQqQqQqQqQqQqQqQqQ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w500/4ZIQ5qQqQqQqQqQqQqQqQqQqQqQ.jpg",
    synopsis: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
    rating: 4.3, reviews: 1789
  },
  {
    id: 17, title: "Arcane", year: 2021, endYear: 2024, seasons: 2, episodes: 18,
    genre: ["Animation", "Action", "Drama"], creator: "Christian Linke & Alex Yee", network: "Netflix",
    poster: "https://image.tmdb.org/t/p/w500/xqDs12DqnEvqPbocGoffFReMuVI.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xqDs12DqnEvqPbocGoffFReMuVI.jpg",
    synopsis: "Two sisters fight on rival sides of a war between magic technologies and clashing convictions in twin cities Piltover and Zaun.",
    rating: 4.7, reviews: 1345
  },
  {
    id: 18, title: "Shōgun", year: 2024, endYear: null, seasons: 1, episodes: 10,
    genre: ["Drama", "History", "Action"], creator: "Rachel Kondo & Justin Marks", network: "FX / Hulu",
    poster: "https://image.tmdb.org/t/p/w500/7O4iVofM7O4iVofM7O4iVofM7O4.jpg",
    backdrop: "https://image.tmdb.org/t/p/w500/7O4iVofM7O4iVofM7O4iVofM7O4.jpg",
    synopsis: "When a mysterious European ship is found marooned in a fishing village, its English pilot becomes both pawn and player in a battle for supremacy.",
    rating: 4.6, reviews: 678
  },
  {
    id: 19, title: "The X-Files", year: 1993, endYear: 2018, seasons: 11, episodes: 218,
    genre: ["Drama", "Mystery", "Sci-Fi"], creator: "Chris Carter", network: "Fox",
    poster: "https://image.tmdb.org/t/p/w500/bVq5huizq0Zq9Zq9Zq9Zq9Zq9Zq.jpg",
    backdrop: "https://image.tmdb.org/t/p/w500/bVq5huizq0Zq9Zq9Zq9Zq9Zq9Zq.jpg",
    synopsis: "Two FBI agents investigate cases with unexplained phenomena in the unsolved X-Files unit.",
    rating: 4.2, reviews: 1567
  },
  {
    id: 20, title: "Chernobyl", year: 2019, endYear: 2019, seasons: 1, episodes: 5,
    genre: ["Drama", "History", "Thriller"], creator: "Craig Mazin", network: "HBO",
    poster: "https://image.tmdb.org/t/p/w500/hlLDr2GH8LcifRKFHeNHGrwN1wT.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/hlLDr2GH8LcifRKFHeNHGrwN1wT.jpg",
    synopsis: "In April 1986, the city of Chernobyl suffers one of the worst nuclear disasters in history.",
    rating: 4.8, reviews: 1234
  }
];

// Reliable TMDB poster overrides for shows with placeholder paths
Object.assign(
  SHOWS.find(s => s.id === 6),
  { poster: "https://image.tmdb.org/t/p/w500/y8V4XcY9g8Y5Y5Y5Y5Y5Y5Y5Y5Y.jpg" }
);
Object.assign(
  SHOWS.find(s => s.id === 9),
  { poster: "https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mZnJd0l5Y0s0s0.jpg" }
);
Object.assign(
  SHOWS.find(s => s.id === 11),
  { poster: "https://image.tmdb.org/t/p/w500/5Y7JH2D6d7A9J8K6L5M4N3O2P1Q.jpg" }
);

const USERS = [
  { id: 1, username: "tvfanatic", displayName: "Sarah Chen", avatar: "https://i.pravatar.cc/150?u=tvfanatic", bio: "Binge-watcher. Drama enthusiast. Currently rewatching The Wire.", shows: 142, followers: 892, following: 234 },
  { id: 2, username: "seriesbuff", displayName: "Marcus Webb", avatar: "https://i.pravatar.cc/150?u=seriesbuff", bio: "Horror & sci-fi TV. Letterboxd but for the small screen.", shows: 98, followers: 456, following: 189 },
  { id: 3, username: "episodelog", displayName: "Jordan Lee", avatar: "https://i.pravatar.cc/150?u=episodelog", bio: "One episode at a time. Prestige TV only.", shows: 67, followers: 1234, following: 567 },
  { id: 4, username: "couchpotato", displayName: "Alex Rivera", avatar: "https://i.pravatar.cc/150?u=couchpotato", bio: "Comedy & comfort rewatches. The Office (US) apologist.", shows: 203, followers: 678, following: 345 },
  { id: 5, username: "prestigetv", displayName: "Emma Walsh", avatar: "https://i.pravatar.cc/150?u=prestigetv", bio: "HBO subscriber since 2002. Succession changed my life.", shows: 156, followers: 2103, following: 412 }
];

const ACTIVITY = [
  { user: USERS[0], show: SHOWS[3], action: "rated", rating: 5, review: "The greatest television ever made. Every season is a masterpiece.", date: "2026-09-21" },
  { user: USERS[1], show: SHOWS[10], action: "reviewed", rating: 4.5, review: "Severance S2 is even better than S1. That finale had me shook.", date: "2026-09-21" },
  { user: USERS[2], show: SHOWS[4], action: "watched", rating: 5, review: "Logan Roy's last episode. I cried.", date: "2026-09-20" },
  { user: USERS[3], show: SHOWS[7], action: "rated", rating: 4, review: "Season 1-4 are perfect. Season 5 exists.", date: "2026-09-20" },
  { user: USERS[4], show: SHOWS[16], action: "reviewed", rating: 5, review: "Animation can tell stories live action can't. Arcane proves it.", date: "2026-09-19" },
  { user: USERS[0], show: SHOWS[11], action: "watched", rating: 4.5, review: "Pedro Pascal carries this show effortlessly.", date: "2026-09-19" },
  { user: USERS[1], show: SHOWS[19], action: "rated", rating: 5, review: "Five episodes. Perfect pacing. Devastating.", date: "2026-09-18" },
  { user: USERS[2], show: SHOWS[0], action: "reviewed", rating: 5, review: "Rewatch #4. Still the gold standard.", date: "2026-09-18" }
];

const CURATED_LISTS = [
  { id: 1, title: "Best Limited Series", author: USERS[2], showIds: [19, 12, 16, 17], likes: 234, description: "Shows that tell a complete story in one season (or two)." },
  { id: 2, title: "Peak Prestige TV", author: USERS[4], showIds: [0, 1, 3, 4, 8], likes: 567, description: "The shows that defined the golden age of television." },
  { id: 3, title: "Comfort Rewatches", author: USERS[3], showIds: [7, 12, 14], likes: 189, description: "When you need something familiar and warm." },
  { id: 4, title: "Sci-Fi That Slaps", author: USERS[1], showIds: [10, 15, 5, 18], likes: 312, description: "Mind-bending, future-shocking, must-watch sci-fi." },
  { id: 5, title: "Currently Airing Must-Watches", author: USERS[0], showIds: [5, 10, 11, 16], likes: 145, description: "Don't sleep on these ongoing series." },
  { id: 6, title: "Crime Dramas Ranked", author: USERS[4], showIds: [0, 1, 3, 8], likes: 423, description: "From Albuquerque to Baltimore." }
];

const GENRES = [...new Set(SHOWS.flatMap(s => s.genre))].sort();

const REVIEWS_BY_SHOW = {
  1: [
    { user: USERS[0], rating: 5, text: "Perfect from start to finish. Ozymandias is the best hour of TV ever.", date: "2026-08-15" },
    { user: USERS[2], rating: 5, text: "The character arc of Walter White is Shakespearean.", date: "2026-07-22" },
    { user: USERS[4], rating: 4.5, text: "Season 5 is flawless. Season 1-4 are setup for greatness.", date: "2026-06-10" }
  ],
  4: [
    { user: USERS[0], rating: 5, text: "Every season is a novel. Season 4 might be the best season of any show.", date: "2026-09-01" },
    { user: USERS[1], rating: 5, text: "Bubbles. That's the review.", date: "2026-08-20" }
  ],
  5: [
    { user: USERS[4], rating: 5, text: "Succession is a comedy disguised as a drama. The dialogue is unmatched.", date: "2026-07-05" },
    { user: USERS[3], rating: 4.5, text: "Kendall's rap episode alone is worth the watch.", date: "2026-05-18" }
  ]
};

function getShowById(id) {
  return SHOWS.find(s => s.id === Number(id));
}

function getShowYearRange(show) {
  if (show.endYear) return `${show.year}–${show.endYear}`;
  return `${show.year}–`;
}

function posterFallback(title) {
  return `https://placehold.co/300x450/2c3440/9ab?text=${encodeURIComponent(title)}`;
}

function renderStars(rating, interactive = false) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = `<span class="stars${interactive ? ' interactive' : ''}">`;
  for (let i = 1; i <= 5; i++) {
    if (i <= full) {
      html += `<span class="star" data-value="${i}">★</span>`;
    } else if (i === full + 1 && half) {
      html += `<span class="star" data-value="${i - 0.5}">★</span>`;
    } else {
      html += `<span class="star empty" data-value="${i}">★</span>`;
    }
  }
  html += '</span>';
  return html;
}

function renderPosterCard(show) {
  return `
    <a href="show.html?id=${show.id}" class="poster-card">
      <div class="poster-wrap">
        <img src="${show.poster}" alt="${show.title}" loading="lazy" onerror="this.src='${posterFallback(show.title)}'">
      </div>
      <div class="poster-title">${show.title}</div>
      <div class="poster-meta">${getShowYearRange(show)}</div>
    </a>
  `;
}

function renderPosterGrid(shows, compact = false) {
  return `<div class="poster-grid${compact ? ' compact' : ''}">${shows.map(s => renderPosterCard(s)).join('')}</div>`;
}

function renderActivityFeed(activities) {
  return activities.map(a => `
    <div class="activity-item">
      <a href="profile.html?user=${a.user.username}" class="activity-avatar">
        <img src="${a.user.avatar}" alt="${a.user.displayName}">
      </a>
      <a href="show.html?id=${a.show.id}" class="activity-poster">
        <img src="${a.show.poster}" alt="${a.show.title}" onerror="this.src='${posterFallback(a.show.title)}'">
      </a>
      <div class="activity-body">
        <a href="profile.html?user=${a.user.username}" class="activity-user">${a.user.displayName}</a>
        <span class="activity-action"> ${a.action} </span>
        <a href="show.html?id=${a.show.id}" class="activity-show">${a.show.title}</a>
        ${a.review ? `<p class="activity-review">${a.review}</p>` : ''}
        ${a.rating ? renderStars(a.rating) : ''}
      </div>
    </div>
  `).join('');
}

function renderListCard(list) {
  const thumbs = list.showIds.slice(0, 5).map(idx => {
    const show = SHOWS[idx];
    if (!show) return `<div class="list-card-thumb" style="background:#2c3440"></div>`;
    return `<div class="list-card-thumb"><img src="${show.poster}" alt="" onerror="this.parentElement.style.background='#2c3440'"></div>`;
  }).join('');
  return `
    <div class="list-card-wrapper">
      <div class="list-card" data-list-id="${list.id}">${thumbs}</div>
      <div class="list-info">
        <h3>${list.title}</h3>
        <p>${list.likes} likes · by ${list.author.displayName}</p>
      </div>
    </div>
  `;
}
