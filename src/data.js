// Films and cinemas: real listings seen for Monday 9 November 2026 (Renoir Plaza de España,
// Cines Embajadores). Showtimes are copied from those listings; always check the cinema.
// People and bars are fictional sample data. Text fields are { en, es }.

export const GENRES = ['Drama', 'Comedy', 'Thriller', 'Romance', 'Sci-Fi', 'Action', 'Animation', 'Documentary']
export const LANGUAGES = ['Spanish', 'English', 'French', 'Italian', 'German', 'Portuguese', 'Korean', 'Japanese']

// Favourite films: id is the English title, es is the Spanish release title.
export const FAVOURITES = [
  { id: 'The Godfather', es: 'El padrino' }, { id: 'Titanic', es: 'Titanic' }, { id: 'Inception', es: 'Origen' },
  { id: 'Amélie', es: 'Amélie' }, { id: 'Pulp Fiction', es: 'Pulp Fiction' }, { id: 'Parasite', es: 'Parásitos' },
  { id: 'La La Land', es: 'La La Land' }, { id: 'Spirited Away', es: 'El viaje de Chihiro' },
  { id: 'The Shawshank Redemption', es: 'Cadena perpetua' }, { id: "Pan's Labyrinth", es: 'El laberinto del fauno' },
  { id: 'Cinema Paradiso', es: 'Cinema Paradiso' }, { id: 'Interstellar', es: 'Interstellar' },
  { id: 'Forrest Gump', es: 'Forrest Gump' }, { id: 'All About My Mother', es: 'Todo sobre mi madre' },
  { id: 'Intouchables', es: 'Intocable' }, { id: 'Coco', es: 'Coco' },
]

export const MOODS = ['Inspired', 'Moved', 'Laughing', 'Mind blown', 'Want to talk']

export const CINEMAS = {
  renoir: { name: 'Renoir Plaza de España', area: 'Plaza de España', address: 'C/ Martín de los Héroes 12' },
  embgta: { name: 'Cines Embajadores', area: 'Embajadores', address: 'Glorieta de Santa María de la Cabeza 5' },
  embrio: { name: 'Cines Embajadores Río', area: 'Embajadores', address: 'C/ Ercilla 53' },
}

