import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db=new pg.Client({
  database:"permalist",
  password:"password1234",
  port:"5432",
  user:"postgres",
  host:"localhost"
});
db.connect();

let items = [
  // { id: 1, title: "Buy milk" },
  // { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  try {
    const result=await db.query("SELECT * FROM items ORDER by id ASC");
    items=result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } 
  catch (err) {
    console.log(err);
  }
  
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  // items.push({title: item});
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});


app.post("/edit", async(req, res) => {
const item=req.body.updatedItemTitle;
const id=req.body.updatedItemId;
try
{await db.query("update item set title=($1) where id=$2",[item, id])
res.redirect("/")
}
catch(err)
{
  console.log(err);
}
});

app.post("/delete", async(req, res) => {
  const id=req.body.deleteItemId;
  try{
    await db.query("Delete from items where id=$1",[id]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
