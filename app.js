const { MongoClient } = require('mongodb')
const assert = require('assert')
const circulationRepo = require('./repos/circulationRepo')
const data = require('./circulation.json')

const url = 'mongodb://localhost:27017'
const dbName = 'circulation'

async function main () {
    const client = new MongoClient(url)
    await client.connect()
    try {
        const results = await circulationRepo.loadData(data)
        assert.equal(data.length, results.insertedCount)

        const getData = await circulationRepo.get()
        assert.equal(data.length, getData.length)

        const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper })
        assert.deepEqual(filterData[0], getData[4])

        const limitData = await circulationRepo.get({}, 3)
        assert.equal(limitData.length, 3)

        const byId = await circulationRepo.getById(getData[4]._id)
        assert.deepEqual(byId, getData[4])

        const newItem = {
            "Newspaper": "Chernivtsi24",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 2,
            "Change in Daily Circulation, 2004-2013": 10,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 3,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 2,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 1
        }

        const addedItem = await circulationRepo.add(newItem)
        assert(addedItem._id)

        const addedItemQuery = await circulationRepo.getById(addedItem._id)
        assert.deepEqual(addedItemQuery, addedItem)

        console.log(addedItem._id)

    } catch (e) {
        console.log(e)
    } finally {
        const admin = client.db(dbName).admin()

        await client.db(dbName).dropDatabase()
        console.log(await admin.listDatabases())

        await client.close()
    }
}

main()
