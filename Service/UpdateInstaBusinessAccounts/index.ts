import { AzureFunction, Context } from "@azure/functions";
import axios, { AxiosResponse } from 'axios';
import { IItemAddResult, sp } from "@pnp/sp-commonjs";
import { SPFetchClient } from "@pnp/nodejs-commonjs";


async function updateBusiness(username : string,ligneData : any,tabIds : string ) {
    var business;
    try {
        business = await axios.get(`https://graph.facebook.com/v14.0/17841453102781579?fields=business_discovery.username(${username})%7Busername%2Cwebsite%2Cname%2Cig_id%2Cid%2Cprofile_picture_url%2Cbiography%2Cfollows_count%2Cfollowers_count%2Cmedia_count%2Cmedia%7Bid%2Ccaption%2Clike_count%2Ccomments_count%2Ctimestamp%2Cusername%2Cmedia_product_type%2Cmedia_type%2Cowner%2Cpermalink%2Cmedia_url%2Cchildren%7Bmedia_url%7D%7D%7D&limit=25&access_token=${process.env.instaAccessToken}`)

        console.log("La requete Instagram Business s'est bien passée !")
    } catch (error) {
        console.log("Erreur lors de la requete Instagram Business : ", error)
    }
    try {
        console.log("Ligne data title : ",ligneData?.Title," username : ",ligneData?.Comptes_Business," ligne data id : ", ligneData?.Id  )
        if ((ligneData?.Title == "Requete Instagram Business") && (ligneData?.Comptes_Business == username)) {
            const updatedItem = await sp.web.getList(process.env.listURL).items.getById(ligneData.Id).update({
                Resultat_requete_business: JSON.stringify(business.data)
            });
            console.log("L'update s'est bien passé !")
        }
        else {
            const iar: IItemAddResult = await sp.web.getList(process.env.listURL).items.add({
                Title: "Requete Instagram Business",
                Resultat_requete_business: JSON.stringify(business.data)
            });
            console.log("L'envoi des données s'est bien passé")
        }
    } catch (error) {
        
    }
}
const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();
    var ligneData : any[any] = [];
    var tabName: string[] = [""];
    var tabIds : string[] = [""];
    var indice : number = 0;

    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);

    try {
        sp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new SPFetchClient(process.env.siteURL, process.env.clientID, process.env.clientSecret);
                },
            },
        });
        const result: any[] = await sp.web.getList(process.env.listURL).items.select("Title,Id,Comptes_Business").get();
        result.forEach(element => {
            if (element.Title == "Requete Instagram Business") {
                ligneData[indice] = element;
                tabName[indice] = element?.Comptes_Business
                tabIds[indice] = element?.Id
                indice++;
            }
        });
    } catch (error) {
        console.log("error : ", error)
    }
    context.log("tab Name : ",tabName )
    context.log("tab Ids : ", tabIds)
    for (let index = 0; index < tabName.length; index++) {
        context.log("ce que jenvoi :\ntabName[index] = ",tabName[index],"\nligneData = ", ligneData[index].Title, "\ntabIds[index] = ", tabIds[index] )
        updateBusiness(tabName[index],ligneData[index],tabIds[index])
        
    }
}

export default timerTrigger;
