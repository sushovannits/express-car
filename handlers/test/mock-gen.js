import Car from '../../models/cars';
import colors from '../../models/colors';
import fs from 'fs';
import faker from 'faker';

// TODO: Put it in init function
const carFakeData = JSON.parse(fs.readFileSync(__dirname + '/car-mock-data.json'));
const makerArr = Object.keys(carFakeData);
const makeToModelMap = carFakeData;

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
    car.model = faker.helpers.randomize(makeToModelMap[car.make]);
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

export async function populateDbMock({ num = 20, model, make, color }) {
  const carArr = [];
  for(let i = 0; i < num ; i++ ) {
    let makeGen, modelGen, colorGen;
    if (model || make || color) {
      // If nay of these are specified then we only randomize the maker
      // For other fields we just keep iterating through the arrays
      makeGen = make || faker.helpers.randomize(makerArr);
      colorGen = color || colors[i%colors.length];
      const makerModelArr = makeToModelMap[makeGen];
      modelGen = model || makerModelArr[i%makerModelArr.length];
    } else {
      makeGen = faker.helpers.randomize(makerArr);
      modelGen = faker.helpers.randomize(makeToModelMap[makeGen]);
      colorGen = faker.helpers.randomize(colors);
    }
    carArr.push({
      make : makeGen,
      model : modelGen,
      color : colorGen
    })
  }
  try {
    await Car.insertMany(carArr, {
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

export async function dropAll() {
  await Car.remove({}).then( _ => {
    console.log(`All removed`);
  })
}
