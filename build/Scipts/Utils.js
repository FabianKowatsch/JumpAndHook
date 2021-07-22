"use strict";
var JumpandHook;
(function (JumpandHook) {
    class Utils {
        static path() {
            if (location.protocol == "http:")
                return "";
            else
                return "JumpAndHook/";
        }
    }
    JumpandHook.Utils = Utils;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=Utils.js.map