import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";

export interface IFeed {
    id: number;
    message: string;
    story: string;
    full_picture: string;
    permalink_url: string;
    timestamp: string;
    auteur: string;
    profilePic: string;
}

export interface IFacebookService {
    getFacebookData(): Promise<IFeed[]>
}

export class FacebookService implements IFacebookService {

    public static readonly serviceKey: ServiceKey<IFacebookService> = ServiceKey.create<IFacebookService>("SPFx:FacebookService", FacebookService);
    protected serviceScope: ServiceScope;

    private _webUrl: string = "";

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            const pageContext = serviceScope.consume(PageContext.serviceKey);
            this.serviceScope = serviceScope;
            this._webUrl = pageContext.web.absoluteUrl;
        });
    }

    public async getFacebookData(): Promise<IFeed[]> {
        console.log(`InstaService#getFacebookData`);
        const web = Web(this._webUrl);
        const items = await web.getList("sites/csv-insta-dbd/Lists/Liste%20Communications%20Instagram")
            .items.select("DataFacebook")
            .filter("Title eq 'Requete API Facebook'")
            .orderBy("Created", false).top(1)();
        const data = items.map((i) => ({ facebookData: i.DataFacebook }));
        const parsedData = JSON.parse(data[0].facebookData)
        const FbData: IFeed[] = parsedData.map((pagePosts) => ({
            id: pagePosts?.id,
            message: pagePosts?.message,
            story: pagePosts?.story,
            full_picture: pagePosts?.full_picture,
            permalink_url: pagePosts?.permalink_url,
            timestamp: pagePosts?.created_time,
            auteur: pagePosts?.from?.name,
            profilePic: pagePosts?.from?.picture.data.url
        }))
        console.log("FbData :", FbData);
        return (FbData)
    }
}