// version: 'Spanish' (Spanish-language original or dubbed) | 'VOSE' (original version, Spanish subtitles)
export const FILMS = [
  {
    id: 'f1', title: { en: 'Pray for Us', es: 'Ruega por nosotras' }, genre: 'Drama', runtime: 136,
    grad: ['#7c2d12', '#f59e0b'],
    blurb: { en: 'Daniel Monzón’s historical drama about young women confined in Franco-era Spain.', es: 'Drama histórico de Daniel Monzón sobre jóvenes encerradas en la España franquista.' },
    showings: [
      { cinema: 'renoir', audio: 'Spanish', version: 'Spanish', times: ['17:50', '20:05', '22:00'] },
      { cinema: 'embrio', audio: 'Spanish', version: 'Spanish', times: ['17:50', '20:25'] },
    ],
  },
  {
    id: 'f2', title: { en: 'La bola negra', es: 'La bola negra' }, genre: 'Drama', runtime: 155,
    grad: ['#111827', '#6d172e'],
    blurb: { en: 'By Los Javis. Spain’s pick for the 2027 Oscars.', es: 'De Los Javis. La elegida por España para los Oscar 2027.' },
    showings: [
      { cinema: 'embgta', audio: 'Spanish', version: 'Spanish', times: ['17:40', '19:40'] },
      { cinema: 'renoir', audio: 'Spanish', version: 'Spanish', times: ['20:10'] },
    ],
  },
  {
    id: 'f3', title: { en: 'The Invite', es: 'La invitación' }, genre: 'Comedy', runtime: 108,
    grad: ['#ec4899', '#f97316'],
    blurb: { en: 'Olivia Wilde, Penélope Cruz, Seth Rogen and Edward Norton in an English-language comedy.', es: 'Olivia Wilde, Penélope Cruz, Seth Rogen y Edward Norton en una comedia en inglés.' },
    showings: [
      { cinema: 'renoir', audio: 'English', version: 'VOSE', times: ['20:10', '22:15'] },
      { cinema: 'embgta', audio: 'English', version: 'VOSE', times: ['20:10'] },
    ],
  },
  {
    id: 'f4', title: { en: 'Just an Illusion', es: 'Tiempos de ilusión' }, genre: 'Comedy', runtime: 119,
    grad: ['#0ea5e9', '#a855f7'],
    blurb: { en: 'Nakache and Toledano’s coming-of-age story set in 1985 France.', es: 'El relato de juventud de Nakache y Toledano, ambientado en la Francia de 1985.' },
    showings: [{ cinema: 'renoir', audio: 'French', version: 'VOSE', times: ['18:05', '20:20', '22:35'] }],
  },
  {
    id: 'f5', title: { en: 'Arriba Tutto', es: 'Arriba Tutto' }, genre: 'Comedy', runtime: 102,
    grad: ['#facc15', '#dc2626'],
    blurb: { en: 'Spanish comedy from José Mota.', es: 'Comedia española de José Mota.' },
    showings: [{ cinema: 'renoir', audio: 'Spanish', version: 'Spanish', times: ['16:00', '18:00'] }],
  },
  {
    id: 'f6', title: { en: 'The Cat in the Hat', es: 'El gato con sombrero' }, genre: 'Animation', runtime: 106,
    grad: ['#22d3ee', '#ef4444'],
    blurb: { en: 'Animated Dr. Seuss adventure, dubbed into Spanish.', es: 'Aventura animada de Dr. Seuss, doblada al español.' },
    showings: [{ cinema: 'embgta', audio: 'Spanish', version: 'Spanish', times: ['16:00', '18:05', '20:15'] }],
  },
]

export const POPCORN = ['sweet', 'salty']
export const TALK = ['silent', 'whisper', 'talker']
export const DRINKS = ['vermut', 'wine', 'beer', 'cocktail', 'soft']

