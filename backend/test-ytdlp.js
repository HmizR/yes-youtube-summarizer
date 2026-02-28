const ytdl = require('@distube/ytdl-core');

const VIDEO_URL = 'https://www.youtube.com/watch?v=yZwSiWScqoU&pp=ugUHEgVlbi1BVQ%3D%3D'; // https://www.youtube.com/watch?v=iNyUmbmQQZg&pp=ygUGdGVkIGVk

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// const VIDEO_ID = extractVideoId(VIDEO_URL);
const VIDEO_ID = 'yZwSiWScqoU'; // direct video ID

async function test() {
  try {
    // ✅ ESM dynamic import
    const { fetchTranscript } = await import('youtube-transcript-plus');

    console.log('Fetching video info...\n');

    const info = await ytdl.getInfo(VIDEO_ID);

    console.log('Title:', info.videoDetails.title);
    console.log('Channel:', info.videoDetails.author.name);
    console.log('Channel ID:', info.videoDetails.author.id);
    console.log('Duration (seconds):', info.videoDetails.lengthSeconds);

    // console.log('Full video details:', info.videoDetails);

    console.log('\nFetching transcript...\n');

    const transcript = await fetchTranscript(VIDEO_ID);

    console.log('Transcript sample:', transcript.slice(0, 3));
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

test();
