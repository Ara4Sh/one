define(function(require) {
  var Locale = require('utils/locale');
  var Buttons = require('./users-tab/buttons');
  var Actions = require('./users-tab/actions');
  var Table = require('./users-tab/datatable');

  var TAB_ID = require('./users-tab/tabId');
  var DATATABLE_ID = "dataTableUsers";

  var _dialogs = [
    require('./users-tab/dialogs/password'),
    require('./users-tab/dialogs/auth-driver'),
    require('./users-tab/dialogs/quotas')
  ];

  var _panels = [
    require('./users-tab/panels/info'),
    require('./users-tab/panels/quotas'),
    require('./users-tab/panels/accounting'),
    require('./users-tab/panels/showback')
  ];

  var _formPanels = [
    require('./users-tab/form-panels/create')
  ];

  var Tab = {
    tabId: TAB_ID,
    title: Locale.tr("Users"),
    tabClass: "subTab",
    parentTab: "system-tab",
    listHeader: '<i class="fa fa-fw fa-user"></i>&emsp;'+Locale.tr("Users"),
    infoHeader: '<i class="fa fa-fw fa-user"></i>&emsp;'+Locale.tr("User"),
    subheader: '<span>\
        <span class="total_users"/> <small>'+Locale.tr("TOTAL")+'</small>\
      </span>',
    resource: 'User',
    buttons: Buttons,
    actions: Actions,
    dataTable: new Table(DATATABLE_ID, {actions: true, info: true}),
    panels: _panels,
    formPanels: _formPanels,
    dialogs: _dialogs
  };

  return Tab;
});