// Five taste answers: film, genre, popcorn, talk, drink (+ film languages they watch in).
export const PEOPLE = [
  { id: 'p1', name: 'Lucía', age: 26, gender: 'F', color: '#c2410c', film: 'Amélie', genre: 'Drama', popcorn: 'salty', talk: 'silent', drink: 'wine', langs: ['Spanish', 'English'], ice: { en: 'What was the last film that made you cry in public?', es: '¿Cuál fue la última película que te hizo llorar en público?' }, mood: 'Moved' },
  { id: 'p2', name: 'Marco', age: 31, gender: 'M', color: '#1d4ed8', film: 'Inception', genre: 'Sci-Fi', popcorn: 'salty', talk: 'whisper', drink: 'beer', langs: ['English', 'Spanish', 'Italian'], ice: { en: 'Which film ending would you rewrite if you could?', es: '¿Qué final de película reescribirías si pudieras?' }, mood: 'Mind blown' },
  { id: 'p3', name: 'Hana', age: 24, gender: 'F', color: '#7e22ce', film: 'Spirited Away', genre: 'Animation', popcorn: 'sweet', talk: 'whisper', drink: 'vermut', langs: ['English', 'French', 'Japanese'], ice: { en: 'Pick one film character to be your flatmate. Who?', es: 'Elige un personaje de cine como compañero de piso. ¿Quién?' }, mood: 'Laughing' },
  { id: 'p4', name: 'Daniel', age: 29, gender: 'M', color: '#047857', film: 'Cinema Paradiso', genre: 'Drama', popcorn: 'salty', talk: 'talker', drink: 'vermut', langs: ['Spanish', 'English'], ice: { en: 'Best film you only saw because of a stranger?', es: '¿La mejor película que viste solo por culpa de un desconocido?' }, mood: 'Inspired' },
  { id: 'p5', name: 'Sofía', age: 35, gender: 'F', color: '#b45309', film: "Pan's Labyrinth", genre: 'Thriller', popcorn: 'sweet', talk: 'silent', drink: 'wine', langs: ['Spanish', 'French'], ice: { en: 'Do you guess the twist, or let the film surprise you?', es: '¿Adivinas el giro o dejas que la película te sorprenda?' }, mood: 'Want to talk' },
  { id: 'p6', name: 'Iván', age: 26, gender: 'M', color: '#b91c1c', film: 'Intouchables', genre: 'Comedy', popcorn: 'sweet', talk: 'silent', drink: 'beer', langs: ['Spanish', 'English', 'Portuguese'], ice: { en: 'Popcorn: sweet, salty or both?', es: 'Palomitas: ¿dulces, saladas o mitad y mitad?' }, mood: 'Laughing' },
  { id: 'p7', name: 'Clara', age: 41, gender: 'F', color: '#0e7490', film: 'Amélie', genre: 'Comedy', popcorn: 'salty', talk: 'silent', drink: 'vermut', langs: ['French', 'Spanish', 'German'], ice: { en: 'Which film do you quote more than you should?', es: '¿Qué película citas más de lo que deberías?' }, mood: 'Inspired' },
  { id: 'p8', name: 'Aiko', age: 23, gender: 'F', color: '#4d7c0f', film: 'Spirited Away', genre: 'Sci-Fi', popcorn: 'salty', talk: 'silent', drink: 'vermut', langs: ['English', 'Japanese', 'Korean'], ice: { en: 'Dubbed, subtitled or original version?', es: '¿Doblada, subtitulada o versión original?' }, mood: 'Mind blown' },
  { id: 'p9', name: 'Pablo', age: 38, gender: 'M', color: '#c2410c', film: 'The Godfather', genre: 'Action', popcorn: 'salty', talk: 'talker', drink: 'cocktail', langs: ['Spanish'], ice: { en: 'What is your go-to film for a rainy Sunday?', es: '¿Cuál es tu película para un domingo de lluvia?' }, mood: 'Moved' },
  { id: 'p10', name: 'Elena', age: 30, gender: 'F', color: '#6d28d9', film: 'Amélie', genre: 'Romance', popcorn: 'sweet', talk: 'whisper', drink: 'wine', langs: ['English', 'Spanish', 'French'], ice: { en: 'First film you remember watching at a cinema?', es: '¿La primera película que recuerdas haber visto en el cine?' }, mood: 'Want to talk' },
  { id: 'p11', name: 'Jonas', age: 22, gender: 'M', color: '#0f766e', film: 'Interstellar', genre: 'Sci-Fi', popcorn: 'salty', talk: 'whisper', drink: 'cocktail', langs: ['English', 'German'], ice: { en: 'Which film world would you move to?', es: '¿A qué mundo de película te mudarías?' }, mood: 'Mind blown' },
  { id: 'p12', name: 'Carmen', age: 45, gender: 'F', color: '#be123c', film: 'All About My Mother', genre: 'Drama', popcorn: 'sweet', talk: 'talker', drink: 'wine', langs: ['Spanish', 'French'], ice: { en: 'A film that changed how you see Madrid?', es: '¿Una película que cambió cómo ves Madrid?' }, mood: 'Moved' },
  { id: 'p13', name: 'Álvaro', age: 28, gender: 'M', color: '#0369a1', film: 'Cinema Paradiso', genre: 'Comedy', popcorn: 'salty', talk: 'silent', drink: 'vermut', langs: ['Spanish', 'English'], ice: { en: 'Which actor would you want as your best friend?', es: '¿Qué actor querrías como mejor amigo?' }, mood: 'Laughing' },
  { id: 'p14', name: 'Nora', age: 32, gender: 'F', color: '#a21caf', film: 'Parasite', genre: 'Thriller', popcorn: 'salty', talk: 'whisper', drink: 'cocktail', langs: ['English', 'Spanish', 'German'], ice: { en: 'Best twist you never saw coming?', es: '¿El mejor giro que nunca viste venir?' }, mood: 'Mind blown' },
  { id: 'p15', name: 'Inés', age: 25, gender: 'F', color: '#db2777', film: 'All About My Mother', genre: 'Drama', popcorn: 'sweet', talk: 'silent', drink: 'vermut', langs: ['Spanish', 'English'], ice: { en: 'Which film made you want to travel?', es: '¿Qué película te dio ganas de viajar?' }, mood: 'Inspired' },
  { id: 'p16', name: 'Theo', age: 27, gender: 'M', color: '#4338ca', film: 'Parasite', genre: 'Thriller', popcorn: 'salty', talk: 'talker', drink: 'beer', langs: ['English', 'French'], ice: { en: 'What is the most rewatchable film ever made?', es: '¿Cuál es la película más reveible de la historia?' }, mood: 'Want to talk' },
]

