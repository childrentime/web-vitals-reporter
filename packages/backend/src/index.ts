import { InfluxDB, Point } from '@influxdata/influxdb-client'
import dotenv from "@jsdotenv/core";
import path from 'path';
import express from 'express'

const envPath = path.resolve(__dirname + "/../.env");
dotenv.load([envPath]);

const token = process.env.INFLUXDB_TOKEN;
const port = process.env.PORT;
const url = 'http://localhost:8086'

const client = new InfluxDB({url, token});
let org = `web-vitals-org`
let bucket = `web-vitals`

const writeClient = client.getWriteApi(org, bucket, 'ns');

const app = express()
app.use(express.json());

interface Vitals {
  name: 'LCP' | 'FCP' | 'TTFB',
  value: number;
}

app.post('/writeVitals',express.text(), function (req, res) {
  try {
    if (typeof req.body === "string"){
      req.body = JSON.parse(req.body);
    }
    const { name, value } = req.body as Vitals;
    const point = new Point('vital-measurement').intField(name,value);
    writeClient.writePoint(point);
    writeClient.flush()
    res.status(200).json({
      message: 'Success'
    });
  } catch (error) {
    res.status(500).json({
      error: JSON.stringify(error)
    })
  }
})

app.listen(port, () => {
  console.log(`Api is ready on port ${port}`)
})