const { MongoClient, ObjectID } = require('mongodb')

function circulationRepo() {
    const url = 'mongodb://localhost:27017'
    const dbName = 'circulation'

    function loadData(data) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)

            try {
                await client.connect()
                const db = client.db(dbName)
                const results = await db.collection('newspapers').insertMany(data)

                resolve(results)

                await client.close()

            } catch (e) {
                reject(e)
            }
        })
    }

    function get(query, limit) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)

            try {
                await client.connect()

                const db = client.db(dbName)
                let items = db.collection('newspapers').find(query)

                if (limit > 0) {
                    items.limit(limit)
                }

                resolve(await items.toArray())

                await client.close()

            } catch (e) {
                reject(e)
            }
        })
    }

    function getById(id) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)

            try {
                await client.connect()

                const db = client.db(dbName)
                let item = db.collection('newspapers').findOne({_id: ObjectID(id)})

                resolve(item)

                await client.close()

            } catch (e) {
                reject(e)
            }
        })
    }

    function add(item) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)

            try {
                await client.connect()
                const db = client.db(dbName)

                const addedItem = await db.collection('newspapers').insertOne(item)

                resolve(addedItem.ops[0])

                await client.close()

            } catch (e) {
                reject(e)
            }
        })
    }

    return {
        loadData,
        get,
        getById,
        add
    }
}

module.exports = circulationRepo()
