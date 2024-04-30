var express = require('express'); // 引入 express
var router = express.Router();  // 使用 express 的 Router

const Post = require("../models/postsModel"); // 引入 postsModel 模組 schema
const User = require("../models/usersModel"); // 引入 usersModel 模組 schema

const handleSuccess = require('../handleSuccess');
const handleError = require('../handleError');

router.get('/', async function (req, res, next) {
  // const post = await Post.find().populate("user") // 關聯 user 資料;

  // 貼文關鍵字搜尋與篩選
  const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"
  const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};

  // 關聯 user 資料
  const post = await Post.find(q).populate({
    path: 'user',
    select: 'name photo'
  }).sort(timeSort);
  
  // asc 遞增(由小到大，由舊到新) createdAt ; 
  // desc 遞減(由大到小、由新到舊) "-createdAt"

  handleSuccess(res, post);

});

router.post('/', async function (req, res, next) {
  try {
    const { body } = req;
    if (body.content !== undefined) {
      const newPost = await Post.create(
        {
          user: body.user,
          content: body.content.trim(),
          photo: body.photo,
        }
      );
      handleSuccess(res, newPost);

    } else {
      handleError(res);
    }
  } catch (err) {
    handleError(res, err);
  }
});

// router.delete 刪除單筆
router.delete('/:id', async function (req, res, next) {
  const postId = await Post.findByIdAndDelete(req.params.id);
  try {
    handleSuccess(res, null);
  } catch (err) {
    handleError(res, err);
  }
});

// router.delete 刪除全部
router.delete('/', async function (req, res, next) {
  await Post.deleteMany({});
  handleSuccess(res, null);
});

// router.patch 修改單筆
router.patch('/:id', async function (req, res, next) {
  try {
    const { body } = req;

    const id = req.params.id

    if (id !== undefined && body.content !== undefined) {
      const post = await Post.findByIdAndUpdate(id,
        {
          name: body.name,
          content: body.content,
          photo: body.photo
        },
        {
          new: true,
          runValidators: true
        }
      );
      handleSuccess(res, post);
    } else {
      handleError(res);
    }
  } catch (err) {
    handleError(res, err);
  }
}
);

// router options
router.options('/', async function (req, res, next) {
  res.status(200).send({
    status: "success",
    message: "options"
  })
});

// router 404
router.all('*', async function (req, res, next) {
  res.status(404).send({
    status: "fail",
    message: "無此網站路由"
  })
});

module.exports = router;
