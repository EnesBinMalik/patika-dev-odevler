/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StepAction {
  id: string;
  timestamp: number;
  type: 'INIT' | 'ADD' | 'REMOVE' | 'SET' | 'GET' | 'RESIZE' | 'CLEAR' | 'INDEX_OF' | 'LAST_INDEX_OF' | 'CONTAINS' | 'SUBLIST';
  description: string;
  details?: string;
  affectedIndex?: number | number[];
  scannedIndices?: number[];
  oldCapacity?: number;
  newCapacity?: number;
  value?: any;
  returnValue?: any;
  stateSnapshot: {
    data: (any | null)[];
    size: number;
    capacity: number;
  };
}

export class MyListSim<T> {
  private static readonly DEFAULT_CAPACITY = 10;
  private data: (T | null)[];
  private currentSize: number = 0;
  public history: StepAction[] = [];
  public consoleOutput: string[] = [];

  constructor(initialCapacity?: number) {
    const cap = (!initialCapacity || initialCapacity <= 0) ? MyListSim.DEFAULT_CAPACITY : initialCapacity;
    this.data = new Array(cap).fill(null);
    this.currentSize = 0;
    this.recordStep('INIT', `Yeni MyList oluşturuldu. Kapasite: ${cap}, Eleman Sayısı: 0`, {
      newCapacity: cap,
    });
  }

  public size(): number {
    return this.currentSize;
  }

  public getCapacity(): number {
    return this.data.length;
  }

  public add(item: T): void {
    let resized = false;
    const oldCap = this.data.length;
    let newCap = oldCap;

    if (this.currentSize >= this.data.length) {
      newCap = this.data.length * 2;
      const newData: (T | null)[] = new Array(newCap).fill(null);
      for (let i = 0; i < this.currentSize; i++) {
        newData[i] = this.data[i];
      }
      this.data = newData;
      resized = true;
      this.recordStep('RESIZE', `Kapasite doldu! Dizi 2 katına çıkarıldı: ${oldCap} -> ${newCap}`, {
        oldCapacity: oldCap,
        newCapacity: newCap,
      });
    }

    const targetIndex = this.currentSize;
    this.data[targetIndex] = item;
    this.currentSize++;

    this.recordStep('ADD', `add(${item}) -> Eleman ${targetIndex}. indise eklendi.`, {
      affectedIndex: targetIndex,
      value: item,
      oldCapacity: oldCap,
      newCapacity: resized ? newCap : undefined,
    });
  }

  public get(index: number): T | null {
    const isValid = index >= 0 && index < this.currentSize;
    const result = isValid ? this.data[index] : null;

    this.recordStep('GET', `get(${index}) -> ${isValid ? `Değer: ${result}` : 'Geçersiz indis! (null)'}`, {
      affectedIndex: isValid ? index : undefined,
      returnValue: result,
    });

    return result;
  }

  public remove(index: number): T | null {
    if (index < 0 || index >= this.currentSize) {
      this.recordStep('REMOVE', `remove(${index}) -> Geçersiz indis! (null)`, {
        returnValue: null,
      });
      return null;
    }

    const removedItem = this.data[index];

    // Shift left
    for (let i = index; i < this.currentSize - 1; i++) {
      this.data[i] = this.data[i + 1];
    }
    this.data[this.currentSize - 1] = null;
    this.currentSize--;

    this.recordStep('REMOVE', `remove(${index}) -> '${removedItem}' silindi. Sağdaki elemanlar sola kaydırıldı.`, {
      affectedIndex: index,
      value: removedItem,
      returnValue: removedItem,
    });

    return removedItem;
  }

  public set(index: number, data: T): T | null {
    if (index < 0 || index >= this.currentSize) {
      this.recordStep('SET', `set(${index}, ${data}) -> Geçersiz indis! (null)`, {
        returnValue: null,
      });
      return null;
    }

    const oldData = this.data[index];
    this.data[index] = data;

    this.recordStep('SET', `set(${index}, ${data}) -> ${index}. indisteki eski değer (${oldData}) yeni değer (${data}) ile değiştirildi.`, {
      affectedIndex: index,
      value: data,
      returnValue: oldData,
    });

    return oldData;
  }

  public toString(): string {
    if (this.currentSize === 0) {
      return '[]';
    }
    const elements: string[] = [];
    for (let i = 0; i < this.currentSize; i++) {
      elements.push(String(this.data[i]));
    }
    return `[${elements.join(',')}]`;
  }

  public indexOf(data: T): number {
    const scanned: number[] = [];
    for (let i = 0; i < this.currentSize; i++) {
      scanned.push(i);
      if (this.data[i] === data) {
        this.recordStep('INDEX_OF', `indexOf(${data}) -> İlk bulunan indis: ${i}`, {
          affectedIndex: i,
          scannedIndices: [...scanned],
          returnValue: i,
        });
        return i;
      }
    }

    this.recordStep('INDEX_OF', `indexOf(${data}) -> Eleman bulunamadı (-1)`, {
      scannedIndices: [...scanned],
      returnValue: -1,
    });
    return -1;
  }

  public lastIndexOf(data: T): number {
    const scanned: number[] = [];
    for (let i = this.currentSize - 1; i >= 0; i--) {
      scanned.push(i);
      if (this.data[i] === data) {
        this.recordStep('LAST_INDEX_OF', `lastIndexOf(${data}) -> Son bulunan indis: ${i}`, {
          affectedIndex: i,
          scannedIndices: [...scanned],
          returnValue: i,
        });
        return i;
      }
    }

    this.recordStep('LAST_INDEX_OF', `lastIndexOf(${data}) -> Eleman bulunamadı (-1)`, {
      scannedIndices: [...scanned],
      returnValue: -1,
    });
    return -1;
  }

