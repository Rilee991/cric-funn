# Getting Started with Cric-Funn

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\

#### Deployment

The App has been deployed using firebase. Check it out here
https://cric-funn.web.app

##### TODO:
2. Make a new cric-funn logo
3. Make eslint for src folder
12. Explore push-notifications
16. Making functionality for saving backups and restoring

#### COMPLETED:
1. Need to delete all unused resources
4. Make a proper flow for syncing matches into db so won't have to do code change at the beginning of league
5. Making no matches component
6. Change matches logic - old logic - fetch matches from cricapi and also sync for unsettled matches: 
new logic - fetch matches from db and sync results to db on each refresh for only unsettled matches and for updating pts first check into db if the match is unsettled only then hit the cricapi
7. Change view bets and lets bet dialog ui
8. Add legends page consisting of WM posters and Winners
9. Fixing performance ui issues in navbar
10. Modal not opening on mobile devices
11. Make modal for bday wishes
13. Make swipe button for betting
14. Add a div for showing credits left
15. Making a configurations table to store common items like credits, backups etc.
17. Make go all in badge as stylish to highlight to user