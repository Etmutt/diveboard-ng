export class Buddy {
  constructor(
    public name: string,
    public id?: number,
    public fb_id?: number,
    public email?: string,
    public picturl?: string
  ) {}
}

export class BuddyAdapter {
  static adapt(item: any): Buddy {
    return new Buddy(
      item.nickname,
      item.db_id,
      item.fb_id,
      item.email,
      item.picturl
    );
  }
}
