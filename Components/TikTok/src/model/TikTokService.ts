import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import axios from 'axios';

export interface IAccount {
    titre: string;
    urlAuteur: string;
    name: string;
    width: number;
    height: number;
    html: string;
    lienTikTok: string;
}

export interface IMedia {
    titre: string;
    urlAuteur: string;
    name: string;
    width: number;
    height: number;
    html: string;
    thumbnailURL: string;
    lienTikTok: string;
}

export interface ITikTokService {
    getTikTokAccount(tiktokUsername: string): Promise<IAccount>
    getTikTokMedia(mediaID: number | string): Promise<IMedia>
}

export class TikTokService implements ITikTokService {

    public static readonly serviceKey: ServiceKey<ITikTokService> = ServiceKey.create<ITikTokService>("SPFx:TikTokService", TikTokService);
    protected serviceScope: ServiceScope;

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            this.serviceScope = serviceScope;
        });
    }

    public async getTikTokAccount(tiktokUsername: string): Promise<IAccount> {
        console.log(`TikTokService#getTikTokAccount`);
        try {
            const tiktokAccount = await axios.get(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/${tiktokUsername}`);
            const responseMedia = tiktokAccount?.data;
            console.log("\n responseAccount : ", responseMedia, "\n");
            const substitute = responseMedia.html.replace(`data-embed-from="oembed"`, "");
            console.log("substitute : ", substitute);
            const account: IAccount = {
                titre: responseMedia.title,
                urlAuteur: responseMedia.author_url,
                name: responseMedia.author_name,
                width: responseMedia.width,
                height: responseMedia.height,
                html: substitute,
                lienTikTok: responseMedia.provider_url,
            };
            return account;
        } catch (error) {
            console.log("erreur: ", error);
        }
    }

    public async getTikTokMedia(mediaID: number | string): Promise<IMedia> {
        console.log(`TikTokService#getTikTokMedia`);
        try {
            const tiktokAccount = await axios.get(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/video/${mediaID}`);
            const responseMedia = tiktokAccount?.data;
            console.log("\n responseMedia : ", responseMedia, "\n");
            const media: IMedia = {
                titre: responseMedia.title,
                urlAuteur: responseMedia.author_url,
                name: responseMedia.author_name,
                width: responseMedia.width,
                height: responseMedia.height,
                html: responseMedia.html,
                thumbnailURL: responseMedia.thumbnail_url,
                lienTikTok: responseMedia.provider_url,
            };
            return media;
        } catch (error) {
            console.log("erreur: ", error);
        }
    }
}