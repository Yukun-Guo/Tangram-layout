interface TreeNode {
    ID: string
    layout: string | 'horizontal' | 'vertical'
    name?: string
    isVisible?: boolean // always true
    displayGroup?: number // preserved for future use
    isActive?: boolean // always true
    resizable?: boolean // always true
    relativePosition?: number | 0 | 1 // relative position of the twin node, used for adjust pane position
    proportion?: number // the proportion of current node in the parent node (0-100)
    parentID?: string
    twinID?: string  // the twin node ID used for specify pane position
    children?: string[]
    minSize?: number // the minimum size of the pane (px)
    vNode?: any, // the vue node for the pane content
}

interface Stump {
    [key: string]: TreeNode
}

const createTree = (tree: Stump = undefined) => {
    if (tree === undefined) {
        tree = {}
        tree['treeRoot'] = { ID: 'treeRoot', layout: 'vertical', proportion: 100, parentID: undefined, twinID: undefined, children: [] }
    }
    return tree
}

const getTreeSize = (tree: Stump) => { return Object.keys(tree).length }

const insertChild = (tree: Stump, newNode: TreeNode) => {
    if (newNode.ID === undefined) {
        newNode.ID = uuid()
    }
    if (newNode.children === undefined) {
        newNode.children = []
    }
    // if current tree is empty, create a root node and push the new node to the tree
    if (getTreeSize(tree) === 0) {
        tree['treeRoot'] = { ID: 'treeRoot', layout: 'horizontal', proportion: 100, parentID: undefined, twinID: undefined, children: [] }
    }
    if (newNode.twinID === undefined) {
        newNode.parentID = 'treeRoot'
        newNode.proportion = 100
        tree['treeRoot'].children = [newNode.ID]
        tree[newNode.ID] = newNode
        return;
    }
    if (tree.hasOwnProperty(newNode.twinID)) {
        let parentID = tree[newNode.twinID].parentID
        if (tree[parentID].layout === newNode.layout || tree[parentID].children.length === 1) {
            // if the newNode layout is same as the twin layout they become brothers
            let insertIdx = tree[parentID].children.indexOf(newNode.twinID) + newNode.relativePosition;// find twinNode position
            tree[parentID].children.splice(insertIdx, 0, newNode.ID)
            newNode.parentID = parentID
            tree[parentID].layout = newNode.layout
        } else {
            // if the newNode layout is different with the twin layout, create a new parent node for them
            let newParentID = uuid()
            newNode.parentID = newParentID
            newNode.proportion = 50
            let children = newNode.relativePosition ? [newNode.twinID, newNode.ID] : [newNode.ID, newNode.twinID]
            tree[newNode.twinID].parentID = newParentID
            tree[newNode.twinID].proportion = 50
            tree[newParentID] = { ID: newParentID, layout: newNode.layout, parentID: parentID, twinID: undefined, children: children }
            let insertIdx = tree[parentID].children.indexOf(newNode.twinID)
            tree[parentID].children[insertIdx] = newParentID
        }
        // add newNode to tree
        tree[newNode.ID] = newNode
        // update the proportion
        let prop = 100 / tree[parentID].children.length
        tree[parentID].children.forEach((el) => { tree[el].proportion = prop })
    }
}

const removeChild = (tree: Stump, nodeID: string) => {
    if (tree.hasOwnProperty(nodeID)) {
        let pID = tree[nodeID].parentID
        switch (tree[pID].children.length) {
            case 1: {
                tree[pID].children = [];
                break;
            }
            case 2: {
                let rmIdx = tree[pID].children.indexOf(nodeID)
                tree[pID].children.splice(rmIdx, 1);
                let leftChildID = tree[pID].children[0]
                tree[leftChildID].proportion = tree[pID].proportion

                if (pID !== "treeRoot") {
                    let grandPID = tree[pID].parentID
                    tree[leftChildID].parentID = grandPID
                    let pIDX = tree[grandPID].children.indexOf(pID)
                    tree[grandPID].children.splice(pIDX, 1, leftChildID)
                    delete tree[pID]
                }
                break;
            }
            default: {
                let idx = tree[pID].children.indexOf(nodeID)
                tree[pID].children.splice(idx, 1)
                let prop = 100 / tree[pID].children.length
                tree[pID].children.forEach((el) => { tree[el].proportion = prop })
                break;
            }
        }
        delete tree[nodeID]
    }
}

const moveChild = (tree: Stump, newNode: TreeNode) => {
    removeChild(tree, newNode.ID)
    insertChild(tree, newNode)
}

function uuid() {
    return 'Uidxxxyxxx_xxxyxxxid'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export type { TreeNode, Stump }
export { createTree, getTreeSize, insertChild, removeChild, moveChild, uuid }
