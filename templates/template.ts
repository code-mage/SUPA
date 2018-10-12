export interface Dictionary<T> {
    [Key: string]: T;
}

export interface ITemplate {
    orgUrl: string;
    PAT: string;
    WITTemplate: IWITTemplate;
    Tags: Dictionary<string[]>;
    ResolveTemplates: IResolveTemplate[];
}

export interface IResolveTemplate {
    key: string;
    text: string;
    Tags: Dictionary<string[]>;
}

export interface IWITTemplate {
    WorkItemType: string;
    ProjectName: string;
    ParentAreaPath: string;
    WorkItemIdentificationTag: string;
    WorkItemThreadIdField: string;
}
