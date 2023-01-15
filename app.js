const express = require("express");
const axios = require("axios");
const app = express();

const getPage = async url => {
  try {
    const data = await axios.get(url);
    return data;
  } catch (err) {
    console.log(err);
  }
};
const ISBNKURL = `https://www.isyatirim.com.tr/_layouts/15/IsYatirim.Website/Common/Data.aspx/SirketBilgileriBySektor?sektor=`;

const BORSA =
  "https://webapi.tmgrup.com.tr/Economy/GetBistShares";

// const TEMETTU =
//   "https://web-cloud-dev.foreks.com/web-services/historical-data/split-divident";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", async (req, res) => {
  const borsa = await axios
    .get(`${BORSA}`)
    .then(data => data.data);
  const sektor = ["00", "0001", "0040", "0015", "0019"];
  const isHisseler = (
    await Promise.all(
      sektor.map(async sek => {
        const data = await axios.get(
          `${ISBNKURL}${sek}&takip=Yes&yil=1`
        );

        return data.data.value;
      })
    )
  ).flat();
  // const temettu = await axios
  //   .get(`${TEMETTU}`)
  //   .then(data => data.data);
  res.status(200).send({ borsa, isHisseler });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
