export class DevopsConstants {
    public static Priority = 'Microsoft.VSTS.Common.Priority';
    public static Title = 'System.Title';
    public static State = 'System.State';
    public static Tags = 'System.Tags';
    public static AssignedTo = 'System.AssignedTo';
    public static CreatedDate = 'System.CreatedDate';
    public static ChangedDate = 'System.ChangedDate';

    public static fields: string[] = [
        DevopsConstants.Title,
        DevopsConstants.State,
        DevopsConstants.Tags,
        DevopsConstants.AssignedTo,
        DevopsConstants.CreatedDate,
        DevopsConstants.ChangedDate,
        DevopsConstants.Priority
    ];
}

export class DevopsQueries {
    public static getAllActiveWiql: string =
        'SELECT [System.Id], [System.WorkItemType], [System.Title], [System.State], [System.AreaPath], [System.IterationPath], [##WorkItemThreadIdField##] FROM workitems WHERE [System.WorkItemType]="##WorkItemType##" AND [System.TeamProject] = "##ProjectName##" AND [System.AreaPath] UNDER "##ParentAreaPath##" AND [System.State] = "Active" AND [System.Tags] CONTAINS "##WorkItemIdentificationTag##"';
}
