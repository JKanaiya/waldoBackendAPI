# FindWaldoAPI

FindWaldo API provides the backend API for these projects: 
2. https://github.com/JKanaiya/WhereisWaldoFrontend

## Usage

### Setup

1. Clone the repo
```bash
git clone https://github.com/JKanaiya/waldoBackendAPI
cd waldoBackendAPI
```
2. Install dependencies
```bash
npm install
```
3. Create and configure .env
```bash
echo "DATABASE_URL=<your_database_url> >> .env
```
4. Run the development server
```bash
node --run dev
```

## API Endpoints
### GET
|  Endpoint      |     Purpose   |
| ------------- | ------------- |
|   `/charData` | *attempts to obtain specified character data*|


### POST
|  Endpoint      |     Purpose   |
| ------------- | ------------- |
|   `/picture` | *attempts to add a picture to the database|
|   `/char` | *attempts to add a character to a specified picture*|
|   `/guess` | *make a guess on a specified character's location on a picture*|


### PATCH
|  Endpoint      |     Purpose   |
| ------------- | ------------- |
|   `/name` | *attempts to change a user's displayed name*|



--------
## Features

- Easy correction of a character's location using Prisma seed functionality.
- Safely track a user's score.
- Simple process to add a picture and its character's details.
- Validation of a user's guess with a prompt response.


License
-------

The project is licensed under the GPL license.

