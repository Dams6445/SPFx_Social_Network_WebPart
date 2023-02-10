import * as React from 'react';
import * as ReactDom from 'react-dom';
import {IFaceBookAccountProps, FaceBookFeed} from '../../components/FaceBookAccount'
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField, 
  PropertyPaneSlider,
} from '@microsoft/sp-property-pane';
import * as strings from 'FaceBookAccountWebPartStrings';


export interface IFaceBookAccountWebPartProps {
  nbFeed : number
}

export default class FaceBookAccountWebPart extends BaseClientSideWebPart<IFaceBookAccountWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IFaceBookAccountProps> = React.createElement(
        FaceBookFeed, {
        serviceScope: this.context.serviceScope,
        nbFeed: this.properties.nbFeed,
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

                PropertyPaneSlider('nbFeed',{
                  label:"Nombre de post",
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
