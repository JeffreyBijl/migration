export interface Mapper<TIn, TOut> {
  map(input: TIn[]): TOut[];
}
