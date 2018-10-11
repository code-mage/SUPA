import './WITBadge.css';

import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as React from 'react';import {
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList';
// import { autobind } from 'office-ui-fabric-react/lib/Utilities';

export interface WITBadgeProps {
    workItems: WorkItem;
}

export interface IListItems {
    key: string;
    value: string;
}

export class WITBadge extends React.Component<WITBadgeProps> {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="wit-badge">
                {this._getCard()}
            </div>
        );
    }

    private _getCard(): JSX.Element {
        return <DetailsList
                items={this._getItems()}
                compact={true}
                isHeaderVisible={false}
                columns={this._getColumns()}
                selectionMode={SelectionMode.none}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
            />;
    }

    private _getItems() {
        let items: IListItems[] = [];
        Object.keys(this.props.workItems.fields).forEach(key => {
            let value = this.props.workItems.fields[key];
            items.push({
                key: key,
                value: value
            });
          });
        return items;
    }

    private _getColumns(): IColumn[] {
        return [
            {
                key: 'key',
                name: '',
                fieldName: 'key',
                minWidth: 100,
                maxWidth: 200,
                isResizable: true
            },
            {
                key: 'value',
                name: '',
                fieldName: 'value',
                minWidth: 100,
                maxWidth: 300,
                isResizable: true
            }
        ];
    }
}
