import { Value } from './value';

class TreeNode {
  constructor(
    public name: string,
    public value: Value | null,
    public left: TreeNode | null,
    public right: TreeNode | null
  ) {}
}

export class SymbolTable {
  private _root: TreeNode | null = null;

  private _addRec(toAdd: TreeNode, root: TreeNode) {
    if (toAdd.name < root.name) {
      if (root.left === null) {
        root.left = toAdd;
        return;
      } else {
        this._addRec(toAdd, root.left);
      }
    } else if (toAdd.name > root.name) {
      if (root.right === null) {
        root.right = toAdd;
        return;
      } else {
        this._addRec(toAdd, root.right);
      }
    }
  }

  register(name: string, value: Value | null) {
    // add in tree
    if (this._root === null) {
      this._root = new TreeNode(name, value, null, null);
      return;
    }
    this._addRec(new TreeNode(name, value, null, null), this._root);
  }

  private _getRec(name: string, root: TreeNode): TreeNode {
    if (root.name === name) {
      return root;
    } else if (name < root.name && root.left !== null) {
      return this._getRec(name, root.left);
    } else if (name > root.name && root.right !== null) {
      return this._getRec(name, root.right);
    }
    throw 'Not found';
  }

  get(name: string) {
    // console.log(JSON.stringify(this._root, null, 2));
    if (!this._root) throw 'Not found';
    return this._getRec(name, this._root);
  }

  private _hasRec(name: string, root: TreeNode): boolean {
    if (root.name === name) {
      return true;
    } else if (name < root.name && root.left !== null) {
      return this._hasRec(name, root.left);
    } else if (name > root.name && root.right !== null) {
      return this._hasRec(name, root.right);
    }
    return false;
  }

  has(name: string): boolean {
    if (!this._root) return false;
    return this._hasRec(name, this._root);
  }

  private _listRec(node: TreeNode, list: any[]) {
    if (node.left) this._listRec(node.left, list);
    const { name, value } = node;
    list.push({ name, value });
    if (node.right) this._listRec(node.right, list);
  }

  list() {
    const list: Pick<TreeNode, 'name' | 'value'>[] = [];
    if (this._root === null) return [];
    this._listRec(this._root, list);
    return list;
  }
}
