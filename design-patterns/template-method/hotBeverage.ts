export abstract class HotBeverage {
  public prepareRecipe(): void {
    this.boilWater()
    this.brew()
    this.pourInCup()
    this.addCondiments()
  }

  protected abstract brew(): void
  protected abstract addCondiments(): void

  private boilWater(): void {
    console.log("  Water aan het koken...")
  }

  private pourInCup(): void {
    console.log("  Inschenken in kopje...")
  }
}
