import { Buddy, BuddyAdapter } from "./buddy.model";
import { Spot, SpotAdapter } from "./spot.model";
import { Media, MediaAdapter } from "./media.model";

export class Dive {
  constructor(
    public shop_id: number,
    public spot_id: number,
    public trip_name: string,
    public user_id: number,
    public date: Date,
    public time: string,
    public time_in: Date,
    public spot: Spot,
    public buddies: Buddy[],
    public divetype: string[],
    public temp_surface: number,
    public altitude: number,
    public current: number,
    public diveshop: number,
    public duration: number,
    public favorite: boolean,
    public flavour: string,
    public fullpermalink: string,
    public guide: string,
    public id: number,
    public shaken_id: string,
    public lat: number,
    public lng: number,
    public privacy: boolean,
    public maxdepth: number,
    public notes: string,
    public public_notes: string,
    public permalink: string,
    public surface_interval: number,
    public temp_bottom: number,
    public visibility: number,
    public water: string,
    public weights: number,
    public thumbnail_image_url: string,
    public thumbnail_profile_url: string,
    public dive_reviews_overall,
    public dive_reviews_difficulty,
    public dive_reviews_marine,
    public dive_reviews_wreck,
    public dive_reviews_bigfish,
    public number,
    public featured_picture?: Media,
    public pictures?: Media[],
    public profile_dan?: number
  ) {}

  /////
  //safetystops_unit_value: "[]"
  //complete: true
  //safetystops: number[ [string, number] ] ​
  //shop: null
  //species: Array []
  //gears: number [];
  //dive_gears: number[];
  //user_gears: Array []​
}

export class DiveAdapter {
  //adpat API feedback to model; help early catch for errors
  static adapt(result: any): Dive {
    const item = result.result;

    //map visibility
    let visibility: number;
    switch (item.visibility) {
      case "bad":
        visibility = 1;
        break;
      case "average":
        visibility = 3;
        break;
      case "good":
        visibility = 4;
        break;
      case "excellent":
        visibility = 5;
        break;
      default:
        visibility = 0;
    }

    //map privacy
    const privacy = item.privacy == 1 ? true : false;

    //map current
    let current: number;
    switch (item.current) {
      case "none":
        current = 1;
        break;
      case "light":
        current = 2;
        break;
      case "medium":
        current = 3;
        break;
      case "strong":
        current = 4;
        break;
      case "extreme":
        current = 5;
        break;
      default:
        current = null;
    }

    return new Dive(
      item.shop_id,
      item.spot_id,
      item.trip_name,
      item.user_id,
      item.date,
      item.time,
      new Date(item.time_in),
      SpotAdapter.adapt(item.spot),
      item.buddies.map((x) => BuddyAdapter.adapt(x)),
      item.divetype,
      item.temp_surface,
      item.altitude,
      current,
      item.diveshop,
      item.duration,
      item.favorite,
      item.flavour,
      item.fullpermalink,
      item.guide,
      item.id,
      item.shaken_id,
      item.lat,
      item.lng,
      privacy,
      item.maxdepth,
      item.notes,
      item.public_notes,
      item.permalink,
      item.surface_interval,
      item.temp_bottom,
      visibility,
      item.water,
      item.weights,
      item.thumbnail_image_url,
      item.thumbnail_profile_url,
      item.dive_reviews.overall,
      item.dive_reviews.difficulty,
      item.dive_reviews.marine,
      item.dive_reviews.wreck,
      item.dive_reviews.bigfish,
      item.number,
      item.featured_picture ? MediaAdapter.adapt(item.featured_picture) : null,
      item.pictures ? item.pictures.map((x) => MediaAdapter.adapt(x)) : null,
      item.profile_ref
    );
  }

  //adapt model to API
  static trunc_write(data: Dive): any {
    //map visibility
    let visibility: string;
    switch (data.visibility) {
      case 1:
        visibility = "bad";
        break;
      case 2:
        visibility = "average";
        break;
      case 3:
        visibility = "average";
        break;
      case 4:
        visibility = "average";
        break;
      case 5:
        visibility = "excellent";
        break;
      default:
        visibility = null;
    }

    //map privacy
    const privacy = data.privacy ? 1 : 0;

    //map current evaluation
    let current: string;
    switch (data.current) {
      case 1:
        current = "none";
        break;
      case 2:
        current = "light";
        break;
      case 3:
        current = "medium";
        break;
      case 4:
        current = "strong";
        break;
      case 5:
        current = "extreme";
        break;
      default:
        current = null;
    }

    const api_dive = {
      trip_name: data.trip_name,
      user_id: data.user_id,
      time_in: data.time_in,
      spot: data.spot?data.spot:"",
      buddies: data.buddies,
      divetype: data.divetype,
      temp_surface: data.temp_surface,
      altitude: data.altitude,
      current: current,
      diveshop: data.diveshop,
      duration: data.duration,
      favorite: data.favorite,
      guide: data.guide,
      id: data.id,
      lat: data.lat,
      lng: data.lng,
      privacy: privacy,
      maxdepth: data.maxdepth,
      notes: data.notes,
      public_notes: data.public_notes,
      surface_interval: data.surface_interval,
      temp_bottom: data.temp_bottom,
      visibility: visibility,
      water: data.water,
      weights: data.weights,
      dive_reviews: {
        overall: data.dive_reviews_overall,
        difficulty: data.dive_reviews_difficulty,
        marine: data.dive_reviews_marine,
        wreck: data.dive_reviews_wreck,
        bigfish: data.dive_reviews_bigfish,
      },
      number: data.number,
    };

    return api_dive;
  }
}
