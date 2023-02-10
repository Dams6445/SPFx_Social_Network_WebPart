import * as React from 'react';
import { ServiceScope } from '@microsoft/sp-core-library';
import { IAccount, TikTokService } from "../model/TikTokService";
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface ITikTokAccountProps {
  serviceScope: ServiceScope,
  usernameTikTok : string
}

export const tiktokAccount = (props: ITikTokAccountProps) => {
  const [tikTokAccount, setTikTokAccount] = React.useState<IAccount>(null);

  const {
    usernameTikTok
  } = props;
  React.useEffect(() => {
    const tikTokservice = props.serviceScope.consume(TikTokService.serviceKey);

      const getAccountData = async () => {
        const [_accountData] = await Promise.all([tikTokservice.getTikTokAccount(usernameTikTok)]);
        console.log("accountData : ", _accountData);
        await SPComponentLoader.loadScript("https://www.tiktok.com/embed.js")
        setTikTokAccount(_accountData);
      }
      getAccountData();
    
  }, [usernameTikTok]);

  if (!tikTokAccount) {
    return (
      <Shimmer />
    )
  }
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: tikTokAccount.html }} />
    </>
  )
}
