export type Shoes = {
    id: number
    name: string
    price: number
    image: string
    description: string
    
}

export type CartItem = Shoes &{

    quantity: number
}