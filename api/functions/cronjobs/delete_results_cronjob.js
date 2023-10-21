const nodeCron = require("node-cron");
const { axiosInstance } = require("../axios");

const Cronex = '0 0 1 * *'
nodeCron.schedule(Cronex, async () => {
    try{
      await axiosInstance('/node/delete_old_results')  
    }catch(error){
        console.log("cancellazione non riuscita")
    }
    
});