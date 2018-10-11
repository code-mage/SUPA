import * as azdev from 'azure-devops-node-api';
import { TeamContext } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import {
    WorkItem,
    WorkItemQueryResult
} from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi';
import * as Q from 'q';

import { ITemplate, Templates } from '../templates/template';
import { IWITTemplate } from './../templates/template';
import { DevopsConstants, DevopsQueries } from './devopsConstants';

class WIQLQuery {
    private static getQuery(query: string, template: IWITTemplate): string {
        for (let key in template) {
            if (template.hasOwnProperty(key)) {
                let keyValue = '##' + key + '##';
                let regex = new RegExp(keyValue, 'g');
                query = query.replace(regex, template[key]);
            }
        }
        return query;
    }

    public static getAllActiveQuery(template: IWITTemplate): string {
        let wiqlQuery: string = JSON.parse(
            JSON.stringify(DevopsQueries.getAllActiveWiql)
        );
        return this.getQuery(wiqlQuery, template);
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

    protected getWitApi(): Q.Promise<IWorkItemTrackingApi> {
        let deferred = Q.defer<IWorkItemTrackingApi>();
        if (!this.witApi) {
            this.connection.getWorkItemTrackingApi().then(
                (api: IWorkItemTrackingApi) => {
                    this.witApi = api;
                    deferred.resolve(api);
                },
                (error: any) => {
                    deferred.reject(error);
                }
            );
        } else {
            deferred.resolve(this.witApi);
        }
        return deferred.promise;
    }
}

export class Read extends Devops {
    public getAllActiveWorkItems(): Q.Promise<WorkItem[]> {
        let apiPromise = this.getWitApi();
        let deferred = Q.defer<WorkItem[]>();

        apiPromise.then(
            (api: IWorkItemTrackingApi) => {
                this.queryAllActiveWorkItems(api).then(
                    (result: WorkItemQueryResult) => {
                        let workItemIds: number[] = [];
                        for (let workItem of result.workItems) {
                            workItemIds.push(workItem.id);
                        }
                        this.getWorkItemDetails(api, workItemIds).then(
                            (results: WorkItem[]) => {
                                deferred.resolve(results);
                            },
                            (error: any) => {
                                deferred.reject(error);
                            }
                        );
                    },
                    (error: any) => {
                        deferred.reject(error);
                    }
                );
            },
            (error: any) => {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    }

    private getWorkItemDetails(
        api: IWorkItemTrackingApi,
        workItemIds: number[]
    ): Promise<WorkItem[]> {
        return api.getWorkItems(workItemIds, DevopsConstants.fields);
    }

    private queryAllActiveWorkItems(
        api: IWorkItemTrackingApi
    ): Promise<WorkItemQueryResult> {
        const teamContext: TeamContext = {
            projectId: undefined,
            project: this.template.WITTemplate.ProjectName,
            teamId: undefined,
            team: undefined
        };
        let wiql = WIQLQuery.getAllActiveQuery(this.template.WITTemplate);
        return api.queryByWiql({ query: wiql }, teamContext);
    }
}
