export type TProductResponse = {
  id: number,
  seller: {
    id: number,
    cnpj: string,
    sales: number,
    balance: number
  },
  category: {
    id: number,
    name: string
  },
  title: string,
  specification: string,
  description: string,
  price: number,
  stock: number,
  imageURL: [
    string
  ]
}