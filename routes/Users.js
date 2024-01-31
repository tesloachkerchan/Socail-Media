const express = require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcrypt')
//update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }
         try {
                const user = await User.findByIdAndUpdate(req.body.userId, {
                    $set: req.body,
                });
                res.status(200).json('account has been updated')
            } catch (error) {
                return res.status(500).json(error)
            }
    } else {
        res.status(403).json('you can only update your profile')
    }
})
//delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
         try {
                await User.findByIdAndDelete(req.body.userId)
                res.status(200).json('account has been deleted')
            } catch (error) {
                return res.status(500).json(error)
            }
    } else {
        res.status(403).json('you can only delete your profile')
    }
})
//get user
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const userName = req.query.userName;
    try {
        const user = userId ?
            await User.findById(userId) : 
            await User.findOne({userName: userName})
        const { password, updateAt,isAdmin, ...other } = user._doc;
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})
//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, userName, profilePicture } = friend;
      friendList.push({ _id, userName, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});
//follow user
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).json('user has been follow')
            } else {
                res.status(403).json('you already follow!')
            }
        } catch (error) {
        res.status(500).json(error)
        }
    }
})
//unfollow user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json('user unfollow')
            } else {
                res.status(403).json('you don not follow!')
            }
        } catch (error) {
        res.status(500).json('you should not unfollow your self')
        }
    }
})
module.exports = router