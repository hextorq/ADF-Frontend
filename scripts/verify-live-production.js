import https from 'https';

function check() {
  https.get('https://www.adf.ijeae.com/', { headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'Googlebot/2.1' } }, (res) => {
    let html = '';
    res.on('data', c => html += c);
    res.on('end', () => {
      console.log('=== LIVE PRODUCTION HTML VERIFICATION ===');
      console.log('Status:', res.statusCode);
      
      // Check logo in schema
      const logoMatch = html.match(/"logo":\s*\{\s*"@type":\s*"ImageObject",\s*"url":\s*"([^"]+)"/);
      console.log('EducationalOrganization Logo URL:', logoMatch ? logoMatch[1] : 'NOT FOUND');
      
      const imageMatch = html.match(/"image":\s*"([^"]+)"/);
      console.log('EducationalOrganization Image URL:', imageMatch ? imageMatch[1] : 'NOT FOUND');

      const ogImg = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
      console.log('og:image content:', ogImg ? ogImg[1] : 'NOT FOUND');

      const twitterImg = html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/);
      console.log('twitter:image content:', twitterImg ? twitterImg[1] : 'NOT FOUND');
    });
  });

  https.get('https://www.adf.ijeae.com/logo.png', (res) => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      const buf = Buffer.concat(chunks);
      console.log('\n=== LIVE LOGO.PNG VERIFICATION ===');
      console.log('Status:', res.statusCode);
      console.log('Content-Type:', res.headers['content-type']);
      console.log('Content-Length:', res.headers['content-length']);
      console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
      console.log('Cache-Control:', res.headers['cache-control']);
      console.log('Bytes received:', buf.length);
      console.log('Valid PNG Magic Bytes:', buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a');
    });
  });

  https.get('https://www.adf.ijeae.com/campaigns/art-dreams-fusion-vol-1-poster.jpg', (res) => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      const buf = Buffer.concat(chunks);
      console.log('\n=== LIVE CAMPAIGN POSTER VERIFICATION ===');
      console.log('Status:', res.statusCode);
      console.log('Content-Type:', res.headers['content-type']);
      console.log('Content-Length:', res.headers['content-length']);
      console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
      console.log('Bytes received:', buf.length);
      console.log('Valid JPEG Magic Bytes:', buf.slice(0, 3).toString('hex') === 'ffd8ff');
    });
  });

  https.get('https://www.adf.ijeae.com/robots.txt', (res) => {
    let txt = '';
    res.on('data', c => txt += c);
    res.on('end', () => {
      console.log('\n=== LIVE ROBOTS.TXT VERIFICATION ===');
      console.log('Contains Googlebot-Image:', txt.includes('Googlebot-Image'));
      console.log('Allows /logo.png:', txt.includes('Allow: /logo.png'));
    });
  });
}

check();
