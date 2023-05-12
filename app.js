const express= require('express');
const app= express();
const _ = require('lodash');
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Journal", {useNewUrlParser: true});


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

var page="home";
var homeContent="You know I'm a dreamer But my heart's of gold\nI had to run away high\nSo I wouldn't come home low\nJust when things went right\nIt doesn't mean they were always wrong";
var aboutContent="Lorem ipsum dolor sit, amet consectetur adipisicing elit.\nAtque nihil perferendis dolorum magni laborum tempora! Veniam distinctio eos blanditiis, \nmollitia eaque necessitatibus ab deleniti modi expedita quae amet id obcaecati.";
var contactContent="content";
var content=homeContent;

var posts=[];
var display=[];

const postSchema= {title: String, content: String};
const Post = mongoose.model('post', postSchema);


app.get('/', (req, res) => {
    if(page=="home"){
        console.log('reach home')
        Post.find({})
        .then(function(foundPosts){
            posts.length=0;
            for(let i = 0; i < foundPosts.length; i++){
                posts.push(foundPosts[i].title);
                posts.push(foundPosts[i].content);  
            }
            res.render('page', {currentPage: page, content: content, posts: foundPosts, display: display});
        })
        .catch(function(err){
             console.log(err);
             res.render('page', {currentPage: page, content: content, posts:foundPosts, display: display});
        });
    }else{
        console.log("not home");    
        res.render('page', {currentPage: page, content: content, posts:[], display: display});
    }

})



app.post('/publish', function(req, res) {
    let title =req.body.title;
    let newContent =req.body.content;
    if(title==""){
        title="Empty Title";
    }
    if(newContent==""){
        newContent="Empty Content";
    }
    var name=_.lowerCase(title);
    var finalName = _.capitalize(name);

    let post = new Post({title: finalName, content: newContent});
    post.save()
    .then( function(){
        page="home";
        content=homeContent;
        res.redirect('/');
        })
    .catch(err=> console.log(err));    
    // posts.push(title, newContent);

})


app.get('/home',function(req, res){
    page="home";
    content=homeContent;
    res.redirect('/');
})

app.get('/about',function(req, res){
    page="about";
    content=aboutContent;
    res.redirect('/');
})

app.get('/contact',function(req, res){
    page="contact";
    content=contactContent;
    res.redirect('/');
})

app.get('/compose',function(req, res){
    page="compose";
    res.redirect('/');
})

app.get('/posts',function(req, res){
    page="posts";
    content="";
    res.redirect('/');
})

app.get("/posts/:postID",function(req, res){
    console.log("trigger")
    var postID=req.params.postID;
    console.log(postID);
    let count=0;
    display.length=0;
    Post.find({_id:postID})
    .then(function(foundPosts){
        console.log(foundPosts);
        display.push(foundPosts[0].title);
        display.push(foundPosts[0].content);  
        console.log(display);
    })
    .catch(err =>console.log(err));
    page="posts";
    content="";
    res.redirect('/');

})


app.listen(3000,function(req, res) {

    console.log("listening on port 3000");
})