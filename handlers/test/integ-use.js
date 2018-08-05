import faker from 'faker';
import mongoose from 'mongoose';
import Car from '../../models/cars';
import colors from '../../models/colors';
import fs from 'fs';

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s Connection error with mongodb. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
const carFakeData = JSON.parse(fs.readFileSync('./car-mock-data.json'));
const makerArr = carFakeData.map(maker => Object.keys(maker)[0]);
const modelArr = carFakeData;
const carArr = [];
function gen() {
for(let i = 0; i < 50 ; i++ ) {
  // const car = new Car();
  // car.make = faker.helpers.randomize(makerArr);
  // car.model = faker.helpers.randomize(modelArr[car.make]);
  // car.color = faker.helpers.randomize(colors);
  const make = faker.helpers.randomize(makerArr);
  carArr.push({
    make : make,
    model : faker.helpers.randomize(modelArr[make]),
    color : faker.helpers.randomize(colors),
  })
  // try {
  //   await car.save();
  // } catch (err) {
  //   console.log(err);
  // } 
}
}
gen();
Car.insertMany(carArr).then (_ => {
  console.log('All done')
  process.exit();
}).catch(err => {
  console.log(err);
})
// gen().then( _ => {
//   process.exit();
// });