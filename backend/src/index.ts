import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import app from './app';

const PORT = parseInt(process.env.PORT || '3001', 10);

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
