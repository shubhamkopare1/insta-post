const express = require("express");
const multer = require("multer");
const path = require("path");
var methodOverride = require('method-override')
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 8080;

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('img');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
}

// Set view engine
app.set("view engine", "ejs");

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
// Serve static files (including uploaded images)
app.use(express.static(path.join(__dirname, 'public')));

let posts = [
     {
        id:uuidv4(),
        username : "rvjinsta",
        content:"Ms Dhoni",
        img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqfrJXmZSGyhhwyRJZ3K491lgKLtkjdZCgTiXg_DgSpw&s"
    },
    {
        id:uuidv4(),
        username : "sandip_maheshvari",
        content:"Ms Dhoni",
        img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1d10nzP19HyxcomV4sXo3P2Q32YYHduijfjdUXqk21A&ss"
    },
    {
        id:uuidv4(),
        username : "rvjinsta",
        content:"Ms Dhoni",
        img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTNT6XVqLOx-jnarUOvzBKZsdUXoXXuKR-9-TbpUzgGQ&s"
    },
    {
        id:uuidv4(),
        username : "rvjinsta",
        content:"Ms Dhoni",
        img:"https://i.pinimg.com/736x/b9/e3/f4/b9e3f44f0ff189f8c27fa17cd13152d5.jpg"
    },
];

// GET route to render the index page with posts
app.get("/post", (req, res) => {
    res.render("index.ejs", { posts });
});

// GET route to render the new post form
app.get("/post/new", (req, res) => {
    res.render("new.ejs");
});
app.get("/post/:id",(req,res)=>{
    let {id}=req.params;
    let post = posts.find((p)=> id === p.id)
    res.render("view.ejs",{post})
})

// POST route to handle form submission and image upload
app.post("/post", (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            res.render("new.ejs", { msg: err });
        } else {
            if (req.file == undefined) {
                res.render("new.ejs", { msg: 'Error: No file selected!' });
            } else {
                let { username, content } = req.body;
                let id = uuidv4();
                let img = `/uploads/${req.file.filename}`; // Path to uploaded image
                posts.push({ username, content, img ,id});
                res.redirect("/post");
            }
        }
    });
});
app.patch("/post/:id/edited",(req,res)=>{
   let {id}=req.params;
   let newContent =req.body.content;
   let post =posts.find((p)=> id === p.id)
   post.content = newContent;
   console.log(post);
   res.redirect("/post")


})
app.delete("/post/:id",(req,res)=>{
    let {id}=req.params;
    posts = posts.filter((p)=> id != p.id)
    res.redirect("/post")
})
app.get("/post/:id/edit",(req,res)=>{
    let {id}=req.params;
    let post = posts.find((p)=> id === p.id);
    res.render("edit.ejs",{post})
})
app.listen(port, () => {
    console.log("Server started on port", port);
});
