import Car from '../cars';

describe('car', () => {
  it('should be invalid if required properties are empty empty', (done) => {
    const car = new Car();

    car.validate((err) => {
      expect(err.name).toBe('ValidationError');
      expect(err.errors).toHaveProperty('make', 'model', 'color');
      done();
    });
  });
  it('should be valid with extra invalid properties specified', (done) => {
    const car = new Car();
    car.make = 'Ford';
    car.model = 'Endeavour';
    car.color = 'White';
    car.engine = 'Invalid';
    car.validate((err) => {
      expect(err).toBeNull();
      done();
    });
  });
});
