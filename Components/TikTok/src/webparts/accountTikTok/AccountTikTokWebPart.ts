import * as React from 'react';
import * as ReactDom from 'react-dom';
import {ITikTokAccountProps, tiktokAccount} from '../../components/AccountTikTok';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField, 
  PropertyPaneButton
} from '@microsoft/sp-property-pane';
import * as strings from 'AccountTikTokWebPartStrings';

export interface IAccountTikTokWebPartProps {
  usernameTikTok: string
}

export default class AccountTikTokWebPart extends BaseClientSideWebPart<IAccountTikTokWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<ITikTokAccountProps> = React.createElement(
      tiktokAccount,
      {
        usernameTikTok: this.properties.usernameTikTok,
        serviceScope: this.context.serviceScope,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Nom Web Part'
                }),

                PropertyPaneTextField('usernameTikTok', {
                  label: 'Username TikTok (exemple : @username)'
                }),
                // PropertyPaneButton('buttonRefresh', {
                //   onClick : window.location.reload()
                // })
              ]
            }
          ]
        }
      ]
    };
  }

  // protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
  //   if (propertyPath === 'listName' && newValue) {
  //     // push new list value
  //     super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  //     // refresh the item selector control by repainting the property pane
  //     this.context.propertyPane.refresh();
  //     // re-render the web part as clearing the loading indicator removes the web part body
  //     this.render();      
  //   }
  //   else {
  //     super.onPropertyPaneFieldChanged(propertyPath, oldValue, oldValue);
  //   }
  // }
}
