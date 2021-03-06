define(function(require) {
  /*
    DEPENDENCIES
   */

  var Locale = require('utils/locale');
  var Config = require('sunstone-config');
  var Sunstone = require('sunstone');
  var Humanize = require('utils/humanize');
  var Notifier = require('utils/notifier');
  var OpenNebulaVM = require('opennebula/vm');

  /*
    CONSTANTS
   */

  var TAB_ID = require('../tabId');
  var PANEL_ID = require('./snapshots/panelId');
  var SNAPSHOT_DIALOG_ID = require('../dialogs/snapshot/dialogId');
  var RESOURCE = "VM"
  var XML_ROOT = "VM"

  /*
    CONSTRUCTOR
   */

  function Panel(info) {
    this.panelId = PANEL_ID;
    this.title = Locale.tr("Snapshots");
    this.icon = "fa-laptop";

    this.element = info[XML_ROOT];

    return this;
  };

  Panel.PANEL_ID = PANEL_ID;
  Panel.prototype.html = _html;
  Panel.prototype.setup = _setup;

  return Panel;

  /*
    FUNCTION DEFINITIONS
   */

  function _html() {
    var that = this;
    var html = '<form id="snapshot_form" vmid="' + that.element.ID + '" >\
      <div class="row">\
      <div class="large-12 columns">\
         <table class="info_table dataTable extended_table">\
           <thead>\
             <tr>\
                <th>' + Locale.tr("ID") + '</th>\
                <th>' + Locale.tr("Name") + '</th>\
                <th>' + Locale.tr("Timestamp") + '</th>\
                <th>' + Locale.tr("Actions") + '</th>\
                <th>'

    if (Config.isTabActionEnabled("vms-tab", "VM.snapshot_create")) {
      // If VM is not RUNNING, then we forget about the attach disk form.
      if (that.element.STATE == OpenNebulaVM.STATES.ACTIVE && that.element.LCM_STATE == OpenNebulaVM.LCM_STATES.RUNNING) {
        html += '\
           <button id="take_snapshot" class="button tiny success right radius" >' + Locale.tr("Take snapshot") + '</button>'
      } else {
        html += '\
           <button id="take_snapshot" class="button tiny success right radius" disabled="disabled">' + Locale.tr("Take snapshot") + '</button>'
      }
    }

    html +=  '</th>\
              </tr>\
           </thead>\
           <tbody>';

    var snapshots = []
    if ($.isArray(that.element.TEMPLATE.SNAPSHOT))
        snapshots = that.element.TEMPLATE.SNAPSHOT
    else if (!$.isEmptyObject(that.element.TEMPLATE.SNAPSHOT))
        snapshots = [that.element.TEMPLATE.SNAPSHOT]

    if (!snapshots.length) {
      html += '\
          <tr id="no_snapshots_tr">\
            <td colspan="6">'          + Locale.tr("No snapshots to show") + '</td>\
          </tr>'        ;
    } else {

      for (var i = 0; i < snapshots.length; i++) {
        var snapshot = snapshots[i];

        if (
           (
            that.element.STATE == OpenNebulaVM.STATES.ACTIVE) &&
           (
            that.element.LCM_STATE == OpenNebulaVM.LCM_STATES.HOTPLUG_SNAPSHOT)) {
          actions = Locale.tr("snapshot in progress");
        } else {
          actions = '';

          if ((that.element.STATE == OpenNebulaVM.STATES.ACTIVE &&
               that.element.LCM_STATE == OpenNebulaVM.LCM_STATES.RUNNING)) {

            if (Config.isTabActionEnabled("vms-tab", "VM.snapshot_revert")) {
              actions += '<a href="VM.snapshot_revert" class="snapshot_revert" ><i class="fa fa-reply"/>' + Locale.tr("Revert") + '</a> &emsp;'
            }

            if (Config.isTabActionEnabled("vms-tab", "VM.snapshot_delete")) {
              actions += '<a href="VM.snapshot_delete" class="snapshot_delete" ><i class="fa fa-times"/>' + Locale.tr("Delete") + '</a>'
            }
          }
        }

        html += '\
              <tr snapshot_id="' + (snapshot.SNAPSHOT_ID) + '">\
                <td>'            + snapshot.SNAPSHOT_ID + '</td>\
                <td>'            + snapshot.NAME + '</td>\
                <td>'            + Humanize.prettyTime(snapshot.TIME) + '</td>\
                <td>'            + actions + '</td>\
            </tr>'        ;
      }
    }

    html += '\
            </tbody>\
          </table>\
        </div>\
        </div>\
      </form>';

    return html;
  }

  function _setup(context) {
    var that = this;

    if (Config.isTabActionEnabled("vms-tab", "VM.snapshot_create")) {
      context.off('click', '#take_snapshot');
      context.on('click', '#take_snapshot', function() {
        var dialog = Sunstone.getDialog(SNAPSHOT_DIALOG_ID);
        dialog.setElement(that.element);
        dialog.show();
        return false;
      });
    }

    if (Config.isTabActionEnabled("vms-tab", "VM.snapshot_revert")) {
      context.off('click', '.snapshot_revert');
      context.on('click', '.snapshot_revert', function() {
        var snapshot_id = $(this).parents('tr').attr('snapshot_id');
        Sunstone.runAction('VM.snapshot_revert', that.element.ID,  {"snapshot_id": snapshot_id});
        return false;
      });
    }

    if (Config.isTabActionEnabled("vms-tab", "VM.snapshot_delete")) {
      context.off('click', '.snapshot_delete');
      context.on('click', '.snapshot_delete', function() {
        var snapshot_id = $(this).parents('tr').attr('snapshot_id');
        Sunstone.runAction('VM.snapshot_delete', that.element.ID,  {"snapshot_id": snapshot_id});
        return false;
      });
    }
  }
});
