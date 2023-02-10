import * as React from 'react';
import styles from '../webparts/faceBookAccount/FaceBookAccount.module.scss';
import { ServiceScope } from '@microsoft/sp-core-library';
import {  IFeed, FacebookService } from "../model/FacebookService";
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { DefaultButton } from 'office-ui-fabric-react';

export interface IFaceBookAccountProps {
  serviceScope: ServiceScope
  nbFeed : number
}

export const FaceBookFeed = (props: IFaceBookAccountProps) => {

  const [feed, setFeed] = React.useState<IFeed[]>(null);

  const {
    nbFeed
  } = props;

  React.useEffect(() => {
    const facebookService = props.serviceScope.consume(FacebookService.serviceKey);

    const getFeedData = async () => {
      const [_test] = await Promise.all([facebookService.getFacebookData()]);
      setFeed(_test);
    }
    getFeedData();
  }, []);

  if (!feed) {
    return (
      <Shimmer />
    )
  }
  return (
    <>
      {feed.slice(0,nbFeed).map((media) =>
        <>
          {console.log("media dans le map : ", media, "\n test de requeste : ", media.message)}
          <div className={styles.post}>
            <div className={styles.profile}>
              {
                (media?.profilePic) && (<img src={media.profilePic} alt="Author's Profile Picture" />)
              }
              {
                (!media?.profilePic) && (<div className={styles.contactIcon}><img src={require("../assets/default_User_Picture.png")} /></div>)
              }
              <div className={styles.etatBar}>
                <div className={styles.usernameStory}>
                  {
                    (!media.story) && (media?.auteur) && (<p>{media?.auteur}</p>)
                  }
                  {
                    (!media.story) && (!media?.auteur) && (<p>Facebook User</p>)
                  }
                  {
                    (media.story) && (<p>{media.story}</p>)
                  }
                </div>
                <div className={styles.timestamp}>
                  <p>{media.timestamp.replace("T", " ").replace("+0000", "")}</p>
                </div>
              </div>
            </div>
            {
              (media.message) && (<div className={styles.message}>
                <p>{media.message}</p>
              </div>)
            }
            {
              (media.full_picture) && (<div className={styles.content}>
                <img src={media.full_picture} alt="Post's Image or Thumbnail" />
              </div>)
            }
            <div className={styles.liens}>
              <DefaultButton className={styles.boutonLiens} ariaDescription="Redirection vers Meta" href={media.permalink_url}>Lien vers le post</DefaultButton>
            </div>
          </div>
        </>
      )}
    </>
  )
}
