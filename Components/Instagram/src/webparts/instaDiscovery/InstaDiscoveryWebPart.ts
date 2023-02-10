import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IInstaDiscoveryProps, InstaDiscovery } from '../../components/InstaDiscovery';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField, 
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import * as strings from 'InstaDiscoveryWebPartStrings';

export interface IInstaDiscoveryWebPartProps {
  description: string,
  nbInstaCards: number,
  accountName: string,
  clickHandler: () => void;
}

export default class InstaDiscoveryWebPart extends BaseClientSideWebPart<IInstaDiscoveryWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IInstaDiscoveryProps> = React.createElement(
      InstaDiscovery,
      {
        // description: this.properties.description,
        accountName: this.properties.accountName,
        nbInstaCards: this.properties.nbInstaCards,
        serviceScope: this.context.serviceScope,
        clickHandler: this.button_click

      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  public button_click(): void {
    alert("CLICKED!");
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

                PropertyPaneSlider('nbInstaCards',{
                  label:"Nombre de publications",
                  min:1,
                  max:25,
                  showValue:true,
                  step:1

                }),

                PropertyPaneTextField('accountName', {
                  label: 'Nom du compte Instagram'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
