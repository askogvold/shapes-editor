# shapes-editor
Tool to generate GTFS shape files using the Google Roads API

Note: Edit `index.html` and `app.js` / `app.ts` to have your Google API key instead of GOOGLE_API_KEY placeholders.

At this time, this tool is just a start, but it demonstrates how you can use the Google Roads API to generate paths from a set of stops.
I used IntelliJ IDEA to compile the TypeScript, but also added the javascript file, so you can test this without compiling TypeScript.
I'd rather automate this, of course.

Launch with `python server.py GOOGLE_API_KEY /path/to/gtfs/dataset`.
