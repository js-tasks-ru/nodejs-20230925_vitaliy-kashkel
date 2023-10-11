/* eslint-disable max-len */
function validateEnterRules(rules) {
  if (!rules || typeof rules !== 'object' || Object.values(rules).length === 0) {
    throw new Error('Set validation rules.');
  }

  Object.values(rules).forEach((rule) => {
    const ruleKeys = Object.keys(rule);
    if (!ruleKeys.includes('type')) {
      throw Error('The "type" field in the validation rule is required.');
    }

    if (!['string', 'number'].includes(rule.type)) {
      throw Error(`The value of the "type" field must be "string" or "number" and not "${rule.type}".`);
    }

    if (!ruleKeys.includes('min')) {
      throw Error('The "min" field in the validation rule is required.');
    }

    if (typeof rule.min !== 'number') {
      throw Error(`The value type of the "min" field must be "number" and not "${typeof rule.min}".`);
    }

    if (!ruleKeys.includes('max')) {
      throw Error('The "max" field in the validation rule is required.');
    }

    if (typeof rule.max !== 'number') {
      throw Error(`The value type of the "max" field must be "number" and not "${typeof rule.max}".`);
    }
  });
}


module.exports = class Validator {
  constructor(rules) {
    validateEnterRules(rules);
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
