# codETHS Boosters

Warning: This repository doesn't follow semver yet, so there might be unexpected breaking changes.

## Running the app
1) Copy `keys.example.json` to `keys.json` and replace the values as needed
2) `npm install`
   * Also install GraphicsMagick with your host package manager if PNG support is required.
3) `node .`

## Environment Variables

* B_SECRET - The secret string users need to know to use the service.
* B_SUPPRESS_SECRET_WARNING - This is a development environment and we shouldn't warn the user about the absence of a secret.
* B_USING_HTTPS - Whether the service is accessible via HTTPS.
