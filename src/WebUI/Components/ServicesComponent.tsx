/*
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the MIT license.
*/

import { V1Service, V1ServiceList, V1ServicePort } from "@kubernetes/client-node";
import { BaseComponent, css, format } from "@uifabric/utilities";
import { IColumn } from "azure-devops-ui/Components/VssDetailsList/VssDetailsList.Props";
import { Duration } from "azure-devops-ui/Duration";
import { ColumnActionsMode } from "office-ui-fabric-react/lib/DetailsList";
import * as React from "react";
import * as Resources from "../Resources";
import { IServiceItem, IVssComponentProperties } from "../Types";
import { ListComponent } from "./ListComponent";

const packageKey: string = "package-col";
const typeKey: string = "type-col";
const clusterIPKey: string = "cluster-ip-col";
const externalIPKey: string = "external-ip-col";
const portKey: string = "port-col";
const ageKey: string = "age-col";

export interface IServicesComponentProperties extends IVssComponentProperties {
    servicesList: V1ServiceList;
    onItemInvoked?: (item?: any, index?: number, ev?: Event) => void;
}

export class ServicesComponent extends BaseComponent<IServicesComponentProperties, {}> {
    public render(): React.ReactNode {

        return (
            <ListComponent
                className={css("sc-list-content", "depth-16")}
                headingText={Resources.ServicesDetailsText}
                items={ServicesComponent._getServiceItems(this.props.servicesList)}
                columns={ServicesComponent._getColumns()}
                onRenderItemColumn={ServicesComponent._onRenderItemColumn}
                onItemInvoked={this._openServiceItem}
            />
        );
    }

    private _openServiceItem = (item?: any, index?: number, ev?: Event) => {
        if (this.props.onItemInvoked) {
            this.props.onItemInvoked(item, index, ev);
        }
    }

    private static _getServiceItems(servicesList: V1ServiceList): IServiceItem[] {
        let items: IServiceItem[] = [];

        (servicesList && servicesList.items || []).forEach(service => {
            items.push({
                package: service.metadata.name,
                type: service.spec.type,
                clusterIP: service.spec.clusterIP,
                externalIP: ServicesComponent.getExternalIP(service),
                port: ServicesComponent.getPort(service),
                creationTimestamp: service.metadata.creationTimestamp,
                uid: service.metadata.uid.toLowerCase(),
                service: service
            });
        });

        return items;
    }

    private static getExternalIP(service: V1Service): string {
        return service.status
            && service.status.loadBalancer
            && service.status.loadBalancer.ingress
            && service.status.loadBalancer.ingress.length > 0
            && service.status.loadBalancer.ingress[0].ip
            || "";
    }

    private static getPort(service: V1Service): string {
        return service.spec
            && service.spec.ports
            && service.spec.ports.length > 0
            && ServicesComponent.formatPortString(service.spec.ports[0])
            || "";
    }

    private static formatPortString(servicePort: V1ServicePort): string {
        return format("{0}:{1}:{2}/{3}", servicePort.port, servicePort.targetPort, servicePort.nodePort, servicePort.protocol);
    }

    private static _getColumns(): IColumn[] {
        let columns: IColumn[] = [];
        const headerColumnClassName: string = "sc-col-header";

        columns.push({
            key: packageKey,
            name: Resources.PackageText,
            fieldName: packageKey,
            minWidth: 140,
            maxWidth: 140,
            headerClassName: css(headerColumnClassName, "first-col-header"),
            columnActionsMode: ColumnActionsMode.disabled
        });

        columns.push({
            key: typeKey,
            name: Resources.TypeText,
            fieldName: typeKey,
            minWidth: 110,
            maxWidth: 110,
            headerClassName: headerColumnClassName,
            columnActionsMode: ColumnActionsMode.disabled
        });

        columns.push({
            key: clusterIPKey,
            name: Resources.ClusterIPText,
            fieldName: clusterIPKey,
            minWidth: 110,
            maxWidth: 110,
            headerClassName: headerColumnClassName,
            columnActionsMode: ColumnActionsMode.disabled
        });

        columns.push({
            key: externalIPKey,
            name: Resources.ExternalIPText,
            fieldName: externalIPKey,
            minWidth: 110,
            maxWidth: 110,
            headerClassName: headerColumnClassName,
            columnActionsMode: ColumnActionsMode.disabled
        });

        columns.push({
            key: portKey,
            name: Resources.PortText,
            fieldName: portKey,
            minWidth: 110,
            maxWidth: 110,
            headerClassName: headerColumnClassName,
            columnActionsMode: ColumnActionsMode.disabled
        });

        columns.push({
            key: ageKey,
            name: Resources.AgeText,
            fieldName: ageKey,
            minWidth: 80,
            maxWidth: 80,
            headerClassName: headerColumnClassName,
            columnActionsMode: ColumnActionsMode.disabled
        });

        return columns;
    }

    private static _onRenderItemColumn(service?: IServiceItem, index?: number, column?: IColumn): React.ReactNode {
        if (!service || !column) {
            return null;
        }

        const colDataClassName: string = "sc-col-data";
        let textToRender: string = "";
        switch (column.key) {
            case packageKey:
                textToRender = service.package;
                break;

            case typeKey:
                textToRender = service.type;
                break;

            case clusterIPKey:
                textToRender = service.clusterIP;
                break;

            case externalIPKey:
                textToRender = service.externalIP;
                break;

            case portKey:
                textToRender = service.port;
                break;

            case ageKey:
                return (
                    // <Ago date={service.creationTimestamp} format={AgoFormat.Compact} />
                    <Duration startDate={new Date(service.creationTimestamp)} endDate={new Date()} />
                );
        }

        return ListComponent.renderColumn(textToRender || "", ListComponent.defaultColumnRenderer, colDataClassName);
    }
}