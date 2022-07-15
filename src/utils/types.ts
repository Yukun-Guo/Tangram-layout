interface TreeNode {
    ID?: string
    isShow: boolean
    isActive?: boolean
    layout: 'horizontal' | 'vertical'
    relativePosition?: 0 | 1 // relative position of the twin node, used for adjust window position layout
    proportion?: number
    parentID?: string
    twinID?: string
    children?: string[] 
}

interface Stump {
    [key: string]: TreeNode 
}


export type { TreeNode, Stump }