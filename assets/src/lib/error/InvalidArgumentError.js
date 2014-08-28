function InvalidArgumentError(message) {
    "use strict";

    this.name = "InvalidArgumentError";
    this.message = (message || "Invalid number arguments given.");
}

InvalidArgumentError.prototype = new Error();