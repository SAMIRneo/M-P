import concurrently from 'concurrently';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction pour ouvrir le navigateur de manière cross-platform
const openBrowser = (url) => {
  let command;
  switch (process.platform) {
    case 'darwin':
      command = `open "${url}"`;
      break;
    case 'win32':
      command = `start "${url}"`;
      break;
    default:
      command = `xdg-open "${url}"`;
      break;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error(`Erreur lors de l'ouverture du navigateur: ${error}`);
    }
  });
};

// Fonction pour tuer les processus sur un port spécifique
const killPort = (port) => {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      const command = `for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /f /pid %a >nul 2>&1`;
      exec(command, () => {
        // On ignore les erreurs (si le port est déjà libre)
        resolve();
      });
    } else {
      // Fallback simple pour Mac/Linux (lsof)
      exec(`lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`, () => resolve());
    }
  });
};

// Configuration des services du Métavers
const services = [
  {
    command: 'npm run dev -- --port 3000',
    name: 'ORCHIDS-HUB',
    cwd: '.',
    prefixColor: 'magenta.bold',
    env: { PORT: '3000' }
  },
  {
    command: 'npm run dev -- --port 3001',
    name: 'GNOSIS-APP',
    cwd: '../gnosis-app',
    prefixColor: 'blue.bold',
    env: { PORT: '3001' }
  },
  {
    command: 'npm run dev -- --port 5173',
    name: 'GLOBERTS',
    cwd: '../GLOBErts',
    prefixColor: 'cyan.bold',
  },
  {
    command: 'npm run dev -- --port 5174',
    name: 'CHARTS',
    cwd: '../charts',
    prefixColor: 'yellow.bold',
  }
];

console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[1m\x1b[32m%s\x1b[0m', '       🚀 Lancement du Métavers ORCHIDS ISLAND');
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('Services en cours de démarrage :');
console.log('  🏛️  Hub Central    : http://localhost:3000');
console.log('  🔮 Gnosis (Savoir) : http://localhost:3001');
console.log('  🌐 GLOBErts (Monde): http://localhost:5173');
console.log('  📈 Charts (Finance): http://localhost:5174');
console.log('\x1b[36m%s\x1b[0m', '-------------------------------------------------------');

// Nettoyage des ports avant démarrage
console.log('\x1b[33m%s\x1b[0m', '🧹 Nettoyage des ports (3000, 3001, 5173, 5174)...');

Promise.all([
  killPort(3000),
  killPort(3001),
  killPort(5173),
  killPort(5174)
]).then(() => {
  console.log('\x1b[32m%s\x1b[0m', '✅ Ports libérés. Démarrage des moteurs...');
  
  const { result } = concurrently(
    services.map(s => ({
      command: s.command,
      name: s.name,
      cwd: path.resolve(__dirname, s.cwd),
      prefixColor: s.prefixColor,
      env: { ...process.env, ...s.env }
    })),
    {
      prefix: 'name',
      killOthers: ['failure', 'success'],
      restartTries: 3,
    }
  );

  // Ouverture automatique du Hub après 5 secondes (le temps que Next.js démarre)
  console.log('\x1b[33m%s\x1b[0m', '⏳ Ouverture du portail dans 5 secondes...');
  setTimeout(() => {
    openBrowser('http://localhost:3000');
  }, 5000);

  result.then(
    () => console.log('Tous les services se sont arrêtés.'),
    (err) => console.error('Erreur dans un des services:', err)
  );
});
