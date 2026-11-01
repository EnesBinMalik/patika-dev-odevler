import { BookItem } from '../types/book';
import { compareBooksByName, compareBooksByPage } from '../data/defaultBooks';

export interface TreeNode {
  id: string;
  book: BookItem;
  left?: TreeNode;
  right?: TreeNode;
  x: number;
  y: number;
  color: 'red' | 'black';
  comparisonHistory?: string[];
}

export function buildTree(
  books: BookItem[],
  mode: 'name' | 'page'
): { root: TreeNode | null; inOrderList: BookItem[] } {
  if (books.length === 0) return { root: null, inOrderList: [] };

  const compareFn = mode === 'name' ? compareBooksByName : compareBooksByPage;

  let root: TreeNode | null = null;

  for (const book of books) {
    const history: string[] = [];
    if (!root) {
      root = {
        id: book.id,
        book,
        x: 50,
        y: 15,
        color: 'black',
        comparisonHistory: ['Ağaç boştu; kök (root) düğüm olarak eklendi.'],
      };
      continue;
    }

    let current: TreeNode | null = root;
    let placed = false;

    while (!placed && current) {
      const cmp = compareFn(book, current.book);
      if (cmp < 0) {
        history.push(
          mode === 'name'
            ? `"${book.name}" < "${current.book.name}" (compareTo < 0) -> Sol alt dala gidildi`
            : `${book.pageCount} sf < ${current.book.pageCount} sf -> Sol alt dala gidildi`
        );
        if (!current.left) {
          current.left = {
            id: book.id,
            book,
            x: 0,
            y: 0,
            color: 'red',
            comparisonHistory: history,
          };
          placed = true;
        } else {
          current = current.left;
        }
      } else {
        // >= 0
        history.push(
          mode === 'name'
            ? `"${book.name}" >= "${current.book.name}" (compareTo >= 0) -> Sağ alt dala gidildi`
            : `${book.pageCount} sf >= ${current.book.pageCount} sf -> Sağ alt dala gidildi`
        );
        if (!current.right) {
          current.right = {
            id: book.id,
            book,
            x: 0,
            y: 0,
            color: 'red',
            comparisonHistory: history,
          };
          placed = true;
        } else {
          current = current.right;
        }
      }
    }
  }

  // Calculate layout coordinates
  assignCoordinates(root, 50, 15, 24, 20);

  // In-order traversal produces sorted order
  const inOrderList: BookItem[] = [];
  function inOrder(node: TreeNode | null) {
    if (!node) return;
    inOrder(node.left || null);
    inOrderList.push(node.book);
    inOrder(node.right || null);
  }
  inOrder(root);

  return { root, inOrderList };
}

function assignCoordinates(
  node: TreeNode | null,
  x: number,
  y: number,
  offset: number,
  verticalSpacing: number
) {
  if (!node) return;
  node.x = x;
  node.y = y;

  if (node.left) {
    assignCoordinates(
      node.left,
      Math.max(8, x - offset),
      y + verticalSpacing,
      offset * 0.55,
      verticalSpacing
    );
  }
  if (node.right) {
    assignCoordinates(
      node.right,
      Math.min(92, x + offset),
      y + verticalSpacing,
      offset * 0.55,
      verticalSpacing
    );
  }
}
