import * as React from 'react';
import styles from '../webparts/instaAccount/InstaAccount.module.scss';
import { ServiceScope } from '@microsoft/sp-core-library';
import { ICollection, InstaService, ISPFxList } from "../model/InstaService";
import * as StackInsta from './InstaStack';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { Stack } from 'office-ui-fabric-react';
import * as InstaImage from './InstaImage';
import * as InstaPopUp from './InstaModal';
import * as Publication from './InstaPublication';
import { useId } from '@fluentui/react-hooks';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

 /**
 * Fonction de récupération des données de la liste SharePoint
 * @return { Promise<ISPFxList[]> } data
 */
export interface IInstaCollectionProps {
  nbInstaCards: number,
  serviceScope: ServiceScope;
  clickHandler: () => void;
}

export const InstaCollection = (props: IInstaCollectionProps) => {

  const [listData, setListData] = React.useState<ISPFxList[]>(null);
  const [current, setCurrent] = React.useState<ICollection>(null);
  const [etatModal, setEtatModal] = React.useState<boolean>(false);
  const titleId = useId('title');


  const {
    nbInstaCards
  } = props;

  React.useEffect(() => {
    const instaService = props.serviceScope.consume(InstaService.serviceKey);

    const getAccountData = async () => {
      const [_listData] = await Promise.all([instaService.getInstaData()]);
      setListData(_listData);
    }
    getAccountData();
  }, []);

  if (!listData) {
    return (
      <div className={styles.post}>
        <div className={styles.ProfileDescription}>
          <section className={styles.borderFlexStyle}>
            <div>
              <Shimmer />
            </div>
            <div>
              <p className={styles.username}><Shimmer /></p>
              <div>
                <section className={styles.compteurs}>
                  <div><p><b><Shimmer /></b> publications</p></div>
                  <div className={styles.stats}><p><b><Shimmer /></b> abonnés</p></div>
                  <div className={styles.stats}><p><b><Shimmer /></b> abonnements</p></div>
                </section>
                <p><b><Shimmer /></b></p>
                <p><Shimmer /></p>
              </div>
            </div>
          </section>
        </div>
        <Shimmer />
      </div>
    )
  }
  const lstAccount = JSON.parse(listData[0].account);
  const lstCollection = JSON.parse(listData[0].collection);
  return (

    <div className={styles.post}>
      <div className={styles.ProfileDescription}>
        <section className={styles.borderFlexStyle}>
          <div>
            <img className={styles.profilePic} src={lstAccount.profile_picture_url} alt="" />
          </div>
          <div className={styles.gapBetweenProfile}>

          </div>
          <div>
            <p className={styles.username}>{lstAccount.username}</p>
            <div>
              <section className={styles.compteurs}>
                <div><p><b>{lstAccount.media_count}</b> publications</p></div>
                <div className={styles.stats}><p><b>{lstAccount.followers_count}</b> abonnés</p></div>
                <div className={styles.stats}><p><b>{lstAccount.follows_count}</b> abonnements</p></div>
              </section>

              <p><b>{lstAccount.name}</b></p>
              <p>{lstAccount.biography}</p>
            </div>
          </div>
        </section>
      </div>
      <div className={styles.container}>
        <Stack tokens={StackInsta.sectionStackTokens}>
          <Stack horizontal wrap styles={StackInsta.stackStylesAccount} tokens={StackInsta.wrapStackTokens}>
            {lstCollection.slice(0,nbInstaCards).map((media) =>
              <>
                <span onClick={(event) => { setEtatModal(true); setCurrent(media) }} style={StackInsta.itemStyles}>
                  {
                    (media.media_type == "IMAGE") && (<InstaImage.Image mediaURL={media.media_url} origine="ImageAccount" />)
                  }
                  {
                    (media.media_type == "CAROUSEL_ALBUM") && (<><InstaImage.Image mediaURL={media.media_url} origine="ImageAccount" /><Icon iconName="ChromeRestore" className={styles.playIcon} /></>)
                  }
                  {
                    (media.media_type == "VIDEO") && (<><InstaImage.Image mediaURL={media.thumbnail_url} origine="Video" /><Icon iconName="TriangleSolidRight12" className={styles.playIcon} /></>)
                  }
                </span>

              </>
            )}
          </Stack>
        </Stack>
        <Modal
          titleAriaId={titleId}
          isOpen={etatModal}
          onDismiss={() => setEtatModal(false)}
          isBlocking={false}
          containerClassName={InstaPopUp.contentStyles.container}
        >
          <div className={InstaPopUp.contentStyles.header}>
            <span id={titleId}>Publication Instagram</span>
            <IconButton
              styles={InstaPopUp.iconButtonStyles}
              iconProps={InstaPopUp.cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => setEtatModal(false)}
            />
          </div>
          <div className={InstaPopUp.contentStyles.body}>
            {(current == null) && (<Shimmer />)}
            {
              (current != null) && (<p>{current.media_url}</p>) &&
              (<Publication.PubliInsta media={current} account={lstAccount} />)
            }
            {console.log("current ", current)}
          </div>
        </Modal>
      </div>
    </div>
  );
}