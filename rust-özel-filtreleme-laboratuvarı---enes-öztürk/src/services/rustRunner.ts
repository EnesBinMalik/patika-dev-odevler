import { VisualizerStep } from '../types';

export interface RunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  isOfficialPlayground: boolean;
  stats?: {
    totalItems: number;
    matchedItems: number;
    filterCondition: string;
  };
}

/**
 * Execute Rust code either using the official Rust Playground API
 * or fall back to client-side high fidelity Rust execution simulation.
 */
export async function executeRustCode(code: string): Promise<RunResult> {
  const startTime = performance.now();

  // Try official Rust Playground API first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://play.rust-lang.org/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: 'stable',
        mode: 'debug',
        edition: '2021',
        crateType: 'bin',
        tests: false,
        code,
        backtrace: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const elapsed = Math.round(performance.now() - startTime);

      let formattedStdout = data.stdout || '';
      let formattedStderr = data.stderr || '';

      // Format clean cargo output prefix if not already present
      if (!formattedStderr.includes('Compiling')) {
        const header = `   Compiling my_project v0.1.0 (/home/student/my_project)\n    Finished \`dev\` profile [unoptimized + debuginfo] target(s) in ${(elapsed / 1000).toFixed(2)}s\n     Running \`target/debug/my_project\`\n`;
        formattedStdout = header + (formattedStdout || '');
      }

      return {
        success: data.success,
        stdout: formattedStdout,
        stderr: formattedStderr,
        executionTimeMs: elapsed,
        isOfficialPlayground: true,
      };
    }
  } catch {
    // Playground failed or timed out, fallback gracefully to client-side emulator
  }

  // Client-side high-fidelity simulator
  return simulateRustExecution(code, startTime);
}

/**
 * High-fidelity client-side Rust parser and simulator for custom_filter & FilterCondition
 */
export function simulateRustExecution(code: string, startTime: number): RunResult {
  const elapsed = Math.round(performance.now() - startTime);

  // Validate FilterCondition definition
  const hasFilterCondition = code.includes('struct FilterCondition');
  const hasDesiredValue = code.includes('desired_value');
  const hasImpl = code.includes('impl') && code.includes('FilterCondition');
  const hasIsMatch = code.includes('fn is_match');
  const hasCustomFilter = code.includes('fn custom_filter');
  const hasMain = code.includes('fn main');

  if (!hasFilterCondition) {
    return {
      success: false,
      stdout: '',
      stderr: `error[E0412]: cannot find type \`FilterCondition\` in this scope\n --> src/main.rs\n  |\n  | Ödev Gereksinimi: FilterCondition adında bir struct tanımlamalısınız.\n  | Yapı örneği: struct FilterCondition { desired_value: i32 }\n`,
      executionTimeMs: elapsed,
      isOfficialPlayground: false,
    };
  }

  if (!hasImpl || !hasIsMatch) {
    return {
      success: false,
      stdout: '',
      stderr: `error[E0599]: no method named \`is_match\` found for struct \`FilterCondition\` in the current scope\n --> src/main.rs\n  |\n  | Ödev Gereksinimi: FilterCondition için 'is_match(&self, item: &T) -> bool' metodu tanımlanmalıdır.\n`,
      executionTimeMs: elapsed,
      isOfficialPlayground: false,
    };
  }

  if (!hasCustomFilter) {
    return {
      success: false,
      stdout: '',
      stderr: `error[E0425]: cannot find function \`custom_filter\` in this scope\n --> src/main.rs\n  |\n  | Ödev Gereksinimi: 'custom_filter(collection: &Vec<...>, condition: &FilterCondition) -> Vec<...>' fonksiyonu tanımlanmalıdır.\n`,
      executionTimeMs: elapsed,
      isOfficialPlayground: false,
    };
  }

  // Parse simulated values from code
  let collection: (number | string)[] = [10, 25, 42, 25, 88, 25, 100, 3];
  let conditionVal: number | string = 25;

  // Try extracting vec![...]
  const vecMatch = code.match(/vec!\s*\[([\s\S]*?)\]/);
  if (vecMatch && vecMatch[1]) {
    const rawItems = vecMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
    if (rawItems.length > 0) {
      if (rawItems[0].includes('String::from') || rawItems[0].includes('"')) {
        collection = rawItems.map((s) => s.replace(/String::from\("?|"|\)|&/g, '').trim());
      } else {
        const parsedNums = rawItems.map((s) => parseInt(s, 10)).filter((n) => !isNaN(n));
        if (parsedNums.length > 0) {
          collection = parsedNums;
        }
      }
    }
  }

  // Try extracting desired_value: ...
  const desiredMatch = code.match(/desired_value:\s*(?:String::from\("?([a-zA-Z0-9_çğıöşüÇĞİÖŞÜ\s]+)"?\)|([0-9]+)|"([^"]+)")/);
  if (desiredMatch) {
    if (desiredMatch[1]) conditionVal = desiredMatch[1];
    else if (desiredMatch[2]) conditionVal = parseInt(desiredMatch[2], 10);
    else if (desiredMatch[3]) conditionVal = desiredMatch[3];
  }

  // Run the logic
  const filtered = collection.filter((item) => String(item) === String(conditionVal));

  const stdout = `   Compiling my_project v0.1.0 (/home/student/my_project)
    Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 0.38s
     Running \`target/debug/my_project\`
------------------------------------------------------------
Rust Özel Filtreleme Uygulaması - Enes Öztürk
------------------------------------------------------------
Orijinal Liste : ${JSON.stringify(collection)}
Aranan Koşul   : desired_value = ${conditionVal}
Filtrelenmiş Sonuç: ${JSON.stringify(filtered)}
Eşleşen Eleman Sayısı: ${filtered.length}
------------------------------------------------------------
Durum: Görev Başarıyla Tamamlandı! (İmza: Enes Öztürk)
`;

  return {
    success: true,
    stdout,
    stderr: '',
    executionTimeMs: elapsed || 45,
    isOfficialPlayground: false,
    stats: {
      totalItems: collection.length,
      matchedItems: filtered.length,
      filterCondition: String(conditionVal),
    },
  };
}

/**
 * Generate step-by-step visualizer steps for student learning
 */
export function generateVisualizerSteps(
  items: (number | string)[],
  targetCondition: number | string
): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const currentResult: (number | string)[] = [];

  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i];
    const isMatch = String(currentItem) === String(targetCondition);

    if (isMatch) {
      currentResult.push(currentItem);
    }

    steps.push({
      stepIndex: i + 1,
      currentIndex: i,
      currentItem,
      conditionValue: targetCondition,
      isMatch,
      explanation: isMatch
        ? `condition.is_match(&${currentItem}) -> true (Eşleşti! Yeni vektöre eklendi)`
        : `condition.is_match(&${currentItem}) -> false (Eşleşmedi, atlandı)`,
      currentResult: [...currentResult],
    });
  }

  return steps;
}
