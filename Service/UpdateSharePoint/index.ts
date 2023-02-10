import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from 'axios';
import { IItemAddResult, sp } from "@pnp/sp-commonjs";
import { SPFetchClient } from "@pnp/nodejs-commonjs";


export interface IAccount {
    username: string;
    name: string;
    biography: string;
    follows_count: number;
    followers_count: number;
    media_count: number;
    profile_picture_url: string;
    id: number
}

export interface ILastPublication {
    media_type: string;
    media_product_type: string;
    media_url: string;
    caption: string;
    permalink: string;
    like_count: number;
    timestamp: number | string;
    children: {};
    id: number
}

export interface ICollection {
    media_type: string;
    media_url: string;
    thumbnail_url: string;
    children: {};
    permalink: string;
    like_count: number;
    timestamp: string | number;
    comments_count: number,
    id: number
}

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any, req: HttpRequest): Promise<void> {
    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran again!', timeStamp);

    let instaLastMedia;
    let instaAcount;
    let instaMediaCollection;
    try {
        axios.all([
            instaLastMedia = await axios.get(`https://graph.facebook.com/v14.0/${process.env.instagramID}/media?fields=id%2Ccaption%2Cmedia_type%2Cmedia_product_type%2Cmedia_url%2Cpermalink%2Clike_count%2Ctimestamp%2Cchildren%7Bmedia_url%7D&access_token=${process.env.instaAccessToken}&limit=1`),
            instaAcount = await axios.get(`https://graph.facebook.com/v13.0/${process.env.instagramID}?fields=username%2Cname%2Cbiography%2Cid%2Cfollows_count%2Cfollowers_count%2Cmedia_count%2Cprofile_picture_url&access_token=${process.env.instaAccessToken}`),
            instaMediaCollection = await axios.get(`https://graph.facebook.com/v14.0/${process.env.instagramID}/media?fields=media_type%2Cmedia_url%2Cthumbnail_url%2Cchildren%7Bmedia_type%2Cmedia_url%7D%2Cpermalink%2Ccaption%2Clike_count%2Ctimestamp%2Ccomments_count&limit=${process.env.nbPubliRequested}&access_token=${process.env.instaAccessToken}`)
        ]);
        context.log("La requete Instagram s'est bien passée !")
    } catch (error) {
        context.log("Erreur lors de la requete Instagram : ", error)
    }
    const publication = instaLastMedia.data.data[0];
    const account = instaAcount.data;
    const tabCollection = instaMediaCollection.data.data;
    context.log("publication : ", publication)
    context.log("account : ", account)
    context.log("tabCollection : ", tabCollection)
    try {
        // configure your node options (only once in your application)
        sp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new SPFetchClient(process.env.siteURL, process.env.clientID, process.env.clientSecret);
                },
            },
        });
        const result: any[] = await sp.web.getList(process.env.listURL).items.select("Title,Id").get()
        let ligneData;
        result.forEach(element => {
            if (element.Title == "Requete API Instagram") {
                ligneData = element;
            }
        });
        // context.log("list Titre :", result[0]?.Title, "list Id :", result[0]?.Id);
        // context.log("les elements à requeter sont : ", resultat)
        // context.log("list Titre :", result[0]?.Title, "list Id :", result[0]?.Id, " et les elements à requetes sont :", ligneData?.Comptes_Business, " et avec le JSON.strigify ca donne ca : ", JSON.parse(ligneData?.Comptes_Business));
        // const parsedLigneData = ligneData?.Comptes_Business;
        // context.log("parsedLigneData : ",parsedLigneData,"parsedLigneData.Compte1 : ",parsedLigneData[0].Compte1)

        if (ligneData?.Title == "Requete API Instagram") {
            const updatedItem = await sp.web.getList(process.env.listURL).items.getById(ligneData.Id).update({
                DataAccount: JSON.stringify(account),
                DataMediaCollection: JSON.stringify(tabCollection),
                DataMediaLastPublication: JSON.stringify(publication)
            });
            context.log("L'update s'est bien passé !")
        }
        else {
            const iar: IItemAddResult = await sp.web.getList(process.env.listURL).items.add({
                Title: "Requete API Instagram",
                DataAccount: JSON.stringify(account),
                DataMediaCollection: JSON.stringify(tabCollection),
                DataMediaLastPublication: JSON.stringify(publication)
            });
            context.log("L'envoi des données s'est bien passé")
        }
    } catch (e) {
        context.log("Erreur :", e);
        context.res = {
            status: 200,
            body: false
        }
    }
}
export default timerTrigger;
