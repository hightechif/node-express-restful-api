const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
let posts = require('./masterdata/posts.json');

const app = express();
const PORT = 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routing
app.get('/api/posts', (req, res) => {
  res.status(200).json(posts);
})

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(singlePost => singlePost.id === parseInt(req.params.id, 10));
  res.status(200).json(post);

  // const 

  // index = parseInt(req.params.id, 10);
  // if (index > 0 && index < posts.length) {
  //   res.status(200).json(posts[index]);
  // } else {
  //   res.status(404).json({})
  // }
})

app.post('/api/posts', (req, res) => {
  const { title, body } = req.body;
  const lastIdx = posts.length - 1;
  const id = posts[lastIdx].id + 1;

  const newPost = {
    id:id,
    title:title,
    body:body
  }

  posts.push(newPost);

  fs.writeFile('./masterdata/posts.json', JSON.stringify(posts), (err) => {
    if (err) {
      res.status(4040).json({
        message: "Something wrong when post the data"
      })
    }
    res.status(200).json({
      message: ""
    })
  })
  res.status(200).json(
    {
      message: "Post has been inserted Successfully",
      newPost
    }
  );
})

app.put('/api/posts/:id', (req, res) => {
  let post = posts.find(x => x.id === parseInt(req.params.id, 10));
  let updatedPost = {};

  const params = {
    title: req.body.title,
    body: req.body.body
  }

  updatedPost = {
    ...post,
    ...params
  }

  // Object.assign(updatedPost, post);
  // Object.assign(updatedPost, params);

  posts = posts.map(x => x.id === updatedPost.id ? updatedPost : x);
  fs.writeFile('./masterdata/posts.json', JSON.stringify(posts), (err) => {
    if (err) {
      res.status(4040).json({
        message: "Something wrong when post the data"
      })
    }
    res.status(200).json({
      message: `Post has been inserted Successfully | ${req.params.id}`
    })
  })
})

app.delete('/api/posts/:id', (req, res) => {
  posts = posts.filter((x) => x.id !== parseInt(req.params.id, 10));
  fs.writeFile('./masterdata/posts.json', JSON.stringify(posts), (err) => {
    if (err) {
      res.status(4040).json({
        message: "Something wrong when post the data"
      })
    }
    res.status(200).json(
      {
        message: `Post has been successfully deleted | ${req.params.id}`
      }
    )
  })
})

// Start Server
app.listen(PORT, () => {
  console.log(`Server Listening in port ${PORT} (http://localhost:${PORT}/api/posts)`)
})
