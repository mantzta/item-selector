export interface FoldersItemsResponse {
    folders: {
        columns: string[],
        data: [number, string, number][]
    },
    items: {
        columns: string[],
        data: [number, string, number][]
    }
}