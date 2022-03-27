const d = document,
  $form = d.getElementById("buscar-cancion"),
  $loader = d.querySelector(".loader"),
  $error = d.querySelector(".error"),
  $main = d.querySelector("main"),
  $artista = d.querySelector(".artista"),
  $cancion = d.querySelector(".cancion");

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    $loader.style.display = "block";

    let artista = e.target.artista.value.toLowerCase(),
      cancion = e.target.cancion.value.toLowerCase(),
      $artistaTemplate = "",
      $cancionTemplate = "",
      artistaApi = `https://theaudiodb.com/api/v1/json/2/search.php?s=${artista}`,
      cancionApi = `https://api.lyrics.ovh/v1/${artista}/${cancion}`,
      artistaFetch = fetch(artistaApi),
      cancionFetch = fetch(cancionApi),
      [artistaRes, cancionRes] = await Promise.all([
        artistaFetch,
        cancionFetch,
      ]),
      artistaData = await artistaRes.json(),
      cancionData = await cancionRes.json();

    console.log(artistaData);
    console.log(cancionData);

    if (artistaData.artists === null) {
      $artistaTemplate = `<h2> No existe ese artista <mark>${artista}</mark></h2>`;
    } else {
      let artist = artistaData.artists[0];
      $artistaTemplate = `
        <h2> ${artist.strArtist}</h2>
        <img src =" ${artist.strArtistThumb}" alt= "${artist.strArtist}">
        <p>${artist.intBornYear} - ${artist.intDiedYear || "Presente"}</p>
        <p>${artist.strCountry}</p>
        <p>${artist.strGenre} - ${artist.strStyle}</p>
        <a href="http://${artist.strWebsite}" target ="_blank"> Sitio web</a>
        <p> ${artist.strBiographyEN}</p>
        `;
    }
    $loader.style.display = "none";
    $artista.innerHTML = $artistaTemplate;

    if (cancionData.error) {
      $artistaTemplate = `
      <h2> No existe esa canción <mark>${cancion}</mark></h2>`;
    } else {
      let letra = cancionData.lyrics;
      $cancionTemplate = `
      <h2> Letra de la Canción</h2>
      <blockquote> ${letra}</mark></blockquote>`;
    }
    $cancion.innerHTML = $cancionTemplate;
  } catch (err) {
    console.log(err);
    let mensaje = err.statusText || "Ocurrio un error";
    $error.innerHTML = `<p> Error ${err.status}: ${mensaje}</p>`;
    $loader.style.display = "none";
  }
});