  public isEmpty(): boolean {
    return this.currentSize === 0;
  }

  public toArray(): (T | null)[] {
    const res: (T | null)[] = [];
    for (let i = 0; i < this.currentSize; i++) {
      res.push(this.data[i]);
    }
    return res;
  }

  public clear(): void {
    this.data = new Array(MyListSim.DEFAULT_CAPACITY).fill(null);
    this.currentSize = 0;
    this.recordStep('CLEAR', `clear() -> Liste tamamen boşaltıldı ve varsayılan kapasiteye (10) çevrildi.`, {
      newCapacity: MyListSim.DEFAULT_CAPACITY,
    });
  }

  public subList(start: number, finish: number): MyListSim<T> {
    const sub = new MyListSim<T>(Math.max(MyListSim.DEFAULT_CAPACITY, finish - start + 1));
    const isValid = start >= 0 && finish < this.currentSize && start <= finish;

    if (!isValid) {
      this.recordStep('SUBLIST', `subList(${start}, ${finish}) -> Geçersiz aralık! Boş alt liste oluşturuldu.`, {
        returnValue: '[]',
      });
      return sub;
    }

    const indices: number[] = [];
    for (let i = start; i <= finish; i++) {
      indices.push(i);
      if (this.data[i] !== null && this.data[i] !== undefined) {
        sub.add(this.data[i] as T);
      }
    }

    this.recordStep('SUBLIST', `subList(${start}, ${finish}) -> Alt liste oluşturuldu: ${sub.toString()} (${indices.length} eleman)`, {
      affectedIndex: indices,
      returnValue: sub.toString(),
    });

    return sub;
  }

  public contains(data: T): boolean {
    const foundIdx = this.indexOf(data);
    const hasItem = foundIdx !== -1;
    this.recordStep('CONTAINS', `contains(${data}) -> ${hasItem ? 'true (Mevcut)' : 'false (Yok)'}`, {
      returnValue: hasItem,
    });
    return hasItem;
  }

  public getDataSnapshot(): (T | null)[] {
    return [...this.data];
  }

  private recordStep(
    type: StepAction['type'],
    description: string,
    extra: Partial<StepAction> = {}
  ) {
    this.history.push({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      type,
      description,
      stateSnapshot: {
        data: [...this.data],
        size: this.currentSize,
        capacity: this.data.length,
      },
      ...extra,
    });
  }

  /**
   * Run predefined Scenario 1 from prompt
   */
  public static runScenario1(): { sim: MyListSim<number>; logs: string[] } {
    const sim = new MyListSim<number>();
    const logs: string[] = [];

    logs.push(`Dizideki Eleman Sayısı : ${sim.size()}`);
    logs.push(`Dizinin Kapasitesi : ${sim.getCapacity()}`);

    sim.add(10);
    sim.add(20);
    sim.add(30);
    sim.add(40);

    logs.push(`Dizideki Eleman Sayısı : ${sim.size()}`);
    logs.push(`Dizinin Kapasitesi : ${sim.getCapacity()}`);

    sim.add(50);
    sim.add(60);
    sim.add(70);
    sim.add(80);
    sim.add(90);
    sim.add(100);
    sim.add(110);

    logs.push(`Dizideki Eleman Sayısı : ${sim.size()}`);
    logs.push(`Dizinin Kapasitesi : ${sim.getCapacity()}`);

    sim.consoleOutput = logs;
    return { sim, logs };
  }

  /**
   * Run predefined Scenario 2 from prompt
   */
  public static runScenario2(): { sim: MyListSim<number>; logs: string[] } {
    const sim = new MyListSim<number>();
    const logs: string[] = [];

    sim.add(10);
    sim.add(20);
    sim.add(30);

    logs.push(`2. indisteki değer : ${sim.get(2)}`);

    sim.remove(2);
    sim.add(40);
    sim.set(0, 100);

    logs.push(`2. indisteki değer : ${sim.get(2)}`);
    logs.push(sim.toString());

    sim.consoleOutput = logs;
    return { sim, logs };
  }

  /**
   * Run predefined Scenario 3 from prompt
   */
  public static runScenario3(): { sim: MyListSim<number>; logs: string[] } {
    const sim = new MyListSim<number>();
    const logs: string[] = [];

    logs.push(`Liste Durumu : ${sim.isEmpty() ? 'Boş' : 'Dolu'}`);

    sim.add(10);
    sim.add(20);
    sim.add(30);
    sim.add(40);
    sim.add(20);
    sim.add(50);
    sim.add(60);
    sim.add(70);

    logs.push(`Liste Durumu : ${sim.isEmpty() ? 'Boş' : 'Dolu'}`);
    logs.push(`Indeks : ${sim.indexOf(20)}`);
    logs.push(`Indeks :${sim.indexOf(100)}`);
    logs.push(`Indeks : ${sim.lastIndexOf(20)}`);

    const dizi = sim.toArray();
    logs.push(`Object dizisinin ilk elemanı :${dizi[0]}`);

    const altListem = sim.subList(0, 3);
    logs.push(altListem.toString());

    logs.push(`Listemde 20 değeri : ${sim.contains(20)}`);
    logs.push(`Listemde 120 değeri : ${sim.contains(120)}`);

    sim.clear();
    logs.push(sim.toString());

    sim.consoleOutput = logs;
    return { sim, logs };
  }
}
