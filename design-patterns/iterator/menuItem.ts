export class MenuItem {
  public name: string
  public description: string
  public price: number

  public constructor(name: string, description: string, price: number) {
    this.name = name
    this.description = description
    this.price = price
  }
}
