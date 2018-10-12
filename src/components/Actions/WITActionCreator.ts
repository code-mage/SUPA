import { Actions } from './WITActions';
import { WITSource } from '../Sources/WITSource';
import { FetchState } from '../Stores/WITStore';
import * as Q from 'q';

export class WITActionCreator {
    constructor(private _WITSource?: WITSource) {}

    public fetchWITData(): Q.Promise<any> {
        let defer = Q.defer<any>();

        Actions.setFetchState(FetchState.Loading);
        this.WITSource.fetchWIT().then(
            value => {
                Actions.fetchWIT(value);
                defer.resolve(null);
            },
            (error: any) => {
                Actions.setError(error);
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    public resolveWIT(id: number, tags: string): Q.Promise<any> {
        let defer = Q.defer<any>();

        this.WITSource.resolveWIT(id, tags).then(
            value => {
                this.fetchWITData();
                defer.resolve(value);
            },
            (error: any) => {
                Actions.setError(error);
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    private get WITSource(): WITSource {
        if (!this._WITSource) {
            this._WITSource = new WITSource();
        }

        return this._WITSource;
    }
}
