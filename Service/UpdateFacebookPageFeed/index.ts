import { AzureFunction, Context } from "@azure/functions";
import axios from 'axios';
import { IItemAddResult, sp } from "@pnp/sp-commonjs";
import { SPFetchClient } from "@pnp/nodejs-commonjs";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);
    let fbFeed;
    try {
        fbFeed = await axios.get(`https://graph.facebook.com/v14.0/${process.env.facebookPageID}/feed?fields=id%2Cmessage%2Cstory%2Cfull_picture%2Cpermalink_url%2Ccreated_time%2Cfrom%7Bid%2Cname%2Cpicture%7D&access_token=${process.env.instaAccessToken}`)

        context.log("La requete Facebook s'est bien passée !")
    } catch (error) {
        context.log("Erreur lors de la requete Facebook : ", error)
    }

    const fbPage = fbFeed?.data.data;

    try {
        // configure your node options (only once in your application)
        sp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new SPFetchClient(process.env.siteURL, process.env.clientID, process.env.clientSecret);
                },
            },
        });

        const result: any[] = await sp.web.getList(process.env.listURL).items.select("Title,Id").get();
        let ligneData;
        result.forEach(element => {
            if (element.Title == "Requete API Facebook") {
                ligneData = element;
            }
        });
        context.log("list Titre :", result[0]?.Title, "list Id :", result[0]?.Id);

        if (ligneData?.Title == "Requete API Facebook") {
            const updatedItem = await sp.web.getList(process.env.listURL).items.getById(ligneData.Id).update({
                DataFacebook: JSON.stringify(fbPage)
            });
            context.log("L'update s'est bien passé !")
        }
        else {
            const iar: IItemAddResult = await sp.web.getList(process.env.listURL).items.add({
                Title: "Requete API Facebook",
                DataFacebook: JSON.stringify(fbPage)
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
};

export default timerTrigger;
