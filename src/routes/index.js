const express = require('express')
const axios = require('axios')
const router = express.Router()



router.get('/', async (req, res) => {
  res.render('./userViews/post.ejs')
});


router.get('/:number/:volume/:ratio/:nratio', async (req, res) => {
  let response = null;
  const number=req.params.number
  const volume=req.params.volume
  const ratio=req.params.ratio
  const nratio=req.params.nratio
new Promise(async (resolve, reject) => {
  try {
    response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': '6344f857-fa83-42a1-8a09-cbdabe09d5f1',
      },
    });
  } catch(ex) {
    response = null;
    // error
    console.log(ex);
    reject(ex);
  }
  if (response) {
    // success
    const json = response.data;
    resolve(json);
    const result = json.data.slice(0, number);
    // res.json(result)
    var totalVolume=0
    for(var i of result){
      totalVolume=totalVolume+i.quote.USD.volume_24h
    }
    var restRatio=0
    for(var i=nratio;i<result.length;i++){
      restRatio=restRatio+((result[i].quote.USD.volume_24h)*100)/(totalVolume)
    }
    res.render('./userViews/index',{result,totalVolume,volume,ratio,nratio,restRatio})
  }
});  
// res.render('./userViews/index')
});


router.post('/', async (req, res) => {
  const number=req.body.number
  const volume=req.body.volume
  const ratio=req.body.ratio
  const nratio=req.body.nratio
  res.redirect(`/${number}/${volume}/${ratio}/${nratio}`)
});


module.exports = router
