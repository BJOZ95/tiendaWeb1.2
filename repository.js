const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: './your-secret-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: "v4", auth: auth });

//funcion para leer los datos
async function read() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1CDj2qvkk1KNmDuZipghsFIkerM37Cy9Dr-hTqUs5Rww",//ID de la hoja de calculo Google
    range: "Products!A2:E",//Las columnas que leerá
  });

  const rows = response.data.values;
  const products = rows.map((row) => ({
    id: +row[0],
    name: row[1],
    price: +row[2],
    image: row[3],
    stock: +row[4],
  }));
  
  return products;
}
//funcion para escribir en la base de datos
async function write(products) {
  let values = products.map((p) => [p.id, p.name, p.price, p.image, p.stock]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1CDj2qvkk1KNmDuZipghsFIkerM37Cy9Dr-hTqUs5Rww",
    range: "Products!A2:E",
    valueInputOption: "RAW",
    resource,
  });

  console.log(result.updatedCells);
}


module.exports = {
  read,
  write,
};
