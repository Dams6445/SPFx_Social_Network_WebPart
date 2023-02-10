import * as React from 'react';
import stylesPubli from '../webparts/instaPublication/InstaPublication.module.scss';
import stylesAccount from '../webparts/instaAccount/InstaAccount.module.scss';


// export const playIcon = () => <Icon iconName="Play" />

// export function playIcone(): JSX.Element {
//     return (
//         <Icon iconName="Play" className={stylesPubli.playIcon} />
//     )
// }

export function Image(props): JSX.Element {
    return (
        <>
            {
                (props.origine == "ImageAccount") && (<img src={props.mediaURL} className={stylesPubli.postAccountImage} />)
            }
            {
                (props.origine == "ImagePublication") && (<img src={props.mediaURL} className={stylesPubli.postPubliImage} />)
            }
            {
                (props.origine == "Video") && (<img src={props.mediaURL} className={stylesPubli.postThumbnail} />)
            }
        </>
    );
}