// walk: minutes on foot from each cinema area (sample values)
export const BARS = [
  { id: 'b1', name: 'Bar Candela', area: 'Malasaña', music: 'Live jazz', closes: '01:30', moods: ['Moved', 'Inspired'], genres: ['Drama', 'Romance'], walk: { 'Plaza de España': 9, Embajadores: 22 }, vibe: { en: 'Low lights, a trio in the corner and tables where you can still hear each other.', es: 'Luz tenue, un trío en la esquina y mesas donde aún os podéis oír.' } },
  { id: 'b2', name: 'La Cuerda Floja', area: 'Lavapiés', music: 'Acoustic set', closes: '01:00', moods: ['Moved', 'Want to talk'], genres: ['Drama', 'Documentary'], walk: { 'Plaza de España': 20, Embajadores: 7 }, vibe: { en: 'A small room with one guitar. Quiet enough to unpack the film together.', es: 'Una sala pequeña con una guitarra. Lo bastante tranquila para comentar la película.' } },
  { id: 'b3', name: 'Sótano 14', area: 'Gran Vía', music: 'DJ set', closes: '03:00', moods: ['Laughing', 'Mind blown'], genres: ['Comedy', 'Sci-Fi', 'Animation', 'Action'], walk: { 'Plaza de España': 6, Embajadores: 20 }, vibe: { en: 'Upbeat basement bar. Perfect for the high you leave the cinema with.', es: 'Bar en un sótano con mucho ritmo. Perfecto para la energía con la que sales del cine.' } },
  { id: 'b4', name: 'Vermut Quimera', area: 'Chamberí', music: 'Chill playlist', closes: '00:30', moods: ['Want to talk', 'Inspired'], genres: ['Thriller', 'Romance', 'Drama'], walk: { 'Plaza de España': 18, Embajadores: 28 }, vibe: { en: 'Vermouth on tap and a soft playlist. Made for long theories about the plot.', es: 'Vermut de grifo y una lista suave. Hecho para largas teorías sobre la trama.' } },
  { id: 'b5', name: 'Taberna del Faro', area: 'Malasaña', music: 'Live jazz', closes: '02:00', moods: ['Inspired', 'Mind blown'], genres: ['Sci-Fi', 'Thriller', 'Documentary'], walk: { 'Plaza de España': 10, Embajadores: 24 }, vibe: { en: 'Cosy corner bar with live jazz on film nights and big shared tables.', es: 'Bar acogedor de esquina con jazz en directo las noches de cine y grandes mesas compartidas.' } },
  { id: 'b6', name: 'Casa Brillante', area: 'Gran Vía', music: 'Chill playlist', closes: '01:00', moods: ['Laughing', 'Moved'], genres: ['Comedy', 'Romance', 'Animation'], walk: { 'Plaza de España': 5, Embajadores: 19 }, vibe: { en: 'Warm tapas bar where everyone ends up laughing a bit louder.', es: 'Bar de tapas cálido donde todo el mundo acaba riendo un poco más alto.' } },
  { id: 'b7', name: 'El Rincón de Lola', area: 'La Latina', music: 'Acoustic set', closes: '01:30', moods: ['Want to talk', 'Moved', 'Inspired'], genres: ['Drama', 'Comedy', 'Romance'], walk: { 'Plaza de España': 14, Embajadores: 10 }, vibe: { en: 'Tiny tapas place with a singer-songwriter most nights.', es: 'Pequeño sitio de tapas con cantautor casi todas las noches.' } },
  { id: 'b8', name: 'Bodega Sol y Sombra', area: 'Embajadores', music: 'Chill playlist', closes: '02:00', moods: ['Laughing', 'Want to talk', 'Mind blown'], genres: ['Comedy', 'Thriller', 'Action', 'Animation'], walk: { 'Plaza de España': 18, Embajadores: 4 }, vibe: { en: 'Old-school bodega with a modern playlist and plenty of sharing plates.', es: 'Bodega de toda la vida con lista moderna y muchos platos para compartir.' } },
  { id: 'b9', name: 'Vermutería Callao', area: 'Callao', music: 'Acoustic set', closes: '01:00', moods: ['Want to talk', 'Inspired', 'Moved'], genres: ['Drama', 'Romance', 'Comedy'], walk: { 'Plaza de España': 7, Embajadores: 17 }, vibe: { en: 'A quiet vermouth bar one street off Callao, perfect for a calm chat.', es: 'Una vermutería tranquila a una calle de Callao, perfecta para charlar con calma.' } },
]

