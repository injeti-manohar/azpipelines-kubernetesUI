/*
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the MIT license.
*/

import { ActionsHubBase, Action } from "../FluxCommon/Actions";
import { V1DeploymentList, V1ReplicaSet, V1ReplicaSetList, V1DaemonSetList, V1StatefulSetList, V1PodList, V1Pod, V1DaemonSet, V1StatefulSet, V1PodTemplateSpec, V1ObjectMeta } from "@kubernetes/client-node";

export class WorkloadsActions extends ActionsHubBase {
    public static getKey(): string {
        return "workloads-actions";
    }

    public initialize(): void {
        this._deploymentsFetched = new Action<V1DeploymentList>();
        this._replicaSetsFetched = new Action<V1ReplicaSetList>();
        this._daemonSetsFetched = new Action<V1DaemonSetList>();
        this._statefulSetsFetched = new Action<V1StatefulSetList>();
        this._podsFetched = new Action<V1PodList>();
    }

    public get deploymentsFetched(): Action<V1DeploymentList> {
        return this._deploymentsFetched;
    }

    public get replicaSetsFetched(): Action<V1ReplicaSetList> {
        return this._replicaSetsFetched;
    }

    public get daemonSetsFetched(): Action<V1DaemonSetList> {
        return this._daemonSetsFetched;
    }

    public get statefulSetsFetched(): Action<V1StatefulSetList> {
        return this._statefulSetsFetched;
    }

    public get podsFetched(): Action<V1PodList> {
        return this._podsFetched;
    }

    private _deploymentsFetched: Action<V1DeploymentList>;
    private _replicaSetsFetched: Action<V1ReplicaSetList>;
    private _daemonSetsFetched: Action<V1DaemonSetList>;
    private _statefulSetsFetched: Action<V1StatefulSetList>;
    private _podsFetched: Action<V1PodList>;
}
