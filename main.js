import fs, { existsSync } from 'fs';
import path from 'path';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';

const args = ['songs', 'playlist', 'output'];
const argv = yargs(hideBin(process.argv)).argv;

// Validate args
args.forEach((arg) => {
  if (!argv[arg]) {
    throw new Error(`Missing argument: ${arg}`);
  }

  if (arg === 'songs' && !existsSync(argv[arg])) {
    throw new Error(`Song directory does not exist: ${argv[arg]}`);
  }

  if (arg === 'playlist' && !existsSync(argv[arg]) && path.extname(argv[arg]) !== '.csv') {
    throw new Error(`Playlist file does not exist or is not a csv: ${argv[arg]}`);
  }

  if (arg === 'output' && !existsSync(argv[arg])) {
    throw new Error(`Output directory does not exist: ${argv[arg]}`);
  }
});

const outputDir = path.join(argv.output, path.basename(argv.playlist, '.csv'));
const playlist = fs.readFileSync(argv.playlist, 'utf8');
const songs = playlist
  .split('\n')
  .map((line) => {
    let [, title, album, artist] = line ? line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) : [];

    title = title ? title.replace(/"/g, '') : '';
    album = album ? album.replace(/"/g, '') : '';
    artist = artist ? artist.replace(/"/g, '').split(',')[0] : '';

    if (artist && album && title) {
      return { artist, album, title };
    }
  })
  .filter((song, index) => index > 0 && song);

// Create output dir
if (!existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

let copied = 0;

// Sort the songs into playlist
songs.forEach((song) => {
  const songPath = path.join(argv.songs, song.artist, song.album);

  try {
    const files = fs.readdirSync(songPath);
    const songFile = files.find((file) => file.includes(song.title) && file.endsWith('.ogg'));
    const destPath = path.join(argv.output, path.basename(argv.playlist, '.csv'), `${song.artist} - ${song.title}.ogg`);

    copied++;

    if (!existsSync(destPath) && existsSync(songPath)) {
      fs.copyFileSync(path.join(songPath, songFile), destPath);
    }
  }
  catch (err) {
    const destPath = path.join(argv.output, path.basename(argv.playlist, '.csv'), `${song.artist} - ${song.title}.ogg`);

    if (!existsSync(destPath)) { // Check if file got copied manually and log if missing (it can still error out if the file includes ":" or "/" on Windows)
      console.log('Error: ', songPath)
    }
  }
});

console.log(`Finished and copied ${copied} songs on ${argv['playlist']}`)