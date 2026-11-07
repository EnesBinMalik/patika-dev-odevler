import { GitState, GitFile, GitCommit, GitStashItem, GitConflictState } from '../types/git';

export const INITIAL_FILES: Record<string, GitFile> = {
  'README.md': {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    content: `# Modern Web Uygulaması\n\nBu proje Enes Öztürk tarafından geliştirilen örnek bir Git reposudur.\n\n## Kurulum\n\`npm install\`\n\`npm run dev\`\n`,
    headContent: `# Modern Web Uygulaması\n\nBu proje Enes Öztürk tarafından geliştirilen örnek bir Git reposudur.\n\n## Kurulum\n\`npm install\`\n\`npm run dev\`\n`,
    status: 'committed',
  },
  'index.html': {
    path: 'index.html',
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>\n<html lang="tr">\n<head>\n  <meta charset="UTF-8">\n  <title>Proje Başlığı</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <header>\n    <h1>Git & CLI Simülatörü</h1>\n  </header>\n  <main id="app">\n    <p>Hoş geldiniz!</p>\n  </main>\n  <script src="app.js"></script>\n</body>\n</html>\n`,
    headContent: `<!DOCTYPE html>\n<html lang="tr">\n<head>\n  <meta charset="UTF-8">\n  <title>Proje Başlığı</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <header>\n    <h1>Git & CLI Simülatörü</h1>\n  </header>\n  <main id="app">\n    <p>Hoş geldiniz!</p>\n  </main>\n  <script src="app.js"></script>\n</body>\n</html>\n`,
    status: 'committed',
  },
  'style.css': {
    path: 'style.css',
    name: 'style.css',
    language: 'css',
    content: `body {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  background: #0f172a;\n  color: #f8fafc;\n}\n\nheader {\n  padding: 1.5rem;\n  border-bottom: 1px solid #334155;\n}\n`,
    headContent: `body {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  background: #0f172a;\n  color: #f8fafc;\n}\n\nheader {\n  padding: 1.5rem;\n  border-bottom: 1px solid #334155;\n}\n`,
    status: 'committed',
  },
  'app.js': {
    path: 'app.js',
    name: 'app.js',
    language: 'javascript',
    content: `console.log("Uygulama başarıyla başlatıldı.");\n\nfunction initApp() {\n  const el = document.getElementById('app');\n  if (el) {\n    el.classList.add('ready');\n  }\n}\n\ninitApp();\n`,
    headContent: `console.log("Uygulama başarıyla başlatıldı.");\n\nfunction initApp() {\n  const el = document.getElementById('app');\n  if (el) {\n    el.classList.add('ready');\n  }\n}\n\ninitApp();\n`,
    status: 'committed',
  },
};

export function createHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 7; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function createInitialState(preset: 'starter' | 'branching' | 'conflict' = 'starter'): GitState {
  const c1Id = '9b2d8e1';
  const c2Id = '3f7a4c9';

  const initialCommits: Record<string, GitCommit> = {
    [c1Id]: {
      id: c1Id,
      shortId: c1Id,
      message: 'chore: proje şablonu oluşturuldu (initial commit)',
      author: 'Enes Öztürk',
      email: 'enes@ozturk.dev',
      timestamp: '2 gün önce (14:32)',
      parents: [],
      branchName: 'main',
      filesSnapshot: {
        'README.md': INITIAL_FILES['README.md'].content,
        'index.html': INITIAL_FILES['index.html'].content,
      },
    },
    [c2Id]: {
      id: c2Id,
      shortId: c2Id,
      message: 'feat: stil dosyası ve js temel mantığı eklendi',
      author: 'Enes Öztürk',
      email: 'enes@ozturk.dev',
      timestamp: 'Dün (16:45)',
      parents: [c1Id],
      branchName: 'main',
      filesSnapshot: {
        'README.md': INITIAL_FILES['README.md'].content,
        'index.html': INITIAL_FILES['index.html'].content,
        'style.css': INITIAL_FILES['style.css'].content,
        'app.js': INITIAL_FILES['app.js'].content,
      },
      tag: 'v1.0.0',
    },
  };

  const baseState: GitState = {
    isInitialized: true,
    repoName: 'git-cli-proje',
    files: JSON.parse(JSON.stringify(INITIAL_FILES)),
    commits: initialCommits,
    branches: {
      main: c2Id,
    },
    head: {
      type: 'branch',
      name: 'main',
      commitId: c2Id,
    },
    remotes: {
      origin: {
        name: 'origin',
        url: 'https://github.com/enes-ozturk/git-cli-proje.git',
        branches: {
          main: c2Id,
        },
      },
    },
    stashes: [],
    conflict: null,
  };

  if (preset === 'branching') {
    // Add feature/auth branch with a commit, and an extra commit on main
    const cFeatureId = '7e1b5d2';
    const cMainNextId = '4a9c8f3';

    baseState.commits[cFeatureId] = {
      id: cFeatureId,
      shortId: cFeatureId,
      message: 'feat(auth): kullanıcı giriş modalı ve doğrulaması',
      author: 'Enes Öztürk',
      email: 'enes@ozturk.dev',
      timestamp: '4 saat önce',
      parents: [c2Id],
      branchName: 'feature/auth',
      filesSnapshot: {
        ...initialCommits[c2Id].filesSnapshot,
        'app.js': initialCommits[c2Id].filesSnapshot['app.js'] + '\n// Kullanıcı oturum fonksiyonları eklendi\nfunction loginUser() { return true; }\n',
      },
    };

    baseState.commits[cMainNextId] = {
      id: cMainNextId,
      shortId: cMainNextId,
      message: 'docs: dökümantasyon ve lisans güncellendi',
      author: 'Enes Öztürk',
      email: 'enes@ozturk.dev',
      timestamp: '2 saat önce',
      parents: [c2Id],
      branchName: 'main',
      filesSnapshot: {
        ...initialCommits[c2Id].filesSnapshot,
        'README.md': initialCommits[c2Id].filesSnapshot['README.md'] + '\n## Lisans\nMIT © Enes Öztürk\n',
      },
    };

    baseState.branches['main'] = cMainNextId;
    baseState.branches['feature/auth'] = cFeatureId;
    baseState.head = {
      type: 'branch',
      name: 'main',
      commitId: cMainNextId,
    };
    baseState.remotes.origin.branches['main'] = c2Id; // 1 commit behind local
  } else if (preset === 'conflict') {
    // Both branches modify index.html differently from c2Id
    const cMainBranchId = '1d9f8a2';
    const cIncomingId = '8c2e6b4';

    baseState.commits[cMainBranchId] = {
      id: cMainBranchId,
      shortId: cMainBranchId,
      message: 'refactor: header başlığı mavi temaya çevrildi',
      author: 'Enes Öztürk',
      email: 'enes@ozturk.dev',
      timestamp: '3 saat önce',
      parents: [c2Id],
      branchName: 'main',
      filesSnapshot: {
        ...initialCommits[c2Id].filesSnapshot,
        'index.html': initialCommits[c2Id].filesSnapshot['index.html'].replace(
          '<h1>Git & CLI Simülatörü</h1>',
          '<h1 class="blue-theme">Git & CLI Simülatörü (Kurumsal)</h1>'
        ),
      },
    };

    baseState.commits[cIncomingId] = {
      id: cIncomingId,
      shortId: cIncomingId,
      message: 'feat: header başlığı dinamik başlıkla değiştirildi',
      author: 'Enes Öztürk',
      email: 'enes@ozturk.dev',
      timestamp: '2 saat önce',
      parents: [c2Id],
      branchName: 'feature/header-redesign',
      filesSnapshot: {
        ...initialCommits[c2Id].filesSnapshot,
        'index.html': initialCommits[c2Id].filesSnapshot['index.html'].replace(
          '<h1>Git & CLI Simülatörü</h1>',
          '<h1 class="modern-header">Git & CLI Simülatörü (V2 Modern)</h1>'
        ),
      },
    };

    baseState.branches['main'] = cMainBranchId;
    baseState.branches['feature/header-redesign'] = cIncomingId;
    baseState.head = {
      type: 'branch',
      name: 'main',
      commitId: cMainBranchId,
    };
  }

  return baseState;
}

export interface CommandResult {
  state: GitState;
  output: string;
  type: 'output' | 'error' | 'success' | 'info';
}

export function executeGitCommand(currentState: GitState, rawCommand: string): CommandResult {
  const trimmed = rawCommand.trim();
  if (!trimmed) {
    return { state: currentState, output: '', type: 'output' };
  }

  // Handle non-git basic terminal helper commands
  if (trimmed === 'clear') {
    return { state: currentState, output: '__CLEAR__', type: 'info' };
  }
  if (trimmed === 'help') {
    return {
      state: currentState,
      output: `Kullanılabilir Git Komutları:
  git status                  - Çalışma ağacı durumunu gösterir
  git add <dosya> | .         - Dosyaları hazırlık alanına (stage) ekler
  git commit -m "mesaj"       - Değişiklikleri yeni bir commit olarak kaydeder
  git branch [isim]           - Dalları listeler veya yeni dal açar
  git branch -d <isim>        - Dalı siler
  git checkout <dal|hash>     - Belirtilen dala veya commite geçer
  git checkout -b <isim>      - Yeni dal açıp hemen o dala geçer
  git switch <dal>            - Belirtilen dala geçiş yapar (-c ile yeni dal)
  git merge <dal>             - Hedef dalı mevcut dala birleştirir
  git push [remote] [dal]     - Yerel commitleri uzak depoya (remote) yükler
  git pull [remote] [dal]     - Uzak depodaki commitleri çeker ve birleştirir
  git log [--oneline]         - Commit geçmişini listeler
  git diff [--staged]         - Dosya değişikliklerini gösterir
  git stash [pop|list]        - Değişiklikleri geçici olarak rafa kaldırır
  git reset [--hard|--soft]   - Geçerli dalı geriye alır
  git remote -v               - Tanımlı uzak depoları gösterir
  git tag <etiket>            - Mevcut commite versiyon etiketi koyar
  touch <dosya> / rm <dosya>  - Dosya oluşturur veya siler
  ls / cat <dosya>            - Dosyaları listeler veya içeriğini okur`,
      type: 'info',
    };
  }

  if (trimmed === 'ls') {
    const list = Object.keys(currentState.files).join('    ');
    return { state: currentState, output: list || '(dizin boş)', type: 'output' };
  }

  if (trimmed.startsWith('touch ')) {
    const filename = trimmed.replace('touch ', '').trim();
    if (!filename) {
      return { state: currentState, output: 'touch: dosya adı eksik', type: 'error' };
    }
    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    if (!nextState.files[filename]) {
      nextState.files[filename] = {
        path: filename,
        name: filename,
        language: filename.endsWith('.js') ? 'javascript' : filename.endsWith('.css') ? 'css' : filename.endsWith('.html') ? 'html' : 'markdown',
        content: `// Yeni oluşturulan dosya: ${filename}\n`,
        status: 'untracked',
      };
      return { state: nextState, output: `'${filename}' dosyası oluşturuldu (untracked).`, type: 'success' };
    }
    return { state: currentState, output: `'${filename}' zaten mevcut.`, type: 'info' };
  }

  if (trimmed.startsWith('rm ')) {
    const filename = trimmed.replace('rm ', '').trim();
    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    if (nextState.files[filename]) {
      if (nextState.files[filename].status === 'committed') {
        nextState.files[filename].status = 'deleted';
        nextState.files[filename].content = '';
      } else {
        delete nextState.files[filename];
      }
      return { state: nextState, output: `'${filename}' silindi.`, type: 'output' };
    }
    return { state: currentState, output: `rm: '${filename}' bulunamadı`, type: 'error' };
  }

  if (trimmed.startsWith('cat ')) {
    const filename = trimmed.replace('cat ', '').trim();
    const file = currentState.files[filename];
    if (file) {
      return { state: currentState, output: file.content || '(dosya boş)', type: 'output' };
    }
    return { state: currentState, output: `cat: ${filename}: Böyle bir dosya veya dizin yok`, type: 'error' };
  }

  if (!trimmed.startsWith('git')) {
    return {
      state: currentState,
      output: `komut bulunamadı: '${trimmed}'. Komutların başına 'git' yazmayı deneyin veya 'help' yazın.`,
      type: 'error',
    };
  }

  const parts = trimmed.split(/\s+/);
  const gitCmd = parts[1];

  if (!gitCmd) {
    return {
      state: currentState,
      output: `kullanım: git [--version] [--help] <komut> [<args>]`,
      type: 'output',
    };
  }

  // --- GIT INIT ---
  if (gitCmd === 'init') {
    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    nextState.isInitialized = true;
    return {
      state: nextState,
      output: `Mevcut Git deposu /app/proje/.git/ içinde başlatıldı`,
      type: 'success',
    };
  }

  // --- GIT STATUS ---
  if (gitCmd === 'status') {
    const head = currentState.head;
    const branchName = head.type === 'branch' ? head.name : `HEAD detached at ${head.commitId.slice(0, 7)}`;
    const remoteRef = currentState.remotes.origin?.branches[head.name || ''];
    let syncInfo = '';

    if (head.type === 'branch' && remoteRef) {
      // Calculate commits ahead/behind
      const currentCommit = currentState.commits[head.commitId];
      if (head.commitId === remoteRef) {
        syncInfo = `Dalınız 'origin/${head.name}' ile güncel.`;
      } else {
        syncInfo = `Dalınız 'origin/${head.name}' dalından 1 commit ileride.\n  (yerel commitlerinizi yayınlamak için "git push" kullanın)`;
      }
    }

    const stagedFiles = Object.values(currentState.files).filter(f => f.status === 'staged');
    const modifiedFiles = Object.values(currentState.files).filter(f => f.status === 'modified');
    const untrackedFiles = Object.values(currentState.files).filter(f => f.status === 'untracked');
    const deletedFiles = Object.values(currentState.files).filter(f => f.status === 'deleted');

    let out = `On branch ${branchName}\n`;
    if (syncInfo) out += `${syncInfo}\n\n`;

    if (stagedFiles.length > 0) {
      out += `Commit için hazır bekleyen değişiklikler:\n  (hazırlıktan çıkarmak için "git restore --staged <dosya>..." kullanın)\n`;
      stagedFiles.forEach(f => {
        out += `\t[staged]  ${f.path}\n`;
      });
      out += '\n';
    }

    if (modifiedFiles.length > 0 || deletedFiles.length > 0) {
      out += `Commit için hazırlanmamış değişiklikler:\n  (hazırlık alanına eklemek için "git add <dosya>..." kullanın)\n`;
      modifiedFiles.forEach(f => {
        out += `\t[modified]  ${f.path}\n`;
      });
      deletedFiles.forEach(f => {
        out += `\t[deleted]   ${f.path}\n`;
      });
      out += '\n';
    }

    if (untrackedFiles.length > 0) {
      out += `Takip edilmeyen dosyalar:\n  (dahil etmek için "git add <dosya>..." kullanın)\n`;
      untrackedFiles.forEach(f => {
        out += `\t[untracked] ${f.path}\n`;
      });
      out += '\n';
    }

    if (stagedFiles.length === 0 && modifiedFiles.length === 0 && untrackedFiles.length === 0 && deletedFiles.length === 0) {
      out += `çalışma ağacı temiz, commit edilecek bir şey yok`;
    }

    return { state: currentState, output: out.trim(), type: 'output' };
  }

  // --- GIT ADD ---
  if (gitCmd === 'add') {
    const target = parts.slice(2).join(' ').trim();
    if (!target) {
      return { state: currentState, output: `Hiçbir şey belirtilmedi, hiçbir şey eklenmedi.\nBelki 'git add .' demek istediniz?`, type: 'error' };
    }

    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    let addedCount = 0;

    if (target === '.' || target === '-A' || target === '*') {
      Object.keys(nextState.files).forEach(path => {
        const file = nextState.files[path];
        if (file.status === 'modified' || file.status === 'untracked' || file.status === 'deleted') {
          file.stagedContent = file.content;
          file.status = 'staged';
          addedCount++;
        }
      });
    } else {
      const paths = target.split(/\s+/);
      for (const p of paths) {
        if (nextState.files[p]) {
          nextState.files[p].stagedContent = nextState.files[p].content;
          nextState.files[p].status = 'staged';
          addedCount++;
        } else {
          return { state: currentState, output: `fatal: pathspec '${p}' herhangi bir dosya ile eşleşmedi`, type: 'error' };
        }
      }
    }

    return {
      state: nextState,
      output: addedCount > 0 ? `${addedCount} dosya hazırlık alanına (stage) eklendi.` : 'Eklenecek yeni değişiklik yok.',
      type: 'success',
    };
  }

  // --- GIT COMMIT ---
  if (gitCmd === 'commit') {
    // Check flags: -m "message" or -am "message"
    const isAll = parts.includes('-am') || parts.includes('-a');
    let message = '';
    const mIndex = parts.indexOf('-m');
    const amIndex = parts.indexOf('-am');

    if (mIndex !== -1 || amIndex !== -1) {
      const match = trimmed.match(/-a?m\s+["'](.*?)["']/);
      if (match) {
        message = match[1];
      } else {
        const flagIdx = mIndex !== -1 ? mIndex : amIndex;
        message = parts.slice(flagIdx + 1).join(' ').replace(/^["']|["']$/g, '');
      }
    }

    if (!message) {
      return {
        state: currentState,
        output: `error: Commit mesajı boş olamaz. Örnek: git commit -m "feat: yeni özellik"`,
        type: 'error',
      };
    }

    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;

    if (isAll) {
      // Auto-stage modified files
      Object.keys(nextState.files).forEach(p => {
        if (nextState.files[p].status === 'modified') {
          nextState.files[p].status = 'staged';
          nextState.files[p].stagedContent = nextState.files[p].content;
        }
      });
    }

    const staged = Object.values(nextState.files).filter(f => f.status === 'staged');
    if (staged.length === 0) {
      return {
        state: currentState,
        output: `On branch ${currentState.head.name || 'HEAD'}\nCommit için hazırlanmış hiçbir değişiklik yok ("git add" kullanın)`,
        type: 'error',
      };
    }

    // Build snapshot of files
    const snapshot: Record<string, string> = {};
    Object.keys(nextState.files).forEach(path => {
      const file = nextState.files[path];
      if (file.status === 'staged') {
        file.headContent = file.content;
        file.status = 'committed';
        snapshot[path] = file.content;
      } else if (file.status === 'committed') {
        snapshot[path] = file.content;
      }
    });

    const newCommitId = createHash();
    const parentId = nextState.head.commitId;
    const branchName = nextState.head.name || 'HEAD (detached)';

    const newCommit: GitCommit = {
      id: newCommitId,
      shortId: newCommitId,
      message,
      author: 'Enes Öztürk',
      email: 'enes@ozturk.dev',
      timestamp: 'Az önce',
      parents: parentId ? [parentId] : [],
      branchName,
      filesSnapshot: snapshot,
    };

    nextState.commits[newCommitId] = newCommit;
    if (nextState.head.type === 'branch' && nextState.head.name) {
      nextState.branches[nextState.head.name] = newCommitId;
    }
    nextState.head.commitId = newCommitId;

    return {
      state: nextState,
      output: `[${branchName} ${newCommitId}] ${message}\n ${staged.length} dosya değiştirildi, commit başarıyla oluşturuldu.`,
      type: 'success',
    };
  }

  // --- GIT BRANCH ---
  if (gitCmd === 'branch') {
    const isDelete = parts.includes('-d') || parts.includes('-D');
    const isAll = parts.includes('-a');

    if (isDelete) {
      const flagIdx = parts.indexOf('-d') !== -1 ? parts.indexOf('-d') : parts.indexOf('-D');
      const branchToDelete = parts[flagIdx + 1];
      if (!branchToDelete) {
        return { state: currentState, output: 'fatal: silinecek dal adı belirtilmedi', type: 'error' };
      }
      if (currentState.head.type === 'branch' && currentState.head.name === branchToDelete) {
        return {
          state: currentState,
          output: `error: '${branchToDelete}' dalı şu an aktif olduğu için silinemez. Önce başka bir dala geçin.`,
          type: 'error',
        };
      }
      if (!currentState.branches[branchToDelete]) {
        return { state: currentState, output: `error: '${branchToDelete}' adlı dal bulunamadı.`, type: 'error' };
      }

      const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
      delete nextState.branches[branchToDelete];
      return {
        state: nextState,
        output: `'${branchToDelete}' dalı başarıyla silindi.`,
        type: 'success',
      };
    }

    const branchArg = parts[2];
    if (branchArg && !branchArg.startsWith('-')) {
      // Create new branch
      if (currentState.branches[branchArg]) {
        return { state: currentState, output: `fatal: '${branchArg}' isimli bir dal zaten mevcut.`, type: 'error' };
      }
      const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
      nextState.branches[branchArg] = nextState.head.commitId;
      return {
        state: nextState,
        output: `'${branchArg}' dalı ${nextState.head.commitId.slice(0, 7)} commitinde oluşturuldu.`,
        type: 'success',
      };
    }

    // List branches
    let output = '';
    Object.keys(currentState.branches).forEach(b => {
      const isCurrent = currentState.head.type === 'branch' && currentState.head.name === b;
      output += `${isCurrent ? '* ' : '  '}${b}\n`;
    });

    if (isAll) {
      Object.keys(currentState.remotes.origin?.branches || {}).forEach(rb => {
        output += `  remotes/origin/${rb}\n`;
      });
    }

    return { state: currentState, output: output.trim(), type: 'output' };
  }

  // --- GIT CHECKOUT / SWITCH ---
  if (gitCmd === 'checkout' || gitCmd === 'switch') {
    const isNewBranch = parts.includes('-b') || parts.includes('-c');
    let target = '';

    if (isNewBranch) {
      const flagIdx = parts.indexOf('-b') !== -1 ? parts.indexOf('-b') : parts.indexOf('-c');
      target = parts[flagIdx + 1];
      if (!target) {
        return { state: currentState, output: 'fatal: yeni dal için bir isim belirtmelisiniz', type: 'error' };
      }
      if (currentState.branches[target]) {
        return { state: currentState, output: `fatal: '${target}' isimli bir dal zaten var.`, type: 'error' };
      }

      const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
      nextState.branches[target] = nextState.head.commitId;
      nextState.head = {
        type: 'branch',
        name: target,
        commitId: nextState.head.commitId,
      };

      return {
        state: nextState,
        output: `Yeni '${target}' dalına geçildi`,
        type: 'success',
      };
    }

    target = parts[2];
    if (!target) {
      return { state: currentState, output: 'fatal: geçilecek bir dal veya commit hash belirtmelisiniz', type: 'error' };
    }

    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;

    // Check if target is a branch
    if (nextState.branches[target]) {
      const commitId = nextState.branches[target];
      nextState.head = {
        type: 'branch',
        name: target,
        commitId,
      };
      // Restore files from that commit's snapshot
      const targetCommit = nextState.commits[commitId];
      if (targetCommit?.filesSnapshot) {
        Object.keys(targetCommit.filesSnapshot).forEach(path => {
          if (nextState.files[path]) {
            nextState.files[path].content = targetCommit.filesSnapshot[path];
            nextState.files[path].headContent = targetCommit.filesSnapshot[path];
            nextState.files[path].status = 'committed';
          }
        });
      }
      return {
        state: nextState,
        output: `'${target}' dalına geçildi`,
        type: 'success',
      };
    }

    // Check if target is a commit hash
    const matchingCommit = Object.values(nextState.commits).find(
      c => c.id.startsWith(target) || c.shortId.startsWith(target)
    );
    if (matchingCommit) {
      nextState.head = {
        type: 'detached',
        commitId: matchingCommit.id,
      };
      // Restore files
      if (matchingCommit.filesSnapshot) {
        Object.keys(matchingCommit.filesSnapshot).forEach(path => {
          if (nextState.files[path]) {
            nextState.files[path].content = matchingCommit.filesSnapshot[path];
            nextState.files[path].headContent = matchingCommit.filesSnapshot[path];
            nextState.files[path].status = 'committed';
          }
        });
      }
      return {
        state: nextState,
        output: `Not: '${matchingCommit.shortId}' commitine geçildi (detached HEAD durumu).\nBurada denemeler yapabilir ve commitler atabilirsiniz. Ancak yeni bir dala bağlamazsanız commitler kaybolabilir.`,
        type: 'info',
      };
    }

    return {
      state: currentState,
      output: `error: pathspec '${target}' herhangi bir dal veya commit ile eşleşmedi`,
      type: 'error',
    };
  }

  // --- GIT MERGE ---
  if (gitCmd === 'merge') {
    const targetBranch = parts[2];
    if (!targetBranch) {
      return { state: currentState, output: 'fatal: Birleştirilecek dal belirtilmedi. Örnek: git merge feature/auth', type: 'error' };
    }
    if (!currentState.branches[targetBranch]) {
      return { state: currentState, output: `merge: ${targetBranch} - böyle bir dal yok`, type: 'error' };
    }

    const currentBranchName = currentState.head.name;
    if (!currentBranchName) {
      return { state: currentState, output: 'fatal: Detached HEAD durumunda merge yapılamaz. Önce bir dala geçin.', type: 'error' };
    }
    if (currentBranchName === targetBranch) {
      return { state: currentState, output: 'Zaten bu daldasınız, birleştirme yapılamaz.', type: 'info' };
    }

    const currentCommitId = currentState.branches[currentBranchName];
    const incomingCommitId = currentState.branches[targetBranch];

    if (currentCommitId === incomingCommitId) {
      return { state: currentState, output: 'Zaten güncel (Already up to date).', type: 'info' };
    }

    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    const incomingCommit = nextState.commits[incomingCommitId];
    const currentCommit = nextState.commits[currentCommitId];

    // Check if Fast-Forward is possible:
    // If currentCommitId is direct parent of incomingCommitId
    const isFastForward = incomingCommit?.parents.includes(currentCommitId);

    if (isFastForward) {
      nextState.branches[currentBranchName] = incomingCommitId;
      nextState.head.commitId = incomingCommitId;
      // sync snapshot
      if (incomingCommit?.filesSnapshot) {
        Object.keys(incomingCommit.filesSnapshot).forEach(p => {
          if (nextState.files[p]) {
            nextState.files[p].content = incomingCommit.filesSnapshot[p];
            nextState.files[p].headContent = incomingCommit.filesSnapshot[p];
            nextState.files[p].status = 'committed';
          }
        });
      }
      return {
        state: nextState,
        output: `Updating ${currentCommitId.slice(0, 7)}..${incomingCommitId.slice(0, 7)}\nFast-forward\n '${targetBranch}' başarıyla birleştirildi (Fast-Forward).`,
        type: 'success',
      };
    }

    // Check for conflict scenario (e.g. preset conflict)
    const hasConflict =
      (targetBranch.includes('conflict') || targetBranch.includes('redesign') || targetBranch.includes('header')) &&
      currentCommit?.filesSnapshot?.['index.html'] !== incomingCommit?.filesSnapshot?.['index.html'];

    if (hasConflict) {
      const conflictState: GitConflictState = {
        incomingBranch: targetBranch,
        targetBranch: currentBranchName,
        incomingCommitId,
        files: [
          {
            path: 'index.html',
            baseContent: currentState.commits[currentCommit.parents[0] || '']?.filesSnapshot?.['index.html'] || '',
            currentContent: currentCommit?.filesSnapshot?.['index.html'] || '',
            incomingContent: incomingCommit?.filesSnapshot?.['index.html'] || '',
            isResolved: false,
          },
        ],
      };
      nextState.conflict = conflictState;

      // Add conflict markers to file
      if (nextState.files['index.html']) {
        nextState.files['index.html'].content = `<<<<<<< HEAD (${currentBranchName})\n${currentCommit?.filesSnapshot?.['index.html'] || ''}\n=======\n${incomingCommit?.filesSnapshot?.['index.html'] || ''}\n>>>>>>> ${targetBranch}`;
        nextState.files['index.html'].status = 'modified';
      }

      return {
        state: nextState,
        output: `Otomatik birleştirme başarısız oldu; çakışmaları düzeltin ve ardından sonucu commit edin.\nKONFLİKT (içerik): index.html içinde merge çakışması!\n\nLütfen görsel Çakışma Çözücüyü (Conflict Resolver) kullanarak veya dosyayı düzenleyip 'git add' & 'git commit' ile çözün.`,
        type: 'error',
      };
    }

    // 3-way merge commit with dual parents
    const mergeCommitId = createHash();
    const mergedSnapshot = {
      ...(currentCommit?.filesSnapshot || {}),
      ...(incomingCommit?.filesSnapshot || {}),
    };

    const mergeCommit: GitCommit = {
      id: mergeCommitId,
      shortId: mergeCommitId,
      message: `Merge branch '${targetBranch}' into ${currentBranchName}`,
      author: 'Enes Öztürk',
      email: 'enes@ozturk.dev',
      timestamp: 'Az önce',
      parents: [currentCommitId, incomingCommitId],
      branchName: currentBranchName,
      filesSnapshot: mergedSnapshot,
    };

    nextState.commits[mergeCommitId] = mergeCommit;
    nextState.branches[currentBranchName] = mergeCommitId;
    nextState.head.commitId = mergeCommitId;

    return {
      state: nextState,
      output: `Merge made by the 'ort' strategy.\n[${currentBranchName} ${mergeCommitId}] Merge branch '${targetBranch}' into ${currentBranchName}`,
      type: 'success',
    };
  }

  // --- GIT PUSH ---
  if (gitCmd === 'push') {
    const currentBranch = currentState.head.name;
    if (!currentBranch) {
      return { state: currentState, output: 'fatal: Detached HEAD durumunda push yapılamaz.', type: 'error' };
    }

    const currentCommitId = currentState.head.commitId;
    const remoteBranchId = currentState.remotes.origin?.branches[currentBranch];

    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    if (!nextState.remotes.origin) {
      return { state: currentState, output: 'fatal: Tanımlı bir uzak depo (remote origin) bulunamadı.', type: 'error' };
    }

    nextState.remotes.origin.branches[currentBranch] = currentCommitId;

    const isNew = !remoteBranchId;
    const range = remoteBranchId ? `${remoteBranchId.slice(0, 7)}..${currentCommitId.slice(0, 7)}` : `* [yeni dal]`;

    return {
      state: nextState,
      output: `Nesneler numaralandırılıyor: 5, tamamlandı.\nNesneler yazılıyor: 100% (5/5), 620 bayt, tamamlandı.\nToplam 5 (fark 2), yeniden kullanılan 0 (fark 0)\nTo https://github.com/enes-ozturk/git-cli-proje.git\n   ${range} ${currentBranch} -> ${currentBranch}\nDal '${currentBranch}' uzak depoyla başarıyla eşitlendi.`,
      type: 'success',
    };
  }

  // --- GIT PULL ---
  if (gitCmd === 'pull') {
    const currentBranch = currentState.head.name;
    if (!currentBranch) {
      return { state: currentState, output: 'fatal: Detached HEAD durumunda pull yapılamaz.', type: 'error' };
    }

    const remoteCommitId = currentState.remotes.origin?.branches[currentBranch];
    if (!remoteCommitId || remoteCommitId === currentState.head.commitId) {
      return { state: currentState, output: 'Zaten güncel (Already up to date).', type: 'info' };
    }

    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    nextState.branches[currentBranch] = remoteCommitId;
    nextState.head.commitId = remoteCommitId;

    return {
      state: nextState,
      output: `Updating ${currentState.head.commitId.slice(0, 7)}..${remoteCommitId.slice(0, 7)}\nFast-forward\n 2 dosya güncellendi, 8 satır eklendi (+).`,
      type: 'success',
    };
  }

  // --- GIT FETCH ---
  if (gitCmd === 'fetch') {
    return {
      state: currentState,
      output: `From https://github.com/enes-ozturk/git-cli-proje\n * [güncel]            main       -> origin/main`,
      type: 'info',
    };
  }

  // --- GIT LOG ---
  if (gitCmd === 'log') {
    const isOneLine = parts.includes('--oneline');
    const headCommitId = currentState.head.commitId;

    // Traverse ancestors
    const visited = new Set<string>();
    const commitList: GitCommit[] = [];
    const queue = [headCommitId];

    while (queue.length > 0 && commitList.length < 15) {
      const cid = queue.shift()!;
      if (!cid || visited.has(cid)) continue;
      visited.add(cid);
      const commit = currentState.commits[cid];
      if (commit) {
        commitList.push(commit);
        commit.parents.forEach(p => {
          if (!visited.has(p)) queue.push(p);
        });
      }
    }

    let out = '';
    commitList.forEach(c => {
      // Find branch pointers at this commit
      const pointers: string[] = [];
      if (currentState.head.commitId === c.id) {
        if (currentState.head.type === 'branch') {
          pointers.push(`HEAD -> ${currentState.head.name}`);
        } else {
          pointers.push(`HEAD (detached)`);
        }
      }
      Object.entries(currentState.branches).forEach(([bName, bId]) => {
        if (bId === c.id && currentState.head.name !== bName) {
          pointers.push(bName);
        }
      });
      Object.entries(currentState.remotes.origin?.branches || {}).forEach(([rbName, rbId]) => {
        if (rbId === c.id) {
          pointers.push(`origin/${rbName}`);
        }
      });
      if (c.tag) {
        pointers.push(`tag: ${c.tag}`);
      }

      const pointerStr = pointers.length > 0 ? ` (${pointers.join(', ')})` : '';

      if (isOneLine) {
        out += `${c.shortId}${pointerStr} ${c.message}\n`;
      } else {
        out += `commit ${c.id}${pointerStr}\n`;
        if (c.parents.length > 1) {
          out += `Merge: ${c.parents.map(p => p.slice(0, 7)).join(' ')}\n`;
        }
        out += `Author: ${c.author} <${c.email}>\n`;
        out += `Date:   ${c.timestamp}\n\n    ${c.message}\n\n`;
      }
    });

    return { state: currentState, output: out.trim(), type: 'output' };
  }

  // --- GIT DIFF ---
  if (gitCmd === 'diff') {
    const isStaged = parts.includes('--staged') || parts.includes('--cached');
    let diffOut = '';

    Object.values(currentState.files).forEach(file => {
      if (isStaged && file.status === 'staged') {
        diffOut += `diff --git a/${file.path} b/${file.path}\nindex 8a1b2c..3d4e5f 100644\n--- a/${file.path}\n+++ b/${file.path}\n@@ -1,5 +1,6 @@\n+ ${file.content.slice(0, 100)}...\n\n`;
      } else if (!isStaged && (file.status === 'modified' || file.status === 'untracked')) {
        diffOut += `diff --git a/${file.path} b/${file.path}\n--- a/${file.path}\n+++ b/${file.path}\n@@ değişiklikler @@\n+ (Değiştirilen çalışma alanı içeriği)\n\n`;
      }
    });

    return {
      state: currentState,
      output: diffOut.trim() || 'Farklılık bulunamadı (çalışma ağacı temiz).',
      type: 'output',
    };
  }

  // --- GIT STASH ---
  if (gitCmd === 'stash') {
    const subCmd = parts[2] || 'push';

    if (subCmd === 'list') {
      if (currentState.stashes.length === 0) {
        return { state: currentState, output: 'Stash listesi boş.', type: 'info' };
      }
      const list = currentState.stashes.map(s => `stash@{${s.index}}: ${s.message} on ${s.branch} (${s.timestamp})`).join('\n');
      return { state: currentState, output: list, type: 'output' };
    }

    if (subCmd === 'pop' || subCmd === 'apply') {
      if (currentState.stashes.length === 0) {
        return { state: currentState, output: 'error: Uygulanacak stash bulunamadı.', type: 'error' };
      }
      const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
      const popped = nextState.stashes[0];
      if (subCmd === 'pop') {
        nextState.stashes.shift();
        nextState.stashes.forEach((s, idx) => (s.index = idx));
      }

      // Restore files
      Object.entries(popped.files).forEach(([path, data]) => {
        if (nextState.files[path]) {
          nextState.files[path].content = data.content;
          nextState.files[path].status = data.status;
        }
      });

      return {
        state: nextState,
        output: `'${popped.message}' stash içeriği çalışma alanına geri yüklendi.`,
        type: 'success',
      };
    }

    if (subCmd === 'clear') {
      const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
      nextState.stashes = [];
      return { state: nextState, output: 'Tüm stashler temizlendi.', type: 'info' };
    }

    // Default: stash push
    const modified = Object.values(currentState.files).filter(f => f.status === 'modified' || f.status === 'staged');
    if (modified.length === 0) {
      return { state: currentState, output: 'Kaydedilecek yerel değişiklik yok.', type: 'info' };
    }

    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    const stashMap: Record<string, { content: string; status: any }> = {};

    modified.forEach(f => {
      stashMap[f.path] = { content: f.content, status: f.status };
      // Reset file to headContent
      f.content = f.headContent || f.content;
      f.status = 'committed';
    });

    const newStash: GitStashItem = {
      id: createHash(),
      index: 0,
      message: `WIP on ${currentState.head.name || 'HEAD'}: ${new Date().toLocaleTimeString()}`,
      branch: currentState.head.name || 'HEAD',
      timestamp: 'Az önce',
      files: stashMap,
    };

    nextState.stashes.unshift(newStash);
    nextState.stashes.forEach((s, idx) => (s.index = idx));

    return {
      state: nextState,
      output: `Kayıtlı çalışma dizini ve indeks durumu WIP on ${newStash.branch}: ${newStash.id}`,
      type: 'success',
    };
  }

  // --- GIT RESET ---
  if (gitCmd === 'reset') {
    const isHard = parts.includes('--hard');
    const isSoft = parts.includes('--soft');
    const targetIdx = parts.findIndex(p => p !== 'git' && p !== 'reset' && !p.startsWith('--'));
    const target = targetIdx !== -1 ? parts[targetIdx] : 'HEAD';

    let targetCommitId = currentState.head.commitId;
    if (target === 'HEAD~1') {
      const currentCommit = currentState.commits[currentState.head.commitId];
      if (currentCommit && currentCommit.parents.length > 0) {
        targetCommitId = currentCommit.parents[0];
      }
    } else if (currentState.commits[target]) {
      targetCommitId = target;
    }

    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    if (nextState.head.type === 'branch' && nextState.head.name) {
      nextState.branches[nextState.head.name] = targetCommitId;
    }
    nextState.head.commitId = targetCommitId;

    if (isHard) {
      const targetCommit = nextState.commits[targetCommitId];
      if (targetCommit?.filesSnapshot) {
        Object.keys(targetCommit.filesSnapshot).forEach(p => {
          if (nextState.files[p]) {
            nextState.files[p].content = targetCommit.filesSnapshot[p];
            nextState.files[p].headContent = targetCommit.filesSnapshot[p];
            nextState.files[p].status = 'committed';
          }
        });
      }
      return {
        state: nextState,
        output: `HEAD şimdi ${targetCommitId.slice(0, 7)} konumunda (Hard reset: değişiklikler sıfırlandı)`,
        type: 'success',
      };
    }

    if (isSoft) {
      return {
        state: nextState,
        output: `HEAD şimdi ${targetCommitId.slice(0, 7)} konumunda (Soft reset: değişiklikler staged olarak korundu)`,
        type: 'success',
      };
    }

    // Mixed reset: unstage
    Object.values(nextState.files).forEach(f => {
      if (f.status === 'staged') {
        f.status = 'modified';
      }
    });

    return {
      state: nextState,
      output: `Unstaged changes after reset:\nM\tindex.html\nHEAD şimdi ${targetCommitId.slice(0, 7)} konumunda`,
      type: 'success',
    };
  }

  // --- GIT REMOTE ---
  if (gitCmd === 'remote') {
    if (parts.includes('-v')) {
      return {
        state: currentState,
        output: `origin  https://github.com/enes-ozturk/git-cli-proje.git (fetch)\norigin  https://github.com/enes-ozturk/git-cli-proje.git (push)`,
        type: 'output',
      };
    }
    return { state: currentState, output: 'origin', type: 'output' };
  }

  // --- GIT TAG ---
  if (gitCmd === 'tag') {
    const tagName = parts[2];
    if (!tagName) {
      const tags = Object.values(currentState.commits)
        .filter(c => c.tag)
        .map(c => c.tag);
      return { state: currentState, output: tags.join('\n') || 'Tanımlı etiket yok.', type: 'output' };
    }

    const nextState = JSON.parse(JSON.stringify(currentState)) as GitState;
    if (nextState.commits[nextState.head.commitId]) {
      nextState.commits[nextState.head.commitId].tag = tagName;
    }
    return {
      state: nextState,
      output: `'${tagName}' etiketi ${nextState.head.commitId.slice(0, 7)} commitine eklendi.`,
      type: 'success',
    };
  }

  return {
    state: currentState,
    output: `git: '${gitCmd}' geçerli bir git komutu değil. 'help' yazarak komut listesini görebilirsiniz.`,
    type: 'error',
  };
}
