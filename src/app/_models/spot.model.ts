export class Spot {
  constructor(
    id: number,
    public shaken_id: string,
    public country_name: string,
    public country_code: string,
    public country_flag_big: string,
    public country_flag_small: string,
    public within_country_bounds: boolean,
    public region_name: string,
    public location_name: string,
    public permalink: string,
    public fullpermalink: string,
    public staticmap: string,
    public name: string,
    public lat: number,
    public lng: number
  ) {}
}

export class SpotAdapter {
  static adapt(item: any): Spot {
    return new Spot(
      item.id,
      item.shaken_id,
      item.country_name,
      item.country_code,
      item.country_flag_big,
      item.country_flag_small,
      item.within_country_bounds,
      item.region_name,
      item.location_name,
      item.permalink,
      item.fullpermalink,
      item.staticmap,
      item.name,
      item.lat,
      item.lng
    );
  }
}
