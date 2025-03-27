# Playlist Sorter

A local playlist sorter for songs downloaded via Soggfy.

## The problem

Downloading songs using Soggfy automatically sorts them into `Artist/Album/Song` or a variation of that like `Artist1,Artist2,Artist3/Album/CDX/Song`. If you want to re-sort those songs into a playlist here's how.

## How to use

1. Export your playlist to a `.csv` file via [Exportify](https://exportify.net/#playlists)
2. Download your playlist using [Soggfy](https://github.com/Rafiuth/Soggfy) 
3. Run the sorter with the following parameters:
- `--songs - Path to the Soggfy song directory`
- `--playlist - Path to the playlist .csv file` 
- `--output - Path where to create the playlist`

Example:

`node main.js --songs "C:\Users\joaom\Music\Soggfy\" --playlist "./data/csv/sunset.csv" --output "./data/playlists"`

## Notes

On Windows, paths including `:`, `\` or ending in `.` may generate problems so you'll have to copy those manually (or just use Linux/Mac). Files that error out are logged to the console. 
