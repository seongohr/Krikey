const {Client} = require('pg')
const initial = async () => {
    tryCnt = 10
    while (tryCnt) {
        const client = new Client({
            user: 'postgres',
            host: 'postgresql',
            database: 'postgres',
            password: 'postgres',
            port: 5432
        });

        await client.connect().then(async function() {
            tryCnt = 0
            const fs = require('fs')
            await client.query(fs.readFileSync('./database.sql', 'UTF-8'), (err,result) => {
                if (err) {
                    console.log(err)
                }
                console.log("Success!")
                client.end()
            })
        }).catch(async function(err) {
            tryCnt -= 1
            console.log(err)
            await new Promise(resolve => setTimeout(resolve, 4000))
        })
    }
}

initial()
