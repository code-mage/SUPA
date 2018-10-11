import './WIT.css';

import * as React from 'react';
import * as Reflux from 'reflux';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { WITActionCreator } from '../Actions/WITActionCreator';
import {
    FetchState,
    WITStoreDefinition,
    WITStoreState
} from '../Stores/WITStore';
import { WorkItemList } from './WorkItemList';

export interface ListWitProps {
    title: string;
    logo: string;
    WITActionCreator: WITActionCreator;
}

export class WIT extends Reflux.Component<
    typeof WITStoreDefinition,
    ListWitProps,
    WITStoreState
> {
    constructor(props: ListWitProps) {
        super(props);
        this.state = {
            workItems: [],
            fetchState: FetchState.Initial
        }; // our store will add its own state to the component's
        this.store = WITStoreDefinition; // <- just assign the store class itself
        this.props.WITActionCreator.fetchWITData();
    }

    render() {
        if (this.state.workItems && this.state.workItems.length > 0) {
            return (
                <div className="container-wit">
                    <section className="welcome-header">
                        <h1 className="header">{'WorkItems'}</h1>
                    </section>
                    <WorkItemList workItems={this.state.workItems} />
                </div>
            );
        } else {
            return (
                <div className="container-wit">
                    <Spinner
                    className="spinner"
                        size={SpinnerSize.large}
                        label="Fetching workitems"
                        ariaLive="assertive"
                    />
                </div>
            );
        }
    }
}
