import { WITActionCreator } from './Actions/WITActionCreator';
import * as React from 'react';
// import { Button, ButtonType } from 'office-ui-fabric-react';
import Progress from './Progress';
import { WIT } from './Components/WIT';

export interface AppProps {
    title: string;
    isOfficeInitialized: boolean;
}


export default class App extends React.Component<AppProps> {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {
            title,
            isOfficeInitialized,
        } = this.props;

        // TODO: edit it to not isOfficeInitialized.
        if (isOfficeInitialized) {
            return (
                <Progress
                    title={title}
                    logo='assets/logo-filled.png'
                    message='Please sideload your addin to see app body.'
                />
            );
        }

        return (
            <div className='ms-welcome'>
                <WIT logo='assets/logo-filled.png' title={this.props.title} WITActionCreator={new WITActionCreator()} />
            </div>
        );
    }
}
