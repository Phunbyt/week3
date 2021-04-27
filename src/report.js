const {​ getTrips, getDriver, getVehicle }​ = require("api");
/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {​any}​ Driver report data
 */
async function driverReport() {​
  let tripData = await getTrips();
  let array = [];
  let uniqueID = tripData
    .map((item) => item.driverID)
    .filter((item, index, arr) => {​
      return arr.indexOf(item) === index;
    }​);
  for (let i = 0; i < uniqueID.length; i++) {​
    let count = 0;
    let trips = [];
    let cashCount = 0;
    let nonCashCount = 0;
    let totalAmountEarned = 0;
    let totalCashAmount = 0;
    let totalNonCashAmount = 0;
    let vehicleDetails = [];
    // let vehicleData = await getVehicle(uniqueID[i].vehicleID);
    tripData.forEach((item) => {​
      let nums = Number(+`${​item.billedAmount}​`.split(",").join(""));
      if (item.driverID == uniqueID[i]) {​
        totalAmountEarned += nums;
        trips.push({​
          user: item.user.name,
          created: item.created,
          pickup: item.pickup.address,
          destination: item.destination.address,
          billed: nums,
          isCash: item.isCash,
        }​);
        count++;
      }​
      if (item.isCash) {​
        cashCount++;
        totalCashAmount += nums;
      }​ else {​
        nonCashCount++;
        totalNonCashAmount += nums;
      }​
    }​);
    try {​
      let driverData = await getDriver(uniqueID[i]);
      // console.log(driverData);
      for (let j = 0; j < driverData.vehicleID.length; j++) {​
        let vehicleData = await getVehicle(driverData.vehicleID[j]);
        // console.log(vehicleData)
        vehicleDetails.push({​
          plate: vehicleData.plate,
          manufacturer: vehicleData.manufacturer,
        }​);
        // console.log(vehicleDetails)
      }​
      array.push({​
        fullName: driverData.name,
        id: uniqueID[i],
        phone: driverData.phone,
        noOfTrips: count,
        noOfVehicles: driverData.vehicleID.length,
        vehicles: vehicleDetails,
        noOfCashTrips: cashCount,
        noOfNonCashTrips: nonCashCount,
        totalAmountEarned: Number(totalAmountEarned.toFixed(2)),
        totalCashAmount: Number(totalCashAmount.toFixed(2)),
        totalNonCashAmount: Number(totalNonCashAmount.toFixed(2)),
        trips: trips,
      }​)
    }​ catch {​
      if (!array.includes(uniqueID[i])) {​
        array.push({​
          id: uniqueID[i],
          noOfTrips: count,
          noOfCashTrips: cashCount,
          noOfNonCashTrips: nonCashCount,
          trips: trips,
          totalAmountEarned: Number(totalAmountEarned.toFixed(2)),
          totalCashAmount: Number(totalCashAmount.toFixed(2)),
          totalNonCashAmount: Number(totalNonCashAmount.toFixed(2)),
        }​);
      }​
    }​
  }​
  return array;
}​
module.exports = driverReport;