export interface TreeNode {
    id: number
    isShow: boolean
    layout: number
    children?: TreeNode[] // type for a known property.
}