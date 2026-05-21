import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import { Overview } from "resource:///org/gnome/shell/ui/overview.js";

export default class SuperIntoAppsExtension extends Extension {
    private originalToggle = null;

    enable(): void {
        this.originalToggle = Overview.prototype.toggle;
        Overview.prototype.toggle = function () {
            if (this.isDummy) {
                return;
            }
            if (this._visible) {
                this.hide();
            } else {
                this.showApps();
            }
        };
    }

    disable(): void {
        Overview.prototype.toggle = this.originalToggle;
    }
}
