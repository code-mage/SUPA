import {  Read } from '../../../devops/devops';
import * as Q from 'q';
import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';

export class WITSource {
    protected _readAPI: Read;

    constructor() {
        this._readAPI = new Read();
    }

    public fetchWIT(): Q.Promise<WorkItem[]> {
        return this._readAPI.getAllActiveWorkItems();
    }

    public resolveWIT(id: number, tags: string): Q.Promise<WorkItem> {
        return this._readAPI.ResolveWorkItems(id, tags);
    }
}
