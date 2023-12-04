
## Broke Blessings
![example workflow](https://github.com/vilinh/free-stuff/actions/workflows/node.js.yml/badge.svg)
![example workflow](https://github.com/vilinh/free-stuff/actions/workflows/frontend-react-ci.yml/badge.svg)
![example workflow](https://github.com/vilinh/free-stuff/actions/workflows/main_broke-blessings.yml/badge.svg)
---
Broke Blessings is an online website where you can discover and share free stuff. This platform is made for you to easily give away and claim free items whether you're trying to declutter, looking to share unused items, or simply trying to find some free stuff. Join Broke Blessings today and experience the joy of giving and receiving without any cost.

#### Key Features
- **Free Listings:** Post your unwanted items easily and for free. Share the love by giving away things you no longer need, and let others benefit from your generosity.
- **Search and Discover:** Explore a wide array of listings to find items that suit your needs. From furniture to books and clothing, there's something for everyone.
- **Filter and Sort:** Filter and sort by different categories, location, and claimed/unclaimed items.
---
### Docs

[Link to UI Prototype](https://github.com/vilinh/free-stuff/blob/main/docs/ui%20mockup.pdf) (last updated 10/25/23)

[Diagrams](https://github.com/vilinh/free-stuff/wiki/Class-Diagrams)

---

### Dev Environment Setup
1. Clone to local workspace

2. Frontend
  - `cd frontend`
  - `npm install`
  - add `firebase.js` to `frontend/src`
  - add `.env` to `frontend`
    - set `REACT_APP_GOOGLE_MAPS_API_KEY=<your_google_maps_api_key>`

3. Backend
  - `cd backend`
  - `npm install`
  - add `.env` to `backend`
    - set `DATABASE_URL="<your_mongo_connection_string>"`
    - set `GOOGLE_MAPS_API_KEY="<your_google_maps_api_key>"`

---
### Running the app
`/backend`
```
cd backend
npm run start
```
`/frontend`
```
cd frontend
npm run start
```
---

#### Code Coverage
![code coverage](https://github.com/vilinh/free-stuff/blob/main/docs/1130codecoverage.png?raw=true)
*Report Generated 11/30/23 8:45PM*
- Install 'Prettier - Code formatter' extension in VSCode
