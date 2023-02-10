import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
// import axios from 'axios';
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import axios from "axios";

export interface IInstaSpDiscoveryProps {
  nbInstaCards: number,
  accountName: string,
  serviceScope: ServiceScope;
  clickHandler: () => void;
}

/**
 * Interface des parametres des publications du compte
 * @param { string } media_type
 * @param { string } media_url
 * @param { string } thumbnail_url
 * @param { {}  } children
 * @param { string } permalink
 * @param { number } like_count
 * @param { string | number } timestamp
 * @param { number } comments_count
 * @param { number } id
 */
export interface ICollection {
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  children: {};
  permalink: string;
  like_count: number;
  timestamp: string | number;
  comments_count: number;
  id: number
}

export interface IDiscoveryAccount {
  biography: string
  followers_count: number
  follows_count: number
  id: string;
  ig_id: number;
  media: IDiscoveryMedia[]
  media_count: number
  name: string
  profile_picture_url: string
  username: string
  website: string
}

export interface IDiscoveryMedia {
  caption: string
  children: Array<string>
  comments_count: number
  id: string
  like_count: number
  media_product_type: string
  media_type: string
  media_url: string
  owner: Array<string>
  permalink: string
  timestamp: string
  username: string
}

/**
 * Interface des parametres lus depuis la liste SharePoint
 * @param { string } account
 * @param { string } lastPublication
 * @param { string } collection
 */
export interface ISPFxList {
  account: string;
  lastPublication: string;
  collection: string;
}


/**
 * Interface des fonctions définies dans le service
 * @function { Promise<ISPFxList[]> } getLastStories()
 */
export interface IInstaService {
  getInstaData(): Promise<ISPFxList[]>;
  getStoryData(): Promise<any[]>;
  getPublicationsCollection(nomAccount: string): Promise<IDiscoveryAccount>;
  getSpDiscoveryData(accountName  :string): Promise<IDiscoveryAccount>
}

export class InstaService implements IInstaService {

  public static readonly serviceKey: ServiceKey<IInstaService> = ServiceKey.create<IInstaService>("SPFx:InstaService", InstaService);
  protected serviceScope: ServiceScope;

  private _webUrl: string = "";

  constructor(serviceScope: ServiceScope) {
    serviceScope.whenFinished(() => {
      const pageContext = serviceScope.consume(PageContext.serviceKey);
      this.serviceScope = serviceScope;
      this._webUrl = pageContext.web.absoluteUrl;
    });
  }

  /**
 * Fonction de récupération des données de la liste SharePoint
 * @return { Promise<ISPFxList[]> } data
 */
  public async getInstaData(): Promise<ISPFxList[]> {
    console.log(`InstaService#getInstaData`);
    const web = Web(this._webUrl);
    const items = await web.getList("sites/csv-insta-dbd/Lists/Liste%20Communications%20Instagram")
      .items.select("DataAccount", "DataMediaLastPublication", "DataMediaCollection")
      .filter("Title eq 'Requete API Instagram'")
      .orderBy("Created", false).top(1)();
    const data: ISPFxList[] = items.map((i) => ({ account: i.DataAccount, lastPublication: i.DataMediaLastPublication, collection: i.DataMediaCollection }));
    console.log("data : ", data);
    return data;
  }

  public async getStoryData(): Promise<any[]> {
    console.log(`InstaService#getStoryData`);
    const web = Web(this._webUrl);
    const items = await web.getList("sites/csv-insta-dbd/Lists/Liste%20Communications%20Instagram")
      .items.select("DataAccount", "DataStory", "DataStory2", "DataStory3", "DataStory4", "DataStory5")
      .filter("Title eq 'Requete API Story Instagram'")
      .orderBy("Created", false).top(1)();
    const testData = [
      items[0].DataAccount,
      items[0].DataStory,
      items[0].DataStory2,
      items[0].DataStory3,
      items[0].DataStory4,
      items[0].DataStory5,
    ]
    return testData;
  }

  public async getSpDiscoveryData(accountName : string): Promise<IDiscoveryAccount> {
    var data: any = "";
    console.log(`InstaService#getSpDiscoveryData`);
    const web = Web(this._webUrl);
    const items = await web.getList("sites/csv-insta-dbd/Lists/Liste%20Communications%20Instagram")
      .items.select("Comptes_Business", "Resultat_requete_business", "Title", "ID")
      .filter("Title eq 'Requete Instagram Business'")
      .orderBy("Created", false)();
    items.map((item) => {
      if(item.Comptes_Business == accountName)
      {
        data = JSON.parse(item.Resultat_requete_business);
      }
    });
    console.log("items : ", items)
    console.log("tabData : ", data)
    const tabDiscovery: IDiscoveryAccount = {
      biography: data.business_discovery.biography,
      followers_count: data.business_discovery.followers_count,
      follows_count: data.business_discovery.follows_count,
      id: data.business_discovery.id,
      ig_id: data.business_discovery.ig_id,
      media: data.business_discovery.media.data,
      media_count: data.business_discovery.media_count,
      name: data.business_discovery.name,
      profile_picture_url: data.business_discovery.profile_picture_url,
      username: data.business_discovery.username,
      website: data.business_discovery.website
    }
    console.log("tabDiscovery : ", tabDiscovery)
    
    return tabDiscovery;
  }

  public async getPublicationsCollection(nomAccount: string): Promise<IDiscoveryAccount> {
    console.log(`InstaService#getAccountPublication`);
    try {
      const instaMedia = await axios.get(`https://graph.facebook.com/v14.0/17841453102781579?fields=business_discovery.username(${nomAccount})%7Busername%2Cwebsite%2Cname%2Cig_id%2Cid%2Cprofile_picture_url%2Cbiography%2Cfollows_count%2Cfollowers_count%2Cmedia_count%2Cmedia%7Bid%2Ccaption%2Clike_count%2Ccomments_count%2Ctimestamp%2Cusername%2Cmedia_product_type%2Cmedia_type%2Cowner%2Cpermalink%2Cmedia_url%2Cchildren%7Bmedia_url%7D%7D%7D&limit=25&access_token=EAAGGBo1ZC7mMBALdSobEhUjZAtGmnZAODCWAWq47ZAKCj8wubDgZAVZARj86Dp6ZBvILbzgiZA3YoQSnnOrUx1KtRCZCei5IFTx68jL55mpAOLsMSDHiWP3HKkZC9tCGVgZBKjq1gZCmyDflHZBDVZAchNmdHEGOMNWmZBcjsBNid2DoQGCHAG2E9QWvICy`);
      console.log("resultat de la requete brute : ", instaMedia)
      const responseMedia = instaMedia?.data.business_discovery;
      console.log("resultat de instaMedia?.data.business_discovery : ", responseMedia)
      const tabDiscovery: IDiscoveryAccount = {
        biography: responseMedia.biography,
        followers_count: responseMedia.followers_count,
        follows_count: responseMedia.follows_count,
        id: responseMedia.id,
        ig_id: responseMedia.ig_id,
        media: responseMedia.media.data,
        media_count: responseMedia.media_count,
        name: responseMedia.name,
        profile_picture_url: responseMedia.profile_picture_url,
        username: responseMedia.username,
        website: responseMedia.website
      }
      console.log("tabDiscovery", tabDiscovery);

      return tabDiscovery;
    } catch (error) {
      console.log("erreur: ", error);
    }
  }
}