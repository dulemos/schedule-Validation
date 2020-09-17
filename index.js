const scheduleValidation = async (acceptedSchedules, scheduleToCheck) => {
  const allHours = await makeHoursArr(scheduleToCheck);
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

  console.log(allHours)
  
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
scheduleValidation(acceptedSchedules, scheduleToCheck);

// TODO:
// 1- verificar se data e horário estão compatíveis
// 1.1- somar data aceita com tempo de serviço (inicio e fim)
// se meu horario inicial tiver entre algum horario final e inicial aceito ou meu horario final tiver entre
// meu horario inicial e final aceito ==== indisponível

// acceptedSchedules:
// [{
//     "date": Date,
//     "serviceTime": Int,
//     "location": {
//       lat: Double,
//       lng: Double
//     }
// }]

// scheduleToCheck:
// {
//     "dateRangeStart": Date,
//     "dateRangeEnd": Date,
//     "serviceTime": Int,
//     "location": {
//         lat: Double,
//         lng: Double
//     }
// }
