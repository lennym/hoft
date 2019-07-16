class ValidationError extends Error {

  constructor(msg, field, type) {
    super(msg);
    this.field = field;
    this.type = type;
  }

}

module.exports = ValidationError;
