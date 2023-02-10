import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IInstaCollectionProps, InstaCollection } from '../../components/InstaAccount';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField, 
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import * as strings from 'InstaAccountWebPartStrings';


export interface IInstaAccountWebPartProps {
  description: string,
  nbInstaCards: number,
  clickHandler: () => void;
}

export default class InstaAccountWebPart extends BaseClientSideWebPart<IInstaAccountWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IInstaCollectionProps> = React.createElement(
      InstaCollection,
      {
        // description: this.properties.description,
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
                  max:100,
                  // value:this.properties.nbInstaCards,
                  showValue:true,
                  step:1

                }),
                // PropertyPaneButton('buttonRefresh', {
                //   onClick :{props.clickHandler}
                // })
              ]
            }
          ]
        }
      ]
    };
  }
}
