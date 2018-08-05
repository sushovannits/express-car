import Car from '../../models/cars';
import colors from '../../models/colors';
import fs from 'fs';
import faker from 'faker';

// TODO: Put it in init function
const carFakeData = JSON.parse(fs.readFileSync(__dirname + '/car-mock-data.json'));
const makerArr = carFakeData.map(maker => Object.keys(maker)[0]);
const modelArr = carFakeData;

export function generateData() {
  const arr = [];
  const content = fs.readFileSync('./car-mock-data.json');
  const contentParsed  = JSON.parse(content);
  contentParsed.forEach(maker => {
    arr.push({
      [maker.value] : maker.models.map(model => model.title) 
    });
  });

  fs.writeFileSync('car-data-filter-1.json', JSON.stringify(arr));
}

export function getValidRandomCar(num) {
  const retArr = [];
  for(let i = 0; i < num; i++) {
    const car = new Car();
    car.make = faker.helpers.randomize(makerArr);
    car.model = faker.helpers.randomize(modelArr[car.make]);
    car.color = faker.helpers.randomize(colors);
    retArr.push(car);
  }
  return retArr;
}

export function getValidCar() {
  const car = new Car();
  car.make = 'Ford';
  car.model = 'Endeavour';
  car.color = 'White';  
  return car;
}

export async function populateDbMock() {
  const carArr = [];
  for(let i = 0; i < 50 ; i++ ) {
    const make = faker.helpers.randomize(makerArr);
    carArr.push({
      make : make,
      model : faker.helpers.randomize(modelArr[make]),
      color : faker.helpers.randomize(colors),
    })
  }
  try {
    await Car.insertMany([carArr[0], carArr[0], carArr[1], carArr[2]], {
      ordered: false
    });
    console.log('Data mocked');
    return true;
  } catch(err) {
    if(err && err.code === 11000) {
      return true;
    }
    console.log(err);
    return false;
  }
}