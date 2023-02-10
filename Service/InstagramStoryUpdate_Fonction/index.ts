import { AzureFunction, Context } from "@azure/functions"
import { IItemAddResult, sp } from "@pnp/sp-commonjs";
import { SPFetchClient } from "@pnp/nodejs-commonjs";
import axios from "axios";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);
    let responseStory;
    let responseAccount;
    try {
        axios.all([
            responseStory = await axios.get(`https://graph.facebook.com/v14.0/${process.env.instagramID}/stories?fields=media_type%2Cmedia_url%2Cthumbnail_url%2Cpermalink%2Ccaption%2Ctimestamp%2Cusername&limit=5&access_token=EAAGGBo1ZC7mMBALdSobEhUjZAtGmnZAODCWAWq47ZAKCj8wubDgZAVZARj86Dp6ZBvILbzgiZA3YoQSnnOrUx1KtRCZCei5IFTx68jL55mpAOLsMSDHiWP3HKkZC9tCGVgZBKjq1gZCmyDflHZBDVZAchNmdHEGOMNWmZBcjsBNid2DoQGCHAG2E9QWvICy`),
            responseAccount = await axios.get(`https://graph.facebook.com/v14.0/${process.env.instagramID}?fields=profile_picture_url&access_token=EAAGGBo1ZC7mMBALdSobEhUjZAtGmnZAODCWAWq47ZAKCj8wubDgZAVZARj86Dp6ZBvILbzgiZA3YoQSnnOrUx1KtRCZCei5IFTx68jL55mpAOLsMSDHiWP3HKkZC9tCGVgZBKjq1gZCmyDflHZBDVZAchNmdHEGOMNWmZBcjsBNid2DoQGCHAG2E9QWvICy`)
        ]);
        context.log("La requete Instagram s'est bien passée !")
    } catch (error) {
        context.log("Erreur lors de la requete Instagram : \n", error)
    }

    const dataStory = responseStory.data.data;
    const dataAccount = responseAccount.data.profile_picture_url;
    const dataFromInsta = [
        dataStory[0],
        dataStory[1],
        dataStory[2],
        dataStory[3],
        dataStory[4]
    ]

    try {
        sp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new SPFetchClient(process.env.siteURL, process.env.clientID, process.env.clientSecret);
                },
            },
        });

        const result = await sp.web.getList(process.env.listURL).items.select("Title,Id").get();
        let ligneData;
        result.forEach(element => {
            if (element.Title == "Requete API Story Instagram") {
                ligneData = element;
            }
        });

        let tabResult = [""];

        if (ligneData) {
            const updatedItem = await sp.web.getList(process.env.listURL).items.getById(ligneData.ID).select("DataStory,DataStory2,DataStory3,DataStory4,DataStory5").get();
            const dataFromSP = [
                JSON.parse(updatedItem.DataStory),
                JSON.parse(updatedItem.DataStory2),
                JSON.parse(updatedItem.DataStory3),
                JSON.parse(updatedItem.DataStory4),
                JSON.parse(updatedItem.DataStory5)
            ]
            dataFromSP.forEach(element => {
                if (element?.id == dataFromInsta[0]?.id) {
                    dataFromInsta[0] = "";
                }
                else if (element?.id == dataFromInsta[1]?.id) {
                    dataFromInsta[1] = "";
                }
                else if (element?.id == dataFromInsta[2]?.id) {
                    dataFromInsta[2] = "";
                }
                else if (element?.id == dataFromInsta[3]?.id) {
                    dataFromInsta[3] = "";
                }
                else if (element?.id == dataFromInsta[4]?.id) {
                    dataFromInsta[4] = "";
                }
            });
            let incrSP: number = 0;
            for (let incrInsta = 0; incrInsta < 5; incrInsta++) {
                if (dataFromInsta[incrInsta]) {
                    tabResult[incrInsta] = dataFromInsta[incrInsta]
                }
                else {
                    tabResult[incrInsta] = dataFromSP[incrSP]
                    incrSP++
                }

            }
        } else {
            tabResult = dataFromInsta;
        }

        context.log("tableau envoyé dans SP : ", tabResult)
        if (ligneData?.Title == "Requete API Story Instagram") {
            const updatedItem = await sp.web.getList(process.env.listURL).items.getById(ligneData.ID).update({
                DataAccount: dataAccount,
                DataStory: JSON.stringify(tabResult[0]),
                DataStory2: JSON.stringify(tabResult[1]),
                DataStory3: JSON.stringify(tabResult[2]),
                DataStory4: JSON.stringify(tabResult[3]),
                DataStory5: JSON.stringify(tabResult[4])
            });
            context.log("L'update s'est bien passé !")
        }
        else {
            const createItem: IItemAddResult = await sp.web.getList(process.env.listURL).items.add({
                Title: "Requete API Story Instagram",
                DataAccount: dataAccount,
                DataStory: JSON.stringify(tabResult[0]),
                DataStory2: JSON.stringify(tabResult[1]),
                DataStory3: JSON.stringify(tabResult[2]),
                DataStory4: JSON.stringify(tabResult[3]),
                DataStory5: JSON.stringify(tabResult[4])
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
