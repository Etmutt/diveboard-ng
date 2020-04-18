export class Buddy {
  constructor(
    public name: string,
    public db_id?: number,
    public fb_id?: number,
    public email?: string,
    public picturl?: string
  ) {}
}

export class BuddyAdapter {
  static adapt(item: any): Buddy {
    return new Buddy(
      item.name,
      item.db_id,
      item.fb_id,
      item.email,
      item.picturl
    );
  }
}
