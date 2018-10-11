import './WorkItemList.css';

import { Link } from 'office-ui-fabric-react/lib/Link';
import {
    CommandBar
} from 'office-ui-fabric-react/lib/CommandBar';
import {
    IContextualMenuItem
} from 'office-ui-fabric-react/lib/ContextualMenu';
import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import {
    DetailsList,
    DetailsListLayoutMode,
    DetailsRow,
    IColumn,
    IDetailsRowProps,
    SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';

import { DevopsConstants } from '../../../devops/devopsConstants';
import { WITBadge } from './WITBadge';
import {WITAction} from './WITAction';

export interface IListItems {
    title: string;
    witId: string;
    id: number;
    days: number;
}

export interface WorkItemListProps {
    workItems: WorkItem[];
}

export interface WorkItemListState {
    expandedWorkItem: number[];
    actionableItem: number;
}

export class WorkItemList extends React.Component<
    WorkItemListProps,
    WorkItemListState
> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            expandedWorkItem: [],
            actionableItem: -1
        };
    }

    render() {
        return <div>{this._renderWitList()}</div>;
    }

    private _renderWitList(): JSX.Element {
        return (
            <DetailsList
                className="wit-list"
                items={this._getItems()}
                compact={false}
                columns={this._getColumns()}
                selectionMode={SelectionMode.none}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                onRenderItemColumn={this._renderItemColumn}
                onRenderRow={this._onRenderRow}
            />
        );
    }

    private _getItems() {
        let items: IListItems[] = [];
        for (let i = 0; i < this.props.workItems.length; i++) {
            let item = this.props.workItems[i];

            let createdDate: Date = new Date(
                item.fields[DevopsConstants.CreatedDate]
            );
            let now: Date = new Date(Date.now());
            let activeDays = this._getDaysCount(createdDate, now);

            items.push({
                title: item.fields[DevopsConstants.Title],
                witId: item.id.toString(),
                id: i,
                days: activeDays
            });
        }
        return items;
    }

    private _getDaysCount(date1: Date, date2: Date): number {
        let timeDiff = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    private _getColumns(): IColumn[] {
        return [
            {
                key: 'witId',
                name: 'Id',
                fieldName: 'witId',
                minWidth: 50,
                maxWidth: 60,
                isResizable: true
            },
            {
                key: 'title',
                name: 'Title',
                fieldName: 'title',
                minWidth: 100,
                maxWidth: 250,
                isResizable: true
            },
            {
                key: 'days',
                name: 'Days',
                fieldName: 'days',
                minWidth: 35,
                maxWidth: 35,
                isResizable: false
            },
            {
                key: 'expand',
                name: '',
                fieldName: 'expand',
                minWidth: 25,
                maxWidth: 25,
                isResizable: false
            },
            {
                key: 'action',
                name: '',
                fieldName: 'action',
                minWidth: 25,
                maxWidth: 25,
                isResizable: true
            }
        ];
    }

    @autobind
    private _onRenderRow(props: IDetailsRowProps): JSX.Element {
        if (props.item.id === this.state.actionableItem) {
            return (
                <div>
                    <DetailsRow {...props} />
                    <WITAction workItems={this.props.workItems[props.item.id]} />
                </div>
            );
        }
        else if (this._isExpanded(props.item.id)) {
            return (
                <div>
                    <DetailsRow {...props} />
                    <WITBadge workItems={this.props.workItems[props.item.id]} />
                </div>
            );
        } else {
            return <DetailsRow {...props} />;
        }
    }

    @autobind
    private _renderItemColumn(
        item: IListItems,
        index: number,
        column: IColumn
    ) {
        const fieldContent = item[column.fieldName || index.toString()];

        switch (column.key) {
            case 'expand':
                if (this._isExpanded(item.id)) {
                    return (
                        <IconButton
                            disabled={false}
                            className={'witlist-button'}
                            iconProps={{ iconName: 'ChevronUp' }}
                            title="Retract"
                            ariaLabel="Retract"
                            onClick={() => {
                                this._expand(item.id);
                            }}
                        />
                    );
                } else {
                    return (
                        <IconButton
                            disabled={false}
                            className={'witlist-button'}
                            iconProps={{ iconName: 'ChevronDown' }}
                            title="Expand"
                            ariaLabel="Expand"
                            onClick={() => {
                                this._expand(item.id);
                            }}
                        />
                    );
                }
            case 'action':
                return this._commandMenu(item.id);
            case 'witId':
                //TODO: URL using provided project and org
                return (
                    <Link
                        target="_blank"
                        href={
                            'https://dev.azure.com/mseng/AzureDevOps/_workitems/edit/' +
                            item.witId
                        }
                    >
                        {item.witId}
                    </Link>
                );
            default:
                return <span>{fieldContent}</span>;
        }
    }

    private _commandMenu(id: number) {
        let items: IContextualMenuItem[] = [
            {
                name: 'Resolve',
                key: 'resolve',
                icon: 'CheckMark',
                className: 'title-bar-button resolve',
                onClick: () =>
                    this._resolveItem(id)
            }
        ];
        return <CommandBar className="command-bar" items={[]} overflowItems={items} />;
    }

    private _resolveItem(id: number) {
        this.setState({actionableItem: id});
    }

    private _isExpanded(id: number): boolean {
        const index: number = this.state.expandedWorkItem.indexOf(id);
        return index !== -1;
    }

    private _expand(id: number) {
        let expanded = JSON.parse(JSON.stringify(this.state.expandedWorkItem));
        const index: number = expanded.indexOf(id);
        if (index !== -1) {
            expanded.splice(index, 1);
        } else {
            expanded.push(id);
        }
        this.setState({
            expandedWorkItem: expanded
        });
    }
}
