import resources from "./resources";
const accountList = [
    {
      title: resources.vi.accountList.data.accountNumber,
      dataField: 'accountnumber',
      dataType: 'text',
      colWidth: '200',
    },
    {
      title: resources.vi.accountList.data.accountName,
      dataField: 'accountname',
      dataType: 'text',
      colWidth: '250',
    },
    {
      title: resources.vi.accountList.data.property,
      dataField: 'propertyname',
      dataType: 'text',
      colWidth: '100',
    },
    {
      title: resources.vi.accountList.data.englishName,
      dataField: 'englishname',
      dataType: 'text',
      colWidth: '250',
    },
    {
      title: resources.vi.accountList.data.description,
      dataField: 'description',
      dataType: 'text',
      colWidth: '250',
    },
    {
      title: resources.vi.accountList.data.status,
      dataField: 'statusname',
      dataType: 'text',
      colWidth: '200',
    },
  ];

const accountListFull = [
  {
    title: resources.vi.accountList.data.accountNumber,
    dataField: 'accountnumber',
    dataType: 'text',
    display: true,
    colWidth: '175',
  },
  {
    title: resources.vi.accountList.data.accountName,
    dataField: 'accountname',
    dataType: 'text',
    display: true,
    colWidth: '250',
  },
  {
    title: resources.vi.accountList.data.dataLevel,
    dataField: 'datalevel',
    dataType: 'text',
    display: false,
    colWidth: '150',
  },
  {
    title: resources.vi.accountList.data.property,
    dataField: 'propertyname',
    dataType: 'text',
    display: true,
    colWidth: '100',
  },
  {
    title: resources.vi.accountList.data.englishName,
    dataField: 'englishname',
    dataType: 'text',
    display: true,
    colWidth: '250',
  },
  {
    title: resources.vi.accountList.data.description,
    dataField: 'description',
    dataType: 'text',
    display: true,
    colWidth: '300',
  },
  {
    title: resources.vi.accountList.data.status,
    dataField: 'statusname',
    dataType: 'text',
    display: true,
    colWidth: '200',
  },
  {
    title: resources.vi.accountList.data.createdDate,
    dataField: 'created_date_display',
    dataType: 'm-date',
    display: false,
    colWidth: '100',
  },
  {
    title: resources.vi.accountList.data.createdBy,
    dataField: 'createdby',
    dataType: 'text',
    display: false,
    colWidth: '200',
  },
  {
    title: resources.vi.accountList.data.modifiedDate,
    dataField: 'modifieddate_display',
    dataType: 'm-date',
    display: false,
    colWidth: '100',
  },
  {
    title: resources.vi.accountList.data.modifiedBy,
    dataField: 'modifiedby',
    dataType: 'text',
    display: false,
    colWidth: '200',
  },
]

export {accountList, accountListFull};