import './WITBadge.css';

import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as React from 'react';
import { ResolveAction } from './ResolveAction';
// import { autobind } from 'office-ui-fabric-react/lib/Utilities';

export enum Action {
    Resolve
}

export interface ActionFunc {
    action: Action;
    callback: any;
    cancel: any;
}

export interface WITActionProps {
    workItems: WorkItem;
    action: ActionFunc;
}

export class WITAction extends React.Component<WITActionProps> {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let item: JSX.Element = null;
        switch (this.props.action.action) {
            case Action.Resolve:
                item = <ResolveAction workItems={this.props.workItems} callback={this.props.action.callback} cancel={this.props.action.cancel}></ResolveAction>;
        }
        return <div className="wit-action">{item}</div>;
    }
}
