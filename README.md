### General information
- folder api: contains the code relative to the Node.js server at the address [https://crawler.strumentale.it] hosted on Ionos VPS.
- folder client: contains the code relative to the frontend app th the address [https://app.strumentale.it] hosted on Ionos web hosting.

Both the folders are stand-alone so they don't communicate to each other hence they can be splitted eventually and deployed on different devices (which is the current case).
As future updates one may consider to deploy both api and client folders on the same machine (reason why they're present in the same repository).

### Before starting 
For local testig ensure to have the correct Next.js and Node.js version installed on the current machine, they run respectively on version Node v18.18.0 and Next.js 13.4.12.
Remove the extension ".example" from the following files:
- #### /api/functions/backend.js.example
- #### /client/src/utils/backend.js.example
- #### /client/.env.example

### Installation
Clone the repository and run the command

```bash
npm install
```
It will install the node_modules necessary to run the project locally.

### Testing
For frontend code local testing, after every dependency is set-up:<br />
#### client folder 📁 <br />
```bash
npm run dev
```
#### api folder 📁
```bash
node index.js
```
which will run the local server at the address [http://localhost:8800] editable from the file index.js.

### Deployment
#### client folder 📁 <br />
run the following command for an optimized export build of the project:
```bash
npm run export
```
then all the relative files on the ionos web hosting need to be replaced with all the files that will be generated in the folder client/out, remember to zip them first!!

#### api folder 📁 <br />
there will be need to run the project by using [pm2] command on the server, link to learn more about it [https://pm2.keymetrics.io/].

### Update
#### client folder 📁 <br />
for every update there will be the need to follow the same procedure descripted in the Deployment section because of the static nature of the export.

#### api folder 📁 <br />
it's sufficient to access the server where the api folder is located by remote, run:
```bash
git pull
```
solve the conflicts if neecessary, and then:
```bash
pm2 restart api
systemctl reload nginx
```
