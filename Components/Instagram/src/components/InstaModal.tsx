import * as React from 'react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    Modal,
    IIconProps,
} from '@fluentui/react';
import { IconButton, IButtonStyles } from '@fluentui/react/lib/Button';
import * as Account from './InstaAccount';

// export function InstaPopUp(props): JSX.Element {
//     // const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
//     const titleId = useId('title');
//     return (
//         <Modal
//             titleAriaId={titleId}
//             isOpen={Account.isModalOpen}
//             onDismiss={Account.hideModal}
//             isBlocking={false}
//             containerClassName={contentStyles.container}
//         >
//             <div className={contentStyles.header}>
//                 <span id={titleId}>Publication Instagram</span>
//                 <IconButton
//                     styles={iconButtonStyles}
//                     iconProps={cancelIcon}
//                     ariaLabel="Close popup modal"
//                     onClick={Account.hideModal}
//                 />
//             </div>
//             <div className={contentStyles.body}>
//                 <img src={props.media_url} />
//             </div>
//         </Modal>
//     )
// }

export const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const theme = getTheme();
export const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
    },
    header: [
        // eslint-disable-next-line deprecation/deprecation
        theme.fonts.xLargePlus,
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: 'flex',
            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '12px 12px 14px 24px',
        },
    ],
    body: {
        maxWidth: '600px',
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
            p: { margin: '14px 0' },
            'p:first-child': { marginTop: 0 },
            'p:last-child': { marginBottom: 0 },
        },
    },
});
// const stackProps: Partial<IStackProps> = {
//   horizontal: true,
//   tokens: { childrenGap: 40 },
//   styles: { root: { marginBottom: 20 } },
// };
export const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};
