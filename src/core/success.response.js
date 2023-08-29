"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const RessonStatusCode = {
  CREATED: "Created ",
  OK: "Success",
};
class SuccessRespone {
  constructor({
    message,
    statusCode = StatusCode.OK,
    resonStatusCode = RessonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? resonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessRespone {
  constructor({ metadata, message }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessRespone {
  constructor({
    metadata,
    message,
    statusCode = StatusCode.CREATED,
    resonStatusCode = RessonStatusCode.CREATED,
  }) {
    super({ message, metadata, statusCode, resonStatusCode });
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessRespone,
};
