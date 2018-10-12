import './ResolveAction.css';

import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import {
    // IconButton,
    // CommandBarButton,
    DefaultButton
} from 'office-ui-fabric-react/lib/Button';
import { Template } from '../../../devops/devops';
import { IResolveTemplate, Dictionary } from '../../../templates/template';
import { autobind } from '@uifabric/utilities';
// import { autobind } from 'office-ui-fabric-react/lib/Utilities';

export interface ResolveActionProps {
    workItems: WorkItem;
    callback: any;
    cancel: any;
}

export interface ResolveActionState {
    resolveTemplateKey: string;
    tags: Dictionary<string[]>;
}

export class ResolveAction extends React.Component<
    ResolveActionProps,
    ResolveActionState
> {
    private resolveOptions: IResolveTemplate[];
    private tags: Dictionary<string[]>;

    constructor(props, context) {
        super(props, context);
        this.resolveOptions = Template.getResolveTempaltes();
        this.resolveOptions.push({
            key: 'other',
            text: 'Custom',
            Tags: {}
        } as IResolveTemplate);

        this.tags = Template.getTags();

        this.state = {
            resolveTemplateKey: undefined,
            tags: {}
        };
    }

    render() {
        return (
            <div>
                {this._getResolveTypeDropdown()}
                {this._getTagsDropdown()}
                {this._actionButton()}
            </div>
        );
    }

    private _getResolveTypeDropdown() {
        let options = [];

        for (let i = 0; i < this.resolveOptions.length; i++) {
            options.push(this.resolveOptions[i]);
        }

        return (
            <Dropdown
                label="Resolve as:"
                selectedKey={this.state.resolveTemplateKey}
                onChanged={this.changeState}
                placeHolder="Select a resolution template"
                defaultSelectedKeys={['other']}
                options={options}
            />
        );
    }

    private _getTagsDropdown() {
        let items: JSX.Element[] = [];

        Object.keys(this.tags).forEach(key => {
            let tagArray: string[] = this.tags[key];

            let options = [];
            for (let i = 0; i < tagArray.length; i++) {
                options.push({
                    key: tagArray[i],
                    text: tagArray[i]
                });
            }

            items.push(
                <Dropdown
                    multiSelect
                    label={key}
                    selectedKey={this.state.tags[key]}
                    onChanged={ (item: IDropdownOption) => {return this.changeState2(item, key);}}
                    placeHolder="Select a resolution template"
                    defaultSelectedKeys={['other']}
                    options={options}
                />
            );
        });

        return (
            <div>
                <Label>{'Tags:'}</Label>
                <div className="tag-dropdowns">{items}</div>
            </div>
        );
    }

    private _actionButton() {
        return (
            <div className="buttons">
                <DefaultButton
                    primary
                    className="action-button"
                    disabled={false}
                    // iconProps={{ iconName: 'PageRight' }}
                    text="Resolve"
                    ariaLabel="Resolve"
                    onClick={this._resolveItem}
                />
                <DefaultButton
                    disabled={false}
                    className="action-button"
                    // iconProps={{ iconName: 'Cancel' }}
                    text="Cancel"
                    ariaLabel="Cancel"
                    onClick={this.props.cancel}
                />
            </div>
        );
    }

    @autobind
    public changeState(item: IDropdownOption) {
        let tags: Dictionary<string[]> = {};
        for (let option of this.resolveOptions){
            if (option.key === item.key as string){
                tags = option.Tags;
            }
        }
        this.setState({ resolveTemplateKey: item.key as string, tags: tags });
    }

    @autobind
    public changeState2(item: IDropdownOption, key: string) {
        let tags = this.state.tags;

        const index: number = tags[key].indexOf(item.key as string);
        if (index !== -1) {
            tags[key].splice(index, 1);
        } else {
            tags[key].push(item.key as string);
        }

        this.setState({ tags: tags });
    }

    @autobind
    private _resolveItem() {
        let tags = '';
        Object.keys(this.state.tags).forEach(key => {
            for (let tag of this.state.tags[key]) {
                tags = tags.concat(key + ':' + tag);
            }
        });
        this.props.callback(Number(this.props.workItems.id), tags);
    }
}
