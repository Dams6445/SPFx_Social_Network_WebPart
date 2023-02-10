declare interface IInstaAccountWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'InstaAccountWebPartStrings' {
  const strings: IInstaAccountWebPartStrings;
  export = strings;
}
