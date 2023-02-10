import * as React from 'react';
import stylesPubli from '../webparts/instaPublication/InstaPublication.module.scss';
import stylesAccount from '../webparts/instaAccount/InstaAccount.module.scss';


export function Video(props): JSX.Element {
    return (
        <>
            {
                (props.origine == "Publication") && (<video controls loop className={stylesPubli.postPubliImage} src={props.mediaURL} />)
            }
            {
                (props.origine == "Account Preview") && (<video controls loop className={stylesAccount.postImage} src={props.mediaURL} />)
            }
            {
                (props.origine == "Discovery") && (<video className={stylesPubli.postThumbnail} src={props.mediaURL} />)
            }
        </>
    );
}