export class Media {
  constructor(
    public thumbnail: string,
    public medium: string,
    public large: string,
    public small: string,
    public notes: string,
    public media: string, //image for picture ;
    public player: string,
    public full_redirect_link: string,
    public fullpermalink: string,
    public permalink: string,
    public created_at: Date,
    public id: number
  ) {}
}

/*  adapt dat from API to model */
/*  model follows Image item used in ngx gallery for more convenience */

export class MediaAdapter {
  static adapt(item: any): Media {
    return new Media(
      item.thumbnail,
      item.medium,
      item.large,
      item.small,
      item.notes,
      item.media, //image for picture ;
      item.player,
      item.full_redirect_link,
      item.fullpermalink,
      item.permalink,
      new Date(item.created_at),
      item.id
    );
  }
}
