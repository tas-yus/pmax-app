export class Order {
  constructor(public type: String, public createdAt: Date, public code: Number,
  public course: {title: String}) {}
}
