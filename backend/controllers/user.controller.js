require('dotenv').config();
const mongoose = require('mongoose');
const { User, Post, Comment, Like  } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer().array('images[]', 3); // Allow up to 3 images

// Get secret key from environment
const SECRET_KEY = process.env.SECRET_KEY;

// Initialize GridFS
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

// API: Get all Users
const getUsers = async(req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API: Get User based on username
const getUser = async(req, res) => {
  try {
    const { username } = req.params;  // Get username from request parameters

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);  // Return the found user

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async(req, res) => {
  try {
    const { username, password } = req.body;

    // Verify if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Record the user's registration timestamp
    const loginTime = new Date();

    // Create a new user record
    const newUser = await User.create({ username, password, nickname: username });

    // Assign the default profile image
    const defaultProfilePicture = path.join(__dirname, '../images/my-icon.png');
    const uploadStream = gfs.openUploadStream('default-profile-picture', {
      contentType: 'image/png'
    });

    // Transfer the default profile image to GridFS
    const readStream = fs.createReadStream(defaultProfilePicture);
    readStream.pipe(uploadStream);

    // Handle the completion of the image upload
    uploadStream.on('finish', async() => {
      // Link the uploaded image to the user's profile
      newUser.profilePicture = uploadStream.id;
      await newUser.save();

      // Create a JWT token for the user
      const token = jwt.sign({
        id: newUser._id,
        username: newUser.username,
        loginTime: loginTime.toISOString() // Include login time in token payload
      }, SECRET_KEY, {
        expiresIn: '2h' // Token expiration time
      });

      res.status(200).json({ message: 'Register successful', token, newUser });
    });

    // Handle any errors during the image upload
    uploadStream.on('error', (error) => {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ message: 'Error uploading profile picture' });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async(req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = user.password === password; // Modify if using hashed passwords
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Record the login timestamp
    const loginTime = new Date();

    // Create a JWT token for the user
    const token = jwt.sign({
      id: user._id,
      username: user.username,
      loginTime: loginTime.toISOString() // Include login time in token payload
    }, SECRET_KEY, {
      expiresIn: '2h' // Token expiration time
    });

    // Respond with success
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async(req, res) => {
  try {
    const { username, password } = req.body;  // Assuming username and password are in the request body

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches the user's existing password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // If the username and password are correct, proceed to update the user
    // Update user info based on the request body (excluding username and password)
    const updatedUser = await User.findOneAndUpdate({ username }, req.body, { new: true });

    res.status(200).json(updatedUser); // Return the updated user
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API: delete a user based on username after verifying password
const deleteUser = async(req, res) => {
  try {
    const { username, password } = req.body;  // Get username and password from request body

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches the user's existing password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // If the username and password are correct, proceed to delete the user
    await User.findOneAndDelete({ username });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API: Edit User's nickname
const editNickname = async(req, res) => {
  try {
    const { username, nickname } = req.body;  // Assuming username and nickname are in the request body
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Update the user's nickname
    user.nickname = nickname;
    await user.save();
    res.status(200).json({ message: 'Nickname updated successfully', user });
    // console.log(nickname);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API: Get User's nickname
const getNickname = async(req, res) => {
  try {
    const { username } = req.params; // Assuming username is passed as a URL parameter

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ nickname: user.nickname });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload profile picture
const uploadProfilePicture = async(req, res) => {
  try {
    const { username } = req.body;
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile picture if it exists
    if (user.profilePicture) {
      try {
        await gfs.delete(new mongoose.Types.ObjectId(user.profilePicture));
      } catch (error) {
        console.log('Error deleting old profile picture:', error);
      }
    }

    // Create upload stream
    const uploadStream = gfs.openUploadStream(username + '-profile-picture', {
      contentType: req.file.mimetype
    });

    // Write file to GridFS
    uploadStream.end(req.file.buffer);

    // Update user's profilePicture field with the new file ID
    user.profilePicture = uploadStream.id;
    await user.save();

    res.status(200).json({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get profile picture
const getProfilePicture = async(req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    // Create download stream
    const downloadStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(user.profilePicture));

    // Set the proper content type
    res.set('Content-Type', 'image/jpeg');

    // Pipe the file to the response
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveRunRecord = async(req, res) => {
  try {
    const { username, runRecord } = req.body;

    // Find and update atomically to prevent race conditions
    const user = await User.findOneAndUpdate(
      { username },
      { $inc: { lastRunId: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new record with the incremented ID
    const newRecord = {
      ...runRecord,
      runId: user.lastRunId,
      timestamp: new Date()
    };

    // Add to records array and clear current run data
    await User.findOneAndUpdate(
      { username },
      {
        $push: { record: newRecord },
        $set: { data: {} }
      }
    );

    res.status(200).json({
      message: 'Run record saved successfully',
      record: newRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get specific run record by ID
const getRunRecordById = async(req, res) => {
  try {
    const { username } = req.params;
    const recordId = parseInt(req.params.recordId);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const record = user.record.find(r => r.runId === recordId);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to check the token
const tokenCheck = async(req, res) => {
  try {
    const token = req.headers['authorization']; // Assume token is in the authorization header
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Remove 'Bearer ' prefix from token (if present)
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verify the token
    jwt.verify(cleanToken, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token is invalid or has expired' });
      }

      // Token is valid, additional logic can be added here, e.g., returning user info
      res.status(200).json({ message: 'Token is valid', decoded });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all run records
const getRunRecords = async(req, res) => {
  try {
    const { username } = req.params;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all records
    const records = user.record;

    res.status(200).json({
      records,
      pagination: {
        total: records.length,
        page: 1,
        pages: 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload current run data
const updateRunData = async(req, res) => {
  try {
    const { username, runData } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's current run data
    user.data = {
      ...user.data,
      ...runData
    };

    await user.save();
    res.status(200).json({ message: 'Run data updated successfully', data: user.data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current run data
const getCurrentRunData = async(req, res) => {
  try {
    const { username } = req.params;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update run record
const updateRunRecord = async(req, res) => {
  try {
    const { username } = req.params;
    const recordId = parseInt(req.params.recordId);
    const updateData = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recordIndex = user.record.findIndex(r => r.runId === recordId);
    if (recordIndex === -1) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Update the record while preserving the ID
    user.record[recordIndex] = {
      ...updateData,
      runId: recordId  // Preserve the original ID
    };

    await user.save();

    res.status(200).json({
      message: 'Record updated successfully',
      record: user.record[recordIndex]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete run record
const deleteRunRecord = async(req, res) => {
  try {
    const { username } = req.params;
    const recordId = parseInt(req.params.recordId);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recordIndex = user.record.findIndex(r => r.runId === recordId);
    if (recordIndex === -1) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Remove the record
    user.record.splice(recordIndex, 1);

    // Reindex remaining records
    user.record = user.record.map((record, index) => ({
      ...record,
      runId: index + 1
    }));

    await user.save();

    res.status(200).json({
      message: 'Record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const activeUploads = new Map();
const uploadPromises = new Map();

const createPost = async(req, res) => {
  try {
    const { title, content, username } = req.body;
    console.log('Received request with:', {
      title,
      content,
      username,
      hasFiles: req.files && req.files.length > 0,
      filesCount: req.files?.length,
      timestamp: new Date()
    });

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a unique key for this post
    const postKey = `${username}-${title}-${content}`;

    // If there's an ongoing upload for this post, wait for it
    if (uploadPromises.has(postKey)) {
      console.log('Adding images to existing post...');
      const existingPost = await uploadPromises.get(postKey);

      if (existingPost && req.files && req.files.length > 0) {
        // Get the current post from the database to ensure we have the latest version
        const currentPost = await Post.findById(existingPost._id);

        // Add new images
        const newImageIds = [];
        for (const file of req.files) {
          const uploadStream = gfs.openUploadStream(username + '-post-image-' + Date.now(), {
            contentType: file.mimetype
          });
          uploadStream.end(file.buffer);
          newImageIds.push(uploadStream.id);
        }

        // Update using findOneAndUpdate to avoid parallel save issues
        const updatedPost = await Post.findOneAndUpdate(
          { _id: existingPost._id },
          { $push: { images: { $each: newImageIds } } },
          { new: true }
        );

        console.log('Added new images. Total images:', updatedPost.images.length);
        return res.status(200).json({ message: 'Image added to existing post', post: updatedPost });
      }
    }

    // Create a new promise for this upload
    const uploadPromise = new Promise(async(resolve) => {
      const imageIds = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uploadStream = gfs.openUploadStream(username + '-post-image-' + Date.now(), {
            contentType: file.mimetype
          });
          uploadStream.end(file.buffer);
          imageIds.push(uploadStream.id);
        }
        console.log('Created new post with images:', imageIds.length);
      }

      const newPost = new Post({
        title,
        content,
        author: user._id,
        images: imageIds
      });

      await newPost.save();
      user.posts.push(newPost._id);
      await user.save();
      resolve(newPost);
    });

    // Store the promise
    uploadPromises.set(postKey, uploadPromise);

    // Clean up after 5 seconds
    setTimeout(() => {
      uploadPromises.delete(postKey);
    }, 5000);

    // Wait for this upload to complete
    const post = await uploadPromise;
    return res.status(200).json({ message: 'Post created successfully', post: post });

  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ message: error.message });
  }
};

// In user.controller.js
const uploadPostImage = async(req, res) => {
  try {
    const { username } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadStream = gfs.openUploadStream(username + '-post-image-' + Date.now(), {
      contentType: req.file.mimetype
    });
    uploadStream.end(req.file.buffer);

    return res.json({ imageId: uploadStream.id });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get post image
const getPostImage = async(req, res) => {
  try {
    const imageId = req.params.imageId;
    // Create download stream from GridFS
    const downloadStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(imageId));

    // Set the proper content type
    res.set('Content-Type', 'image/jpeg');  // Adjust content type if needed

    // Pipe the file to the response
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to retrieve all posts
const getPosts = async(req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'nickname') // Populate author's nickname
      .populate({
        path: 'comments', // Populate comments
        populate: {
          path: 'author', // Populate comment authors
          select: 'nickname'
        }
      });

    // If no posts are found, return a 404 status
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    // Return all posts
    res.status(200).json({ message: 'Posts retrieved successfully', posts });
  } catch (error) {
    // If an error occurs, return a 500 status with the error message
    res.status(500).json({ message: error.message });
  }
};
const getPostById = async(req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findOne({ postId: parseInt(postId, 10) })
      .populate('author', 'nickname')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'nickname'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post retrieved successfully', post });
  } catch (error) {
    console.error('Error in getPostById:', error);
    res.status(500).json({ 
      message: 'Error retrieving post',
      error: error.message
    });
  }
};

// Function to retrieve posts by a specific username
const getPostByUsername = async(req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found, return a 404 status
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all posts by the user and populate author's nickname and comments with their authors' nicknames
    const posts = await Post.find({ author: user._id })
      .populate('author', 'nickname') // Populate author's nickname
      .populate({
        path: 'comments', // Populate comments
        populate: {
          path: 'author', // Populate comment authors
          select: 'nickname'
        }
      });

    // Return the list of posts
    res.status(200).json(posts);
  } catch (error) {
    // If an error occurs, return a 500 status with the error message
    res.status(500).json({ message: error.message });
  }
};

// Function to update a post by its ID
const updatePost = async(req, res) => {
  try {
    // Retrieve postId from request parameters
    const postId = req.params.postId;

    // Retrieve update data from request body
    const { title, content } = req.body;

    // Find the post in the database
    const post = await Post.findOne({ _id: postId });

    // If post not found, return a 404 status with an error message
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update post fields
    post.title = title;
    post.content = content;

    // Clear current images of the post
    if (post.images && post.images.length > 0) {
      for (const imageId of post.images) {
        await gfs.delete(imageId);
      }
    }

    // Handle uploaded images
    const imageIds = [];
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

      for (const file of files) {
        // Create upload stream and get file ID
        const uploadStream = gfs.openUploadStream(username + '-post-image-' + Date.now(), {
          contentType: file.mimetype
        });

        // Write file buffer to upload stream
        uploadStream.end(file.buffer);

        // Add file ID to the array
        imageIds.push(uploadStream.id);
      }
    }

    // Update the post's images array
    post.images = imageIds;

    // Update the post's last update timestamp
    post.updateData = Date.now();

    // Save the updated post to the database
    await post.save();

    // Return the updated post
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    // If an error occurs, return a 500 status with the error message
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a post by its ID
const deletePost = async(req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId });

    // If post not found, return 404 with error message
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ _id: { $in: post.comments } });

    const authorId = post.author;

    // Remove the post ID from the author's posts array
    await User.updateOne(
      { _id: authorId },
      { $pull: { posts: post._id } }
    );

    // If the post has images, delete them from GridFS
    if (post.images && post.images.length > 0) {
      post.images.forEach(async(imageId) => {
        // Delete each image from GridFS
        await gfs.delete(imageId);
      });
    }

    // Delete the post from the database
    await Post.deleteOne({ _id: post._id });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async(req, res) => {
  try {
    const postId = req.params.postId;
    const { content, username } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Updated to find post by postId instead of _id
    const post = await Post.findOne({ postId: parseInt(postId, 10) });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.commentCount += 1;

    const newComment = new Comment({
      content,
      author: user._id,
      post: post._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();

    res.status(200).json({
      message: 'Comment created successfully',
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to retrieve comments by postId
const getCommentsByPostId = async(req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by postId and populate the comments
    const post = await Post.findOne({ _id: postId }).populate('comments');

    // If post not found, return 404 with error message
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Return the comments of the post
    res.status(200).json(post.comments);
  } catch (error) {
    // If an error occurs, return 500 with error message
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a comment by its ID
const deleteComment = async(req, res) => {
  try {
    // Extract commentId from request parameters
    const { commentId } = req.params;

    // Find and delete the comment with the specified commentId
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId });

    // If the comment is not found, return a 404 error
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Remove the reference to the deleted comment from the post
    await Post.updateOne(
      { _id: deletedComment.postId },
      {
        $pull: { comments: deletedComment._id },
        $inc: { commentCount: -1 }
      }
    );

    // Return a success message with the deleted comment
    res.status(200).json({ message: 'Comment deleted successfully', comment: deletedComment });
  } catch (error) {
    // If an error occurs, return a 500 status with the error message
    res.status(500).json({ message: error.message });
  }
};

// Function to like a post by its ID
const likePost = async(req, res) => {
  try {
    const postId = req.params.postId;
    const { username } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Updated to find post by postId instead of _id
    const post = await Post.findOne({ postId: parseInt(postId, 10) });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = await Like.findOne({ user: user._id, post: post._id });
    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked by user' });
    }

    const newLike = new Like({ user: user._id, post: post._id });
    await newLike.save();

    post.likes += 1;
    await post.save();

    res.status(200).json({ message: 'Post liked successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to unlike a post by its ID
const unlikePost = async(req, res) => {
  try {
    const postId = req.params.postId;
    const { username } = req.body;

    // Find the user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the post by postId
    const post = await Post.findOne({ postId: parseInt(postId, 10) });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find and delete the like record for the post by the user
    const like = await Like.findOneAndDelete({ user: user._id, post: post._id });
    if (!like) {
      return res.status(400).json({ message: 'Post not liked by user' });
    }

    // Decrement the like count on the post
    post.likes -= 1;
    await post.save();

    res.status(200).json({ message: 'Post unliked successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkIfLikedPost = async(req, res) => {
  try {
    const postId = req.params.postId;
    const { username } = req.body;

    // Find user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find post by postId
    const post = await Post.findOne({ postId: postId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has liked the post
    const existingLike = await Like.findOne({ user: user._id, post: post._id });
    if (existingLike) {
      return res.status(200).json({ message: 'Post liked by user', liked: true });
    } else {
      return res.status(200).json({ message: 'Post not liked by user', liked: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likeComment = async(req, res) => {
  try {
    const commentId = req.params.commentId;

    // Find the comment by commentId and increment the likes count
    const comment = await Comment.findOneAndUpdate(
      { commentId: commentId }, // 查询条件，使用 MongoDB 默认的 _id 字段
      { $inc: { likes: 1 } }, // 使用$inc 操作符来增加 likes 字段的值
      { new: true, useFindAndModify: false } // 返回更新后的文档，不使用过时的 findAndModify
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment liked successfully', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unlikeComment = async(req, res) => {
  try {
    const commentId = req.params.commentId;

    // Find the comment by commentId and decrement the likes count
    const comment = await Comment.findOneAndUpdate(
      { commentId: commentId },
      { $inc: { likes: -1 } }, // Decrement the likes field by 1
      { new: true, useFindAndModify: false }
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment unliked successfully', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all users
const deleteAllUsers = async(req, res) => {
  try {
    // Delete all users
    await User.deleteMany({});

    // Delete all associated profile pictures from GridFS
    const files = await gfs.find({}).toArray();
    for (const file of files) {
      if (file.filename.includes('profile-picture')) {
        await gfs.delete(file._id);
      }
    }

    res.status(200).json({
      success: true,
      message: 'All users and their profile pictures have been deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteAllUsers:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete all posts
const deleteAllPosts = async(req, res) => {
  try {
    // Get all posts to delete their images
    const posts = await Post.find({});

    // Delete all post images from GridFS
    for (const post of posts) {
      if (post.images && post.images.length > 0) {
        for (const imageId of post.images) {
          try {
            await gfs.delete(new mongoose.Types.ObjectId(imageId));
          } catch (error) {
            console.error(`Error deleting image ${imageId}:`, error);
          }
        }
      }
    }

    // Delete all comments associated with posts
    await Comment.deleteMany({});

    // Delete all likes associated with posts
    await Like.deleteMany({});

    // Delete all posts
    await Post.deleteMany({});

    // Update all users to remove post references
    await User.updateMany({}, { $set: { posts: [] } });

    res.status(200).json({
      success: true,
      message: 'All posts, associated images, comments, and likes have been deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteAllPosts:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add to user.controller.js

const updateUserPreferences = async(req, res) => {
  try {
    const { username } = req.params;
    const { theme, notifications, language } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Validate theme
    const validThemes = ['light', 'dark', 'system'];
    if (theme && !validThemes.includes(theme)) {
      return res.status(400).json({ success: false, message: 'Invalid theme' });
    }

    // Validate language
    const validLanguages = ['en', 'es', 'fr', 'zh'];
    if (language && !validLanguages.includes(language)) {
      return res.status(400).json({ success: false, message: 'Invalid language' });
    }

    user.preferences = {
      ...user.preferences,
      theme: theme || user.preferences?.theme || 'system',
      notifications: notifications !== undefined ? notifications : user.preferences?.notifications || true,
      language: language || user.preferences?.language || 'en'
    };

    await user.save();
    res.status(200).json({ success: true, preferences: user.preferences });

  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserPreferences = async(req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      preferences: user.preferences || {
        theme: 'system',
        notifications: true,
        language: 'en'
      }
    });

  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  // User profile
  getUsers,
  getUser, // deprecated
  registerUser,
  loginUser,
  updateUser, // deprecated
  deleteUser,
  tokenCheck,
  editNickname,
  getNickname,
  deleteAllUsers,

  updateUserPreferences,
  getUserPreferences,

  uploadProfilePicture, // Upload user's profile picture
  getProfilePicture, // Retrieve user's profile picture

  // Run data management
  updateRunData, // updating CURRENT run data
  getCurrentRunData, // getting CURRENT run data
  saveRunRecord, // saving into run list
  getRunRecordById, // getting specific run record
  updateRunRecord, // updating run data
  deleteRunRecord, // deleting individual run record
  getRunRecords, // get all run records

  // Forum actions
  createPost,
  uploadPostImage, // Upload an image for a post
  getPostImage, // Get an image associated with a post
  getPosts,
  getPostById,
  getPostByUsername, // Get posts by a user's username
  updatePost,
  deletePost,
  deleteAllPosts,

  createComment,
  getCommentsByPostId,
  deleteComment,

  likePost,
  unlikePost,
  checkIfLikedPost,
  likeComment,
  unlikeComment
};
