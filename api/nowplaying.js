import fetch from 'node-fetch';
import xml2js from 'xml2js';

export default async function handler(req, res) {
  try {
    const xmlUrl = "https://api.mixzoneapp.cl/?pass=sSCDEkX9rB&action=playbackinfo";
    const coverUrl = "https://api.mixzoneapp.cl/?pass=sSCDEkX9rB&action=trackartwork";
    const streamUrl = "https://live.mixzoneapp.cl/stream";

    // Obtener el XML
    const xmlResponse = await fetch(xmlUrl);
    const xmlText = await xmlResponse.text();

    // Parsear XML
    const parsed = await xml2js.parseStringPromise(xmlText, { explicitArray: false });

    // Extraer TRACK actual
    const track = parsed?.Info?.CurrentTrack?.TRACK;

    const artist = track?.$.ARTIST || "";
    const title = track?.$.TITLE || "";
    const album = track?.$.ALBUM || "";
    const castTitle = track?.$.CASTTITLE || `${artist} - ${title}`;

    res.status(200).json({
      artist,
      title,
      album,
      castTitle,
      cover: coverUrl,
      stream: streamUrl,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      error: "Error parsing XML",
      details: error.toString()
    });
  }
}

