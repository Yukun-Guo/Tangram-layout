import { TreeNode } from "./types";

class Tree {
    gID: string | undefined
    root: TreeNode | undefined

    constructor(tree: TreeNode) {
        this.root = tree || []
    }

    insertChild = (parentID: string, nodeID: string, layout: number, isShow: boolean) => {

    }


    // public push = (node: TreeNode) => {
    //     if (node.id === undefined) {
    //         node.id = this.gID++
    //     }
    //     this.push(node)
    //     return node
    // }
}