import * as React from 'react';
import * as ReactDom from 'react-dom';
import {IInstaPublicationProps, InstaPublication} from '../../components/InstaPublication';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';


export interface IInstaPublicationWebPartProps {
}

export default class InstaPublicationWebPart extends BaseClientSideWebPart<IInstaPublicationWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IInstaPublicationProps> = React.createElement(
      InstaPublication, {
        serviceScope: this.context.serviceScope
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
