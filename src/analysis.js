const { getTrips, getDriver } = require('api');
/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
    // Your code goes here
    const data = await getTrips();
    // variable creations and data sorting...
    let totalBills = 0
    let cashBills = 0
    let nonCashBills = 0
    let cashCount = 0
    let nonCashCount = 0
    let vehicleCount = 0;
    let driversIdObj = {}
    let driverEarn = {}
    data.map(obj => {
        let billAmount = Number((`${obj.billedAmount}`).replace(",", ""))
        totalBills += billAmount
        if (obj.isCash) {
            cashCount++;
            cashBills += billAmount;
        } else {
            nonCashCount++;
            nonCashBills += billAmount;
        }
        driversIdObj[obj.driverID] = (driversIdObj[obj.driverID] || 0) + 1;
        driverEarn[obj.driverID] = (driverEarn[obj.driverID] || 0) + billAmount;
    })
    let driversUnique = Object.keys(driversIdObj)

    function highest(params) {
        let highTrip = Object.entries(params).sort((a, b) => b[1] - a[1]);
        let index = highTrip[0]
        return index
    }
    let mostTrips = {}
    let mostEarn = {}
    let mappArr = data.map(async(driver, index) => {
        if (highest(driversIdObj)[0] == driversUnique[index]) {}
        try {
            const driverData = await getDriver(driversUnique[index]);
            if (driverData.vehicleID.length > 1) {
                vehicleCount++
            }
            if (highest(driversIdObj)[0] == driversUnique[index]) {
                mostTrips.name = driverData.name
                mostTrips.email = driverData.email
                mostTrips.phone = driverData.phone
                mostTrips.noOfTrips = highest(driversIdObj)[1]
                mostTrips.totalAmountEarned = driverEarn[highest(driversIdObj)[0]]
            }
            if (highest(driverEarn)[0] == driversUnique[index]) {
                mostEarn.name = driverData.name
                mostEarn.email = driverData.email
                mostEarn.phone = driverData.phone
                mostEarn.noOfTrips = highest(driversIdObj)[1]
                mostEarn.totalAmountEarned = driverEarn[highest(driverEarn)[0]]
            }
        } catch (error) {}
    })
    await Promise.all(mappArr)
    let results = {
        "noOfCashTrips": cashCount,
        "noOfNonCashTrips": nonCashCount,
        "billedTotal": +(totalBills.toFixed(2)),
        "cashBilledTotal": +(cashBills.toFixed(2)),
        "nonCashBilledTotal": +(nonCashBills.toFixed(2)),
        "noOfDriversWithMoreThanOneVehicle": vehicleCount,
        "mostTripsByDriver": mostTrips,
        "highestEarningDriver": mostEarn
    }
    return results;
}
module.exports = analysis;