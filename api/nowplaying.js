import fetch from "node-fetch";
import xml2js from "xml2js";

const PLAYBACK_URL = "https://api.mixzoneapp.cl/?pass=sSCDEkX9rB&action=playbackinfo";
const COVER_URL = "https://api.mixzoneapp.cl/?pass=sSCDEkX9rB&action=trackartwork";
const STREAM_URL = "https://live.mixzoneapp.cl/stream";

export default async function handler(req, res) {
  try {
    // Obtener el XML desde tu API
    const xmlResponse = await fetch(PLAYBACK_URL);
    const xmlText = await xmlResponse.text();

    // Convertir XML → JSON
    const result = await xml2js.parseStringPromise(xmlText, { explicitArray: false });

    const track = result.Info.CurrentTrack.TRACK;

    // ARTISTA
    let artist = track.ARTIST || "";
    if (!artist && track.FILENAME) {
      const filename = track.FILENAME.split("\\").pop();
      if (filename.includes(" - ")) {
        artist = filename.split(" - ")[0];
      }
    }

    // TÍTULO
    const title = track.TITLE || track.ITEMTITLE || "";

    // ÁLBUM
    const album = track.ALBUM || "";

    // CAST TITLE
    const castTitle = track.CASTTITLE || title;

    // Respuesta final
    const data = {
      artist,
      title,
      album,
      castTitle,
      cover: COVER_URL,
      stream: STREAM_URL,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Error procesando XML" });
  }
}
