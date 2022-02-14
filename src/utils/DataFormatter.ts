export const formatData = (array: string[][]) => {

    return array.map((r: any[], index: number) => {

        return {
            "id": index,
            "size": r[1],
            "price": r[0]
        }

    })
}

export const getId = () => { return Math.floor((Math.random() * 100000) + 1); }