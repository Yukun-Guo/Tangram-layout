import { TreeNode, Stump } from "./types";
import { uuid } from "./short-uuid"


export class Tree {

    tree: Stump

    constructor(tree: Stump = undefined) {
        this.tree = tree
        if (this.tree === undefined) {
            this.tree = {}
            this.tree['treeRoot'] = { ID: 'treeRoot', isShow: true, layout: 'horizontal', proportion: 100, parentID: undefined, twinID: undefined, children: [] }
        }
    }

    getTreeSize = () => Object.keys(this.tree).length

    insertChild = (newNode: TreeNode) => {
        if (newNode.ID === undefined) {
            newNode.ID = uuid()
        }
        if (newNode.children === undefined) {
            newNode.children = []
        }
        // if current tree is empty, create a root node and push the new node to the tree
        if (this.getTreeSize() === 0) {
            this.tree['treeRoot'] = { ID: 'treeRoot', isShow: true, layout: 'horizontal', proportion: 100, parentID: undefined, twinID: undefined, children: [] }
        }
        if (newNode.twinID === undefined) {
            newNode.parentID = 'treeRoot'
            newNode.proportion = 100
            this.tree['treeRoot'].children = [newNode.ID]
            this.tree[newNode.ID] = newNode
            return;
        }
        if (this.tree.hasOwnProperty(newNode.twinID)) {
            let parentID = this.tree[newNode.twinID].parentID
            if (this.tree[parentID].layout === newNode.layout || this.tree[parentID].children.length === 1) {
                // if the newNode layout is same as the twin layout they become brothers
                let insertIdx = this.tree[parentID].children.indexOf(newNode.twinID) + newNode.relativePosition;// find twinNode position
                this.tree[parentID].children.splice(insertIdx, 0, newNode.ID)
                newNode.parentID = parentID
                this.tree[parentID].layout = newNode.layout

            } else {
                // if the newNode layout is different with the twin layout, create a new parent node for them
                let newParentID = uuid()
                newNode.parentID = newParentID
                let children = newNode.relativePosition ? [newNode.twinID, newNode.ID] : [newNode.ID, newNode.twinID]
                this.tree[newNode.twinID].parentID = newParentID
                this.tree[newParentID] = { ID: newParentID, isShow: true, layout: newNode.layout, parentID: parentID, twinID: undefined, children: children }
                let insertIdx = this.tree[parentID].children.indexOf(newNode.twinID)
                this.tree[parentID].children[insertIdx] = newParentID
            }
            // update the proportion
            this.tree[newNode.ID] = newNode
            let prop = 100 / this.tree[parentID].children.length
            this.tree[parentID].children.forEach((el) => { this.tree[el].proportion = prop })
        }
    }

    removeChild = (nodeID: string) => {
        if (this.tree.hasOwnProperty(nodeID)) {
            let pID = this.tree[nodeID].parentID
            switch (this.tree[pID].children.length) {
                case 1: {
                    this.tree[pID].children = [];
                    break;
                }
                case 2: {
                    let rmIdx = this.tree[pID].children.indexOf(nodeID)
                    this.tree[pID].children.splice(rmIdx, 1);
                    let leftChildID = this.tree[pID].children[0]
                    let grandPID = this.tree[pID].parentID

                    this.tree[leftChildID].proportion = this.tree[pID].proportion
                    this.tree[leftChildID].parentID = grandPID

                    let pIDX = this.tree[grandPID].children.indexOf(pID)
                    this.tree[grandPID].children.splice(pIDX, 1, leftChildID)
                    delete this.tree[pID]
                    break;
                }
                default: {
                    let idx = this.tree[pID].children.indexOf(nodeID)
                    this.tree[pID].children.splice(idx, 1)
                    let prop = 100 / this.tree[pID].children.length
                    this.tree[pID].children.forEach((el) => { this.tree[el].proportion = prop })
                    break;
                }
            }
            delete this.tree[nodeID]
        }
    }

    moveChild = (newNode: TreeNode) => {
        this.removeChild(newNode.ID)
        this.insertChild(newNode)
    }

}
// //test
// let tree = new Tree()

// let node1: TreeNode = { ID: '1', isShow: false, layout: 0, relativePosition: 1, twinID: undefined }
// let node2: TreeNode = { ID: '2', isShow: false, layout: 1, relativePosition: 1, twinID: node1.ID }
// let node3: TreeNode = { ID: '3', isShow: false, layout: 0, relativePosition: 0, twinID: node1.ID }
// let node4: TreeNode = { ID: '4', isShow: false, layout: 1, relativePosition: 0, twinID: node2.ID }
// let node5: TreeNode = { ID: '5', isShow: false, layout: 1, relativePosition: 1, twinID: node2.ID }
// let node6: TreeNode = { ID: '6', isShow: false, layout: 0, relativePosition: 0, twinID: node3.ID }
// let node7: TreeNode = { ID: '7', isShow: false, layout: 0, relativePosition: 0, twinID: node5.ID }
// tree.insertChild(node1)
// tree.insertChild(node2)
// tree.insertChild(node3)
// tree.insertChild(node4)
// tree.insertChild(node5)
// tree.insertChild(node6)
// tree.insertChild(node7)
// tree.removeChild(node4.ID)
// tree.moveChild({ ID: '2', isShow: false, layout: 1, relativePosition: 1, twinID: node7.ID })
// tree.moveChild({ ID: '7', isShow: false, layout: 0, relativePosition: 1, twinID: node3.ID })
// console.log(tree.tree)
