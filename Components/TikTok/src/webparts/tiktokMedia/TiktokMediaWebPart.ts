import * as React from 'react';
import * as ReactDom from 'react-dom';
import {ITikTokMediaProps, TiktokMedia} from '../../components/TiktokMedia';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import * as strings from 'TiktokMediaWebPartStrings';

export interface ITiktokMediaWebPartProps {
  usernameTikTok: string,
  idMedia: string
}

export default class TiktokMediaWebPart extends BaseClientSideWebPart<ITiktokMediaWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<ITikTokMediaProps> = React.createElement(
      TiktokMedia,
      {
        usernameTikTok: this.properties.usernameTikTok,
        idMedia: this.properties.idMedia,
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

                PropertyPaneTextField('idMedia', {
                  label: 'ID du média TikTok'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
