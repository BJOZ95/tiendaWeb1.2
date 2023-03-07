const express = require("express");
const app = express();
const port = 3000;
const repository = require("./repository");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.get("/api/products", async (req, res) => {
  res.send(await repository.read());
});

app.post("/api/pay", async (req, res) => {
  const ids = req.body;
  const productsCopy = await repository.read();

  let error = false;
  ids.forEach((id) => {
    const product = productsCopy.find((p) => p.id === id);
    if (product.stock > 0) {
      product.stock--;
    } else {
      error = true;
    }
  });

  if (error) {
    res.send("Sin stock").statusCode(400);
  }
  else {
    await repository.write(productsCopy);
    res.send(productsCopy);
    
  }
});

app.use("/", express.static("src"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});