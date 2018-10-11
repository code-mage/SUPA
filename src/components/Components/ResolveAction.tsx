import './WITBadge.css';

import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as React from 'react';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
// import { autobind } from 'office-ui-fabric-react/lib/Utilities';

export interface ResolveActionProps {
    workItems: WorkItem;
    callback: () => {};
}

export interface ResolveActionState{
    resolutionKey: number;
    actionTag: number;
    rcaTag: number;
    areaTag: number;
}

export class ResolveAction extends React.Component<ResolveActionProps> {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <div>{this._getDropdown()}</div>;
    }

    private _getDropdown() {
        return (
            <Dropdown
                label="Controlled example:"
                selectedKey={selectedItem ? selectedItem.key : undefined}
                onChanged={this.changeState}
                onFocus={this._log('onFocus called')}
                onBlur={this._log('onBlur called')}
                placeHolder="Select an Option"
                options={[
                    { key: 'A', text: 'Option a' },
                    { key: 'B', text: 'Option b' },
                    { key: 'C', text: 'Option c' },
                    { key: 'D', text: 'Option d' },
                    {
                        key: 'divider_1',
                        text: '-',
                        itemType: DropdownMenuItemType.Divider
                    },
                    { key: 'E', text: 'Option e' },
                    { key: 'F', text: 'Option f' },
                    { key: 'G', text: 'Option g' }
                ]}
            />
        );
    }
}
