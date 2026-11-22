const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://tarot.vercel.app';
const JS_URL = `${BASE_URL}/static/js/main.05d69e63.chunk.js`;

const DATA_DIR = path.join(__dirname, '..', 'data');
const CARDS_IMG_DIR = path.join(__dirname, '..', 'cards');
const PUBLIC_CARDS_IMG_DIR = path.join(__dirname, '..', 'public', 'cards');

[DATA_DIR, CARDS_IMG_DIR, PUBLIC_CARDS_IMG_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}, status: ${res.statusCode}`));
      }
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function downloadFile(url, destPaths) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}, status: ${res.statusCode}`));
      }
      const fileStreams = destPaths.map((p) => fs.createWriteStream(p));
      res.on('data', (chunk) => {
        fileStreams.forEach((stream) => stream.write(chunk));
      });
      res.on('end', () => {
        fileStreams.forEach((stream) => stream.end());
        resolve();
      });
      res.on('error', (err) => {
        fileStreams.forEach((stream) => stream.destroy());
        reject(err);
      });
    }).on('error', reject);
  });
}

async function scrape() {
  console.log('1. Fetching JavaScript bundle from', JS_URL);
  const jsContent = await fetchText(JS_URL);

  const startMarker = `[{name:"The Fool"`;
  const startIdx = jsContent.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error('Could not find start of cards array');
  }

  let depth = 0;
  let endIdx = -1;
  for (let i = startIdx; i < jsContent.length; i++) {
    if (jsContent[i] === '[') depth++;
    else if (jsContent[i] === ']') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  const arrayCode = jsContent.substring(startIdx, endIdx + 1);
  const cards = eval(arrayCode);

  console.log(`Successfully parsed ${cards.length} cards.`);

  const jsonPath = path.join(DATA_DIR, 'cards.json');
  fs.writeFileSync(jsonPath, JSON.stringify(cards, null, 2), 'utf-8');
  console.log(`Saved cards data to ${jsonPath}`);

  // Gather all unique image filenames to download
  const imageNames = new Set(cards.map((c) => c.img).filter(Boolean));
  imageNames.add('back.jpg');

  console.log(`2. Downloading ${imageNames.size} card images...`);

  const imageList = Array.from(imageNames);
  let downloadedCount = 0;
  let failedCount = 0;

  // Concurrency pool
  const CONCURRENCY = 6;
  for (let i = 0; i < imageList.length; i += CONCURRENCY) {
    const batch = imageList.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (imgName) => {
        const imgUrl = `${BASE_URL}/cards/${imgName}`;
        const dest1 = path.join(CARDS_IMG_DIR, imgName);
        const dest2 = path.join(PUBLIC_CARDS_IMG_DIR, imgName);
        try {
          await downloadFile(imgUrl, [dest1, dest2]);
          downloadedCount++;
          process.stdout.write(`\rDownloaded ${downloadedCount}/${imageList.length} images...`);
        } catch (err) {
          failedCount++;
          console.error(`\nError downloading ${imgName}:`, err.message);
        }
      })
    );
  }

  console.log(`\n\nDownload complete!`);
  console.log(`Total images downloaded: ${downloadedCount}`);
  if (failedCount > 0) {
    console.warn(`Failed downloads: ${failedCount}`);
  }

  // Generate summary report
  const summary = {
    totalCards: cards.length,
    arcana: {
      major: cards.filter(c => c.arcane === 'Major Arcana').length,
      minor: cards.filter(c => c.arcane === 'Minor Arcana').length
    },
    suits: {
      trumps: cards.filter(c => c.suit === 'Trump').length,
      cups: cards.filter(c => c.suit === 'Cups').length,
      swords: cards.filter(c => c.suit === 'Swords').length,
      wands: cards.filter(c => c.suit === 'Wands').length,
      pentacles: cards.filter(c => c.suit === 'Pentacles').length
    },
    imagesDownloaded: downloadedCount,
    savedDataPath: 'data/cards.json',
    imagesDirectories: ['cards/', 'public/cards/']
  };

  fs.writeFileSync(
    path.join(DATA_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );
  console.log('Saved summary to data/summary.json');
}

scrape().catch((err) => {
  console.error('Scraping failed:', err);
  process.exit(1);
});
