// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    firebase: {
        apiKey: "AIzaSyAUftYP_SbM8KllaiDyyEftRMs06r4n80A",
        authDomain: "schedulic-63c65.firebaseapp.com",
        databaseURL: "https://schedulic-63c65-default-rtdb.firebaseio.com",
        projectId: "schedulic-63c65",
        storageBucket: "schedulic-63c65.appspot.com",
        messagingSenderId: "914032289146",
        appId: "1:914032289146:web:d3a37c675a9b93dd1122c3",
        measurementId: "G-7XK7RF9MKG"
    },
    googleMapAPIKey: 'AIzaSyA8RwRCpG7ajbR-pl0D58oUGzi83c6RCYk',
    apiUrl:         'https://api.schedulic.com/api',
    authApiUrl:     'https://api.schedulic.com/api',
    apiDomainUrl:     'https://api.schedulic.com',
    urlForLink :    'http://localhost:4200',
    bookpageLink :    'http://localhost:4100',
    ErrorMsg:"Something went wrong",

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
