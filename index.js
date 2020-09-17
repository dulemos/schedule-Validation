const fetch = require('node-fetch');
require('dotenv').config()


const scheduleValidation = async (acceptedSchedules, scheduleToCheck) => { 

    // adiciona o tempo de rota
    await acceptedSchedules.forEach(schedule => {
        getRouteDuration(schedule.location, scheduleToCheck.location)
          .then(time => {
              schedule.date = new Date(schedule.date.getTime() - time.value * 1000)
              schedule.serviceTime = schedule.serviceTime + Math.floor(time.value / 60) * 2
          })
    })
  
  // Gera o array de datas disponíveis
  const allHours = await makeHoursArr(scheduleToCheck);

  // Valida quais datas estão disponíveis  
  allHours.forEach(hour => {
      if(hour.isAvaible){
          acceptedSchedules.forEach(schedule => {
              let serviceStart = schedule.date.getTime();
              let serviceEnd = schedule.date.getTime() + schedule.serviceTime * 60000;
              if(inBetween(serviceStart, serviceEnd, hour.date.getTime())) hour.isAvaible = false
              if(inBetween(serviceStart, serviceEnd, hour.date.getTime() + scheduleToCheck.serviceTime  * 60000)) hour.isAvaible = false
          })
      }
  })

  //Retorna array de datas disponíveis    
  const hours = allHours.map(hour => {
      if(hour.isAvaible) return `${hour.date.getUTCHours()}:${(hour.date.getUTCMinutes() < 10 ? '0' : '') + hour.date.getUTCMinutes()}`
  }).filter(hour => hour);
  

  return {
      "canAccept": hours.length > 0,
      "hours": hours
  }

};

const makeHoursArr = (scheduleToCheck) => {
  let arr = [];
  let cont = scheduleToCheck.dateRangeStart.getTime();
  while (cont <= scheduleToCheck.dateRangeEnd.getTime()) {
    arr.push({
       date: new Date(cont),
       isAvaible: true 
    });
    cont = cont + 5 * 60000; // 5 minutos
  }
  return arr;
};

const getRouteDuration = async (origin, destination) => {
    // console.log(origin.lat, destination)
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${process.env.API_KEY}`
    return await fetch(url)
        .then(res => res.json())
        .then(res => res.routes[0].legs[0].duration)

}

const inBetween = (serviceStart, serviceEnd, hour) =>
  serviceStart <= hour && serviceEnd >= hour;

const acceptedSchedules = [
  {
    date: new Date("2020-09-05T15:00:00.000Z"),
    serviceTime: 30,
    location: {
        lat: -23.530521,
        lng: -46.556751
    }
  },
  {
    date: new Date("2020-09-05T14:00:00.000Z"),
    serviceTime: 30,
    location: {
        lat: -23.528963, 
        lng: -46.549874
    }
  },
  {
    date: new Date("2020-09-05T17:00:00.000Z"),
    serviceTime: 60,
    location: {
        lat: -23.550624, 
        lng: -46.547972
    }
  },
  {
    date: new Date("2020-09-05T19:00:00.000Z"),
    serviceTime: 30,
    location: {
        lat: -23.554736, 
        lng: -46.581319
    }
  },
];

const scheduleToCheck = {
  dateRangeStart: new Date("2020-09-05T15:00:00.000Z"),
  dateRangeEnd: new Date("2020-09-05T17:00:00.000Z"),
  serviceTime: 30,
  location: {
    lat: -23.548282, 
    lng: -46.578069
}
};

async function main() {
    const res = await scheduleValidation(acceptedSchedules, scheduleToCheck);
    console.log(res);
}

main();