export const TICKET_PRICE = 8.5
export const BOOKING_FEE = 1.99
export const AFTERGLOW_FEE = 1.5
export const COMMISSION = 0.1

export const ANSWER_KEYS = ['film', 'genre', 'popcorn', 'talk', 'drink']

export function sharedAnswers(profile, person) {
  return ANSWER_KEYS.filter((k) => profile.answers[k] === person[k])
}

export function compatibility(profile, person) {
  const shared = sharedAnswers(profile, person)
  const centre = (profile.ageMin + profile.ageMax) / 2
  const bonus = Math.max(0, 6 - Math.round(Math.abs(person.age - centre)))
  const score = Math.min(98, 56 + shared.length * 8 + bonus)
  return { score, shared }
}

export function itemFor(profile, person) {
  return { person, ...compatibility(profile, person) }
}

// Matches always fall inside the chosen age range (and respect women-only matching).
export function rankMatches(profile) {
  const wants = (p) => {
    if (profile.gender === 'woman') return !profile.womenOnly || p.gender === 'F'
    if (profile.interestedIn === 'women') return p.gender === 'F'
    if (profile.interestedIn === 'men') return p.gender === 'M'
    return true
  }
  return PEOPLE.filter((p) => p.age >= profile.ageMin && p.age <= profile.ageMax && wants(p))
    .map((p) => itemFor(profile, p))
    .sort((a, b) => b.score - a.score)
}

export function rankBars(film, cinemaArea, myMood, theirMood) {
  return BARS.map((bar) => {
    const walk = bar.walk[cinemaArea] || 15
    let score = 0
    if (bar.moods.includes(myMood)) score += 3
    if (bar.moods.includes(theirMood)) score += 3
    if (bar.genres.includes(film.genre)) score += 2
    score -= walk / 10
    return { bar, walk, score }
  }).sort((a, b) => b.score - a.score)
}

export function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  const hh = Math.floor(total / 60) % 24
  const mm = total % 60
  return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0')
}

export function initials(name) {
  return name.trim().slice(0, 1).toUpperCase()
}

// Seven days starting on the date of the real listings (Monday 9 November 2026).
export const DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 10, 9 + i))
  return d.toISOString().slice(0, 10)
})
