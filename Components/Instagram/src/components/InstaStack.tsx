import * as React from 'react';
import * as FluentUI from '@fluentui/react';

// Non-mutating styles definition
export const itemStyles: React.CSSProperties = {
    alignItems: 'center',
    background: FluentUI.DefaultPalette.whiteTranslucent40,
    color: FluentUI.DefaultPalette.white,
    boxShadow: `0px 0px 10px 5px ${FluentUI.DefaultPalette.blackTranslucent40}`,
    height: 217,
    display: 'flex',
    justifyContent: 'center',
    width: 217,
    marginLeft: `auto`,
    marginTop: `10px`,
    marginRight: `auto`,
    marginBottom: `10px`
    
};

// Tokens definition
export const sectionStackTokens: FluentUI.IStackTokens = {
    childrenGap: 10,
    padding: ` 10px `
}
export const wrapStackTokens: FluentUI.IStackTokens = {
    childrenGap: 22,
};

export const stackStylesAccount: FluentUI.IStackStyles = {
    root: {
        background: FluentUI.DefaultPalette.whiteTranslucent40,
        width: `100%`,    //704 pour 3 publis par lignes //224 pour 1 publis par ligne // 464 pour 2 publis
        height: `auto`,
        
    },
};

export const stackStylesAccountPreview: FluentUI.IStackStyles = {
    root: {
        background: FluentUI.DefaultPalette.whiteTranslucent40,
        width: `100%`,     //704 pour 3 publis par lignes //224 pour 1 publis par ligne // 464 pour 2 publis
        height: `auto`,
    },
};
