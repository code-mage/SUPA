import * as Reflux from 'reflux';
import { Actions } from '../Actions/WITActions';
import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';

export enum FetchState {
    Initial,
    Loaded,
    Loading,
    Error
}

export interface WITStoreState {
    workItems: WorkItem[];
    fetchState: FetchState;
}

export class WITStoreDefinition extends Reflux.Store {
    constructor() {
        super();
        this.state = {
            fetchState: FetchState.Initial
        } as WITStoreState;
        this.listenTo(Actions.fetchWIT, this.onFetchWIT);
        this.listenTo(Actions.setFetchState, this.onSetFetchState);
    }

    data() {
        return this.state;
    }

    onFetchWIT(questionsResult: WorkItem[]) {
        this.setState({
            workItems: questionsResult,
            fetchState: FetchState.Loaded
        } as WITStoreState);
    }

    onSetFetchState(state: FetchState) {
        this.setState({
            fetchState: state
        } as WITStoreState);
    }
}

export let WITStore = new WITStoreDefinition();
