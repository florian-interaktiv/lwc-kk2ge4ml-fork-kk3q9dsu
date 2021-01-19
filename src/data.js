export const data = {
    Id: 'Tree-1',
    Name: 'Tree 1',
    children: [
      {
        Id: 'Tree-1 2',
        Name: 'Tree 1 2',
        Parent__c: 'Tree-1',
        children: [
          {
            Id: 'Tree-2 1',
            Name: 'Tree 2 1',
            Parent__c: 'Tree-1 2',
            children: [
              
            ]
          },
          {
            Id: 'Tree-2 2',
            Name: 'Tree 2 2',
            Parent__c: 'Tree-1 2',
            children: [
              
            ]
          }
        ]
      },
      {
        Id: 'Tree-1 3',
        Name: 'Tree 1 3',
        Parent__c: 'Tree-1',
        children: [
          {
            Id: 'Tree-3 1',
            Name: 'Tree 3 1',
            Parent__c: 'Tree-1 3',
            children: [
              
            ]
          },
          {
            Id: 'Tree-4 2',
            Name: 'Tree 4 2',
            Parent__c: 'Tree-1 3',
            children: [
              
            ]
          }
        ]
      },
      {
        Id: 'Tree-1 4',
        Name: 'Tree 1 4',
        Parent__c: 'Tree-1',
        children: [
          
        ]
      }
    ]
  }