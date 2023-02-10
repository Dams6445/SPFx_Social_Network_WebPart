import * as React from 'react';
import { ServiceScope } from '@microsoft/sp-core-library';
import { IAccount, TikTokService} from "../model/TikTokService";
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface ITikTokMediaProps {
  serviceScope: ServiceScope,
  usernameTikTok : string,
  idMedia: string
}

export const TiktokMedia = (props: ITikTokMediaProps) => {
  const [tiktokMedia, setTiktokMedia] = React.useState<IAccount>(null);

  const {
    idMedia
  } = props;

  React.useEffect(() => {
    const tikTokservice = props.serviceScope.consume(TikTokService.serviceKey);

    const getMediaData = async () => {
      const [_mediaData] = await Promise.all([tikTokservice.getTikTokMedia(idMedia)]);
      console.log("MediaData : ",_mediaData);
      await SPComponentLoader.loadScript("https://www.tiktok.com/embed.js")
      setTiktokMedia(_mediaData);
    }
    getMediaData();
  }, [idMedia]);

  if (!tiktokMedia) {
    return(
      <Shimmer />
    )
  }
  return (
    <div dangerouslySetInnerHTML={{ __html: tiktokMedia.html }} />
  )
}
