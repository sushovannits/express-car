import { expect } from 'chai';
 
import Car from '../cars';
 
describe('car', function() {
    it('should be invalid if required properties are empty empty', function(done) {
        const car = new Car();
 
        car.validate(function(err) {
            expect(err.name).to.be.equal('ValidationError')
            expect(err.errors).to.have.all.keys('make', 'model', 'color');
            done();
        });
    });
    it('should be valid with extra invalid properties specified', function(done) {
        const car = new Car();
        car.make = 'Ford';
        car.model = 'Endeavour';
        car.color = 'White';
        car.engine = 'Invalid';
        car.validate(function(err) {
          console.log(err);
            expect(err).to.be.null;
            done();
        });
    });
});