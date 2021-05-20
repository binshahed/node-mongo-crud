const express = require("express");
const bodyParser = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

// const password = "7rj7NfWyiE1v3fFm";

const uri =
  "mongodb+srv://organicUser1:organicUser1@cluster0.o73vx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productCollection = client.db("organicbd").collection("products");

  app.get("/products", (req, res) => {
    productCollection
      .find({})
      .limit(10)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: objectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      console.log("data add successfully");
      res.redirect("/");
    });
    // console.log(product);
  });

  app.patch("/update/:id", (req, res) => {
    console.log(req.body.price);
    productCollection
      .updateOne(
        { _id: objectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: objectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
        console.log("data delete successfully");
      });

    // console.log(req.params.id);
  });
});

app.listen(3000);
