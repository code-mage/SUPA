import * as azdev from 'azure-devops-node-api';
import { TeamContext } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { WorkItemQueryResult } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi';
import { Templates, ITemplate } from '../templates/template';
import * as Q from 'q';

class WIQLQuery {
  private static wiql: string =
    'SELECT [System.Id], [System.WorkItemType], [System.Title], [System.State], [System.AreaPath], [System.IterationPath], [##WorkItemThreadIdField##] FROM workitems WHERE [System.WorkItemType]="##WorkItemType##" AND [System.TeamProject] = "##ProjectName##" AND [System.AreaPath] UNDER "##ParentAreaPath##" AND [System.Tags] CONTAINS "##WorkItemIdentificationTag##" AND [##WorkItemThreadIdField##] CONTAINS "##IssueId##"';

  public static getQuery(template: ITemplate, issueId: string): string {
    let wiqlQuery = this.wiql;
    wiqlQuery.replace('##WorkItemType##', template.WorkItemType);
    wiqlQuery.replace('##ProjectName##', template.ProjectName);
    wiqlQuery.replace('##ParentAreaPath##', template.ParentAreaPath);
    wiqlQuery.replace(
      '##WorkItemIdentificationTag##',
      template.WorkItemIdentificationTag
    );
    wiqlQuery.replace(
      '##WorkItemThreadIdField##',
      template.WorkItemThreadIdField
    );
    wiqlQuery.replace('##IssueId##', issueId);

    return wiqlQuery;
  }
}

export class Devops {
  public template: ITemplate;
  private connection: azdev.WebApi;
  private witApi: IWorkItemTrackingApi;

  constructor() {
    this.template = Templates.MarketPlaceTemplate;
    this.connectToAzDev();
  }

  private connectToAzDev() {
    let orgUrl = this.template.orgUrl;
    let token: string = this.template.PAT;
    let authHandler = azdev.getPersonalAccessTokenHandler(token);
    this.connection = new azdev.WebApi(orgUrl, authHandler);
  }

  public getWorkItem(issueId: string): Q.Promise<WorkItemQueryResult> {
    let deferred = Q.defer<WorkItemQueryResult>();
    console.log(' sTARTING ' );
    if (!this.witApi) {
      console.log('1 ' );
      console.log(this.connection);
     this.connection.getWorkItemTrackingApi().then((api: IWorkItemTrackingApi) => {
      console.log('2 ' );
      this.witApi = api;
      this.queryWorkItem(issueId).then(
        (result: WorkItemQueryResult) => {
          console.log('3 ' );
          deferred.resolve(result);
        },
        (error: any) => {
          console.log(' WIT ' + error);
          deferred.reject(error);
        }
      );
     },
     (error: any) => {
      console.log(' Connection ' + error);
      deferred.reject(error);
     });
    }
    else {
      console.log('4 ' );
      this.queryWorkItem(issueId).then(
        (result: WorkItemQueryResult) => {
          console.log('5 ' );
          deferred.resolve(result);
        },
        (error: any) => {
          console.log(' WIT ' + error);
          deferred.reject(error);
        }
      );
    }
    return deferred.promise;
  }

  private queryWorkItem(issueId: string): Promise<WorkItemQueryResult> {
    console.log('QUERY: ' + issueId );
    const teamContext: TeamContext = {
      projectId: undefined,
      project: this.template.ProjectName,
      teamId: undefined,
      team: undefined
    };
    let wiql = WIQLQuery.getQuery(this.template, issueId);
    return this.witApi.queryByWiql({ query: wiql }, teamContext);
  }
}
