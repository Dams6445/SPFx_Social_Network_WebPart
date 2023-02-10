import * as React from 'react';
import { InstaService,ISPFxList } from "../model/InstaService";
import styles from '../webparts/instaPublication/InstaPublication.module.scss';
import { ServiceScope } from '@microsoft/sp-core-library';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import * as InstaCarousel from './InstaCarousel';
import * as InstaVideo from './InstaVideo';
import * as InstaImage from './InstaImage';

export interface IInstaPublicationProps {
  serviceScope: ServiceScope;
}

export function PubliInsta(props): JSX.Element {
  console.log("media dans la publi : ",props.media);
  console.log("account dans la publi : ",props.account);
  const media = props.media;
  const account = props.account;
  console.log("const media dans la publi : ",media);
  console.log("const account dans la publi : ",account);
  return (
    <div className={styles.post}>
      <div className={styles.info}>
        <div className={styles.user}>
          <div className={styles.profilePic}>
            <img src={account.profile_picture_url} alt="Profile Picture" />
          </div>
          <p className={styles.username}>{account.username}</p>
        </div>
      </div>
      {
        (media.media_type == "IMAGE") && (<InstaImage.Image mediaURL={media.media_url} origine="ImagePublication" />)
      }
      {
        (media.media_type == "VIDEO") && (<InstaVideo.Video mediaURL={media.media_url} origine="Publication"/>) 
      }
      {
        (media.media_type == "CAROUSEL_ALBUM") && (<InstaCarousel.SimpleSlider tabData={media.children} />)
      }
      <div className={styles.postContent}>
        <p className={styles.likes}>{media.like_count} likes</p>
        <p className={styles.description}><span>{account.username} </span> {media.caption}</p>
        <p className={styles.postTime}>{media.timestamp}</p>
      </div>
    </div>
  )
}

export const InstaPublication = (props: IInstaPublicationProps) => {

  // const [account, setAccount] = React.useState<IAccount>(null);
  // const [publication, setPublication] = React.useState<IMedia>(null);
  const [listData, setListData] = React.useState<ISPFxList[]>(null);

  React.useEffect(() => {
    const instaService = props.serviceScope.consume(InstaService.serviceKey);

    const getAccountData = async () => {
      const [_listData] = await Promise.all([instaService.getInstaData()]);
      // const [_account, _collection, _listData] = await Promise.all([instaService.getAccount(), instaService.getPublicationsCollection(nbInstaCards), instaService.getLastStories()]);
      // setAccount(_account);
      // setCollection(_collection);
      setListData(_listData);
    }
    getAccountData();
  }, []);

  if (!listData) {
    return (
      <div className={styles.post}>
        <div className={styles.info}>
          <div className={styles.user}>
            <div className={styles.profilePic}>
              <Shimmer />
            </div>
            <p className={styles.username}><Shimmer /></p>
          </div>
        </div>
        <Shimmer />
        <div className={styles.postContent}>
          <p className={styles.likes}><Shimmer /> likes</p>
          <p className={styles.description}><span><Shimmer /> </span><Shimmer /></p>
          <p className={styles.postTime}><Shimmer /></p>
        </div>
      </div>
    );
  }
  const lstAccount = JSON.parse(listData[0].account);
  const lstLastPubli = JSON.parse(listData[0].lastPublication);
  // const lstCollection = JSON.parse(listData[0].collection);
  return (
    <div className={styles.post}>
      <div className={styles.info}>
        <div className={styles.user}>
          <div className={styles.profilePic}>
            <img src={lstAccount.profile_picture_url} alt="Profile Picture" />
          </div>
          <p className={styles.username}>{lstAccount.username}</p>
        </div>
      </div>
      {
        (lstLastPubli.media_type == "IMAGE") && (<InstaImage.Image mediaURL={lstLastPubli.media_url} origine="ImagePublication" />)
      }
      {
        (lstLastPubli.media_type == "VIDEO") && (<InstaVideo.Video mediaURL={lstLastPubli.media_url} origine="Publication"/>)
      }
      {
        (lstLastPubli.media_type == "CAROUSEL_ALBUM") && (<InstaCarousel.SimpleSlider tabData={lstLastPubli.children} />)
      }
      <div className={styles.postContent}>
        <p className={styles.likes}>{lstLastPubli.like_count} likes</p>
        <p className={styles.description}><span>{lstAccount.username} </span> {lstLastPubli.caption}</p>
        <p className={styles.postTime}>{lstLastPubli.timestamp}</p>
      </div>
    </div>
  )
}