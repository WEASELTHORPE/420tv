const params = new URLSearchParams(window.location.search);
const tvId = params.get('id');

async function fetchTVDetails(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
  const show = await res.json();

  const container = document.getElementById('movie-details');
  container.innerHTML = `
    <img src="${IMAGE_BASE + show.poster_path}" alt="${show.name}" class="w-full md:w-1/3 rounded-lg shadow" />
    <div>
      <h2 class="text-3xl font-bold mb-2">${show.name}</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
        First Air Date: ${show.first_air_date}
      </p>
      <p class="mb-4">${show.overview}</p>

      <p class="font-semibold">Genres:</p>
      <div class="flex flex-wrap gap-2 mt-1">
        ${show.genres.map(g => `
          <span class="px-2 py-1 bg-blue-600 text-white text-sm rounded">
            ${g.name}
          </span>`).join('')}
      </div>

      <p class="mt-4 font-semibold">Rating: ⭐ ${show.vote_average} / 10</p>
      <p class="mt-2">Seasons: ${show.number_of_seasons}</p>
    </div>
    
      

<iframe 
  src="https://www.vidking.net/embed/tv/${show.id}/1/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true" 
  width="100%" 
  height="600" 
  frameborder="0" 
  allowfullscreen>

</iframe>




`;}





fetchTVDetails(tvId);

