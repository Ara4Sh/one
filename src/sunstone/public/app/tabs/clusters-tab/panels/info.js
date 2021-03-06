define(function(require) {
  /*
    DEPENDENCIES
   */

  var TemplateHTML = require('hbs!./info/html');
  var Locale = require('utils/locale');
  var RenameTr = require('utils/panel/rename-tr');
  var TemplateTable = require('utils/panel/template-table');

  /*
    CONSTANTS
   */

  var TAB_ID = require('../tabId');
  var PANEL_ID = require('./info/panelId');
  var RESOURCE = "Cluster";
  var XML_ROOT = "CLUSTER";

  /*
    CONSTRUCTOR
   */

  function Panel(info) {
    this.title = Locale.tr("Info");
    this.icon = "fa-info-circle";

    this.element = info[XML_ROOT];

    return this;
  }

  Panel.PANEL_ID = PANEL_ID;
  Panel.prototype.html = _html;
  Panel.prototype.setup = _setup;

  return Panel;

  /*
    FUNCTION DEFINITIONS
   */

  function _html() {
    var renameTrHTML = RenameTr.html(RESOURCE, this.element.NAME);
    var templateTableHTML = TemplateTable.html(this.element.TEMPLATE, RESOURCE,
                                              Locale.tr("Attributes"));

    return TemplateHTML({
      'element': this.element,
      'renameTrHTML': renameTrHTML,
      'templateTableHTML': templateTableHTML
    });
  }

  function _setup(context) {
    $('.resource-info-header', '#' + TAB_ID).text(this.element.NAME);
    RenameTr.setup(RESOURCE, this.element.ID, context);

    TemplateTable.setup(this.element.TEMPLATE, RESOURCE, this.element.ID, context);
  }
});
