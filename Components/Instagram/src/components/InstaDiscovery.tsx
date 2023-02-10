import * as React from 'react';
import styles from '../webparts/instaAccount/InstaAccount.module.scss';
import { ServiceScope } from '@microsoft/sp-core-library';
import { InstaService, IDiscoveryAccount } from "../model/InstaService";
import * as StackInsta from './InstaStack';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { Stack } from 'office-ui-fabric-react';
import * as InstaImage from './InstaImage';
import * as InstaVideo from './InstaVideo';
import * as InstaPopUp from './InstaModal';
import * as Publication from './InstaPublication';
import { useId } from '@fluentui/react-hooks';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export interface IInstaDiscoveryProps {
    nbInstaCards: number,
    accountName: string,
    serviceScope: ServiceScope;
    clickHandler: () => void;
}

export const InstaDiscovery = (props: IInstaDiscoveryProps) => {

    const [current, setCurrent] = React.useState<any>(null);
    const [discovery, setDiscovery] = React.useState<IDiscoveryAccount>(null);
    const [etatModal, setEtatModal] = React.useState<boolean>(false);
    const titleId = useId('title');

    const {
        nbInstaCards,
        accountName
    } = props;

    React.useEffect(() => {
        const instaService = props.serviceScope.consume(InstaService.serviceKey);

        const getAccountData = async () => {
            const [_test] = await Promise.all([instaService.getPublicationsCollection(accountName)]);
            console.log("val reçue dans le TSX : ", _test)
            setDiscovery(_test)
        }
        getAccountData();
    }, [accountName]);

    if (!discovery) {
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
    return (

        <div className={styles.post}>
            <div className={styles.ProfileDescription}>
                <section className={styles.borderFlexStyle}>
                    <div>
                        <img className={styles.profilePic} src={discovery.profile_picture_url} alt="" />
                    </div>
                    <div className={styles.gapBetweenProfile}>

                    </div>
                    <div>
                        <p className={styles.username}>{discovery.username}</p>
                        <div>
                            <section className={styles.compteurs}>
                                <div><p><b>{discovery.media_count}</b> publications</p></div>
                                <div className={styles.stats}><p><b>{discovery.followers_count}</b> abonnés</p></div>
                                <div className={styles.stats}><p><b>{discovery.follows_count}</b> abonnements</p></div>
                            </section>

                            <p><b>{discovery.name}</b></p>
                            <p>{discovery.biography}</p>
                            {
                                (discovery.website) && <a href={discovery.website} target="_blank">Lien vers le site</a>
                            }
                            <p> </p>
                        </div>
                    </div>
                </section>
            </div>
            <div className={styles.container}>
                <Stack tokens={StackInsta.sectionStackTokens}>
                    <Stack horizontal wrap styles={StackInsta.stackStylesAccount} tokens={StackInsta.wrapStackTokens}>
                        {discovery.media.slice(0, nbInstaCards).map((media) =>
                            <>
                                {
                                    (media.media_url) &&
                                    (
                                        <span onClick={(event) => { setEtatModal(true); setCurrent(media) }} style={StackInsta.itemStyles}>
                                            {
                                                (media.media_type == "IMAGE") && (<InstaImage.Image mediaURL={media.media_url} origine="ImageAccount" />)
                                            }
                                            {
                                                (media.media_type == "CAROUSEL_ALBUM") && (<><InstaImage.Image mediaURL={media.media_url} origine="ImageAccount" /><Icon iconName="ChromeRestore" className={styles.playIcon} /></>) 
                                            }
                                            {
                                                (media.media_type == "VIDEO") && (<><InstaVideo.Video mediaURL={media.media_url} origine="Discovery" /><Icon iconName="TriangleSolidRight12" className={styles.playIcon} /></>)
                                            }
                                            {/* {
                                                (media.media_type == "REEL") && (<><InstaVideo.Video mediaURL={media.media_url} origine="Discovery" /><Icon iconName="TriangleSolidRight12" className={styles.playIcon} /></>)
                                            } */}
                                        </span>
                                    )
                                }
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
                            (current != null) &&
                            (<Publication.PubliInsta media={current} account={discovery} />)
                        }
                        {console.log("current ", current)}
                    </div>
                </Modal>
            </div>
        </div>
    );

}