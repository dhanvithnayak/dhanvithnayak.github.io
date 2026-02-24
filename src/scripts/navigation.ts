interface StatusBar {
  mode: HTMLElement;
  commandLine: HTMLElement;
  fileInfo: HTMLElement;
  position: HTMLElement;
}

let currentMode = 'NORMAL';
let commandBuffer = '';

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (currentMode === 'INSERT' && e.key !== 'Escape') {
    return;
  }

  switch (e.key) {
    case ':':
      e.preventDefault();
      currentMode = 'COMMAND';
      commandBuffer = ':';
      window.updateStatusBar(currentMode, commandBuffer);
      break;
    case '/':
      e.preventDefault();
      currentMode = 'SEARCH';
      commandBuffer = '/';
      window.updateStatusBar(currentMode, commandBuffer);
      break;
    case 'Escape':
      handleEscape();
      break;
    case 'Enter':
      if (currentMode === 'COMMAND' || currentMode === 'SEARCH') {
        handleCommand(commandBuffer);
        handleEscape();
      }
      break;
    case 'Backspace':
      if (currentMode === 'COMMAND' || currentMode === 'SEARCH') {
        e.preventDefault();
        commandBuffer = commandBuffer.slice(0, -1);
        if (commandBuffer.length === 0) {
          handleEscape();
        } else {
          window.updateStatusBar(undefined, commandBuffer);
        }
      }
      break;
    default:
      if (currentMode === 'COMMAND' || currentMode === 'SEARCH') {
        e.preventDefault();
        commandBuffer += e.key;
        window.updateStatusBar(undefined, commandBuffer);
      } else {
        handleNormalModeKey(e.key);
      }
  }
});

function handleEscape() {
  currentMode = 'NORMAL';
  commandBuffer = '';
  window.updateStatusBar(currentMode, '');
  const searchResults = document.getElementById('search-results');
  if (searchResults) {
    searchResults.innerHTML = '';
    searchResults.classList.add('hidden');
  }
}

function getBasePrefix(): string {
  const match = window.location.pathname.match(/^\/archive\/[^/]+/);
  return match ? match[0] : '';
}

function handleCommand(command: string) {
  const base = getBasePrefix();
  if (command.startsWith(':')) {
    const cmd = command.slice(1).toLowerCase();
    switch (cmd) {
      case 'blog':
        window.location.href = `${base}/blog`;
        break;
      case 'about':
        window.location.href = `${base}/about`;
        break;
      case 'contact':
        window.location.href = `${base}/contact`;
        break;
      case 'resume':
        window.location.href = `${base}/resume`;
        break;
      case 'q':
        window.close();
        window.location.href = `${base}/exited`;
        break;
      case 'h':
        window.location.href = `${base}/help`;
        break;
      default:
        console.log('Unknown command:', cmd);
    }
  } else if (command.startsWith('/')) {
    const searchTerm = command.slice(1);
    window.performSearch(searchTerm);
  }
}

function handleNormalModeKey(key: string) {
  switch (key) {
    case 'u':
      navigateUp();
      break;
    case 'j':
      window.scrollBy(0, 30);
      updatePosition();
      break;
    case 'k':
      window.scrollBy(0, -30);
      updatePosition();
      break;
    case 'g':
      window.scrollTo(0, 0);
      updatePosition();
      break;
    case 'G':
      window.scrollTo(0, document.body.scrollHeight);
      updatePosition();
      break;
    case 'i':
      currentMode = 'INSERT';
      window.updateStatusBar(currentMode);
      break;
    case 'v':
      currentMode = 'VISUAL';
      window.updateStatusBar(currentMode);
      break;
  }
}

function updatePosition() {
  const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
  window.updateStatusBar(undefined, undefined, undefined, `${scrollPercentage}%`);
}

updatePosition();
window.addEventListener('scroll', updatePosition);

const currentPath = window.location.pathname;
window.updateStatusBar(undefined, undefined, currentPath === '/' ? 'Landing Page' : currentPath.slice(1));

function navigateUp() {
  const currentPath = window.location.pathname;
  const base = getBasePrefix();

  if (base && (currentPath === base || currentPath === base + '/')) return;
  if (currentPath === '/') return;

  const pathParts = currentPath.split('/').filter(Boolean);
  const baseParts = base.split('/').filter(Boolean);

  if (pathParts.length <= baseParts.length + 1) {
    window.location.href = base || '/';
  } else {
    const newPath = '/' + pathParts.slice(0, -1).join('/');
    window.location.href = newPath;
  }
}
