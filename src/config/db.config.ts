const mongooseConnect = require("mongoose");
  require("../api/model/User.model")
  require("../api/model/Nft.model")
 require("../api/model/HistoryNft.model")
 
mongooseConnect.Promise = global.Promise;
mongooseConnect.set('strictQuery', false);
mongooseConnect.connect(  process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("connection success .."))
.catch((err:any) => console.log(err));
