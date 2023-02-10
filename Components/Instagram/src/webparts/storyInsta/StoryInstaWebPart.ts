import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IStoryInstaProps, StoryInsta } from '../../components/StoryInsta';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField, 
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import * as strings from 'StoryInstaWebPartStrings';


export interface IStoryInstaWebPartProps {
  nbInstaStories: number,
}

export default class StoryInstaWebPart extends BaseClientSideWebPart<IStoryInstaWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IStoryInstaProps> = React.createElement(
      StoryInsta,
      {
        // description: this.properties.description,
        nbInstaStories: this.properties.nbInstaStories,
        serviceScope: this.context.serviceScope

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

                PropertyPaneSlider('nbInstaStories',{
                  label:"Nombre de Stories",
                  min:1,
                  max:5,
                  showValue:true,
                  step:1

                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
