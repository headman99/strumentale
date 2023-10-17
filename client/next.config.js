/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        unoptimized: true
    },
    webpack: (config,{isServer}) => {
        if(!isServer){
          config.resolve.fallback = { fs: false ,path: false,child_process:false, net:false}  
        }
        

        return config;
    }
}
