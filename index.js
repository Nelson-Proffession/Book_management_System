const express = require('express')
const mysql = require('mysql')
const ejs = require('ejs')
const app = express();
const path = require('path')


const bodyparser=require('body-parser');
const json = require('body-parser/lib/types/json');
const { dirname } = require('path');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"book_management",
});
db.connect(err=>{
    if(err){
    console.log("database Not connected");
    }
    else{
        console.log('connected')
    }
}
)
app.get('/',(req ,res) =>{
    res.render('form')

}
)

// create abook
app.post('/add',(req,res)=>{
 const {book_name,author,publisher} = req.body;
const sql = `INSERT INTO book (book_name, author, publisher) VALUES (?,?,?)`;
db.query(sql,[book_name,author,publisher],(err,data) => {
  if (!err) {
    res.redirect('/books');
  } else {
    console.error(err)
    res.status(500).json({ message: "Failed to insert book." });
  }
})
});

// (read)select book
app.get('/select/:id',(req ,res)=>{
    const {id} = req.params;
    const sql=`select * from book where id='${id}'`;
  
    db.query(sql, (err ,data)=>{
        if(err){
        res.status(200).json({message:"No book found"});
    }
    res.redirect('edit',{book:result [0]  })
    });

});
app.get('/books', (req, res) => {
    const sql = `SELECT * FROM book`;
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send("Failed to fetch books.");
      }
      res.render('booklist', { books: result });
    });
  })
app.get('/',(req,res)=>{
    res.render('register')
})
//New path to edit
app.get('/edit/:id',(req,res)=>{
    const {id} =req.params;
    const sql=`SELECT * from book where id='${id}'`;
    db.query(sql,(err,data)=>{
 if(data.length>0){
    res.render('update',{user:data[0]});
 }
 else{
    res.status(500).json({message:"NO update"});
 }
    })

});
// update
app.post('/update/:id',(req ,res)=>{
    const {book_name,author,publisher} =req.body;
    const { id } = req.params;
    const sql=`update book SET book_name='${book_name}', author='${author}', publisher='${publisher}' where id='${id}'`;  
    db.query(sql, (err ,data)=>{
        if(!err){
             res.status(200).redirect('/books');
        }
        else{
            res.status(500).json({message:"Not updated"});
        }
       
    })
    

})    
// new path to delete
app.get('/delete/:id',(req,res)=>{
    const {id} =req.params;
    const sql=`DELETE from book where id='${id}'`;
    db.query(sql, (err)=>{
    if(!err){
        res.status(200).redirect('/books');
    }
else{
    res.status(500).json({message:"Not deleted"});}
});
})
// delete
// app.delete('/delete/:id',(req,res)=>{
//     const {id}=req.params;
//     const sql=`delete from book where id='${id}'`;
//     db.query(sql,(err)=>{
//         if(err){
//             res.status(200).redirect('/books');
//         }
//         res.redirect('/book');

//     });
        

    // });



app.listen(4000,console.log("server is running at 4000 port"));
