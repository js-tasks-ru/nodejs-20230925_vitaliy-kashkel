/* eslint-disable max-len */
const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('невозможно создание валидатора если не задать правила валидации', () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const validator = new Validator();
      } catch (e) {
        expect(e.message).to.be.equal('Set validation rules.');
      }
    });

    it('невозможно создание валидатора если в правиле валидации отсутствует поле "type"', () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const validator = new Validator({
          name: {
            min: 5,
            max: 20,
          },
        });
      } catch (e) {
        expect(e.message).to.be.equal('The "type" field in the validation rule is required.');
      }
    });

    it('невозможно создание валидатора если в правиле валидации значение поля "type" не "string" или "number" (например "array")', () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const validator = new Validator({
          name: {
            type: 'array',
            min: 5,
            max: 20,
          },
        });
      } catch (e) {
        expect(e.message).to.be.equal('The value of the "type" field must be "string" or "number" and not "array".');
      }
    });

    it('невозможно создание валидатора если в правиле валидации отсутствует поле "min"', () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const validator = new Validator({
          name: {
            type: 'string',
            max: 20,
          },
        });
      } catch (e) {
        expect(e.message).to.be.equal('The "min" field in the validation rule is required.');
      }
    });

    it('невозможно создание валидатора если в правиле валидации тип значения поля "min" не "number" (например "string")', () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const validator = new Validator({
          name: {
            type: 'string',
            min: '5',
            max: 20,
          },
        });
      } catch (e) {
        expect(e.message).to.be.equal('The value type of the "min" field must be "number" and not "string".');
      }
    });

    it('невозможно создание валидатора если в правиле валидации отсутствует поле "max"', () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const validator = new Validator({
          name: {
            type: 'string',
            min: 5,
          },
        });
      } catch (e) {
        expect(e.message).to.be.equal('The "max" field in the validation rule is required.');
      }
    });

    it('невозможно создание валидатора если в правиле валидации тип значения поля "max" не "number" (например "boolean")', () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const validator = new Validator({
          name: {
            type: 'string',
            min: 5,
            max: true,
          },
        });
      } catch (e) {
        expect(e.message).to.be.equal('The value type of the "max" field must be "number" and not "boolean".');
      }
    });

    it('валидатор проверяет что длина значения поля строкового типа не меньше значения поля "min"', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'La'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 2');
    });

    it('валидатор проверяет что длина значения поля строкового типа не больше значения поля "max"', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
      });

      const errors = validator.validate({name: 'Lalalalalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 12');
    });

    it('валидатор проверяет что значение поля числового типа не меньше значения поля "min"', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 20,
        },
      });

      const errors = validator.validate({age: 2});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 5, got 2');
    });

    it('валидатор проверяет что значение поля числового типа не больше значения поля "max"', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 20,
        },
      });

      const errors = validator.validate({age: 29});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 29');
    });

    it('валидатор проверяет что значени поля числового типа не больше значения поля "max"', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 20,
        },
      });

      const errors = validator.validate({age: 29});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 29');
    });
  });
});
