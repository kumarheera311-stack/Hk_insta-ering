````markdown
# HK Insta-ering 🎬📸💰

An Instagram-like social media platform where users can upload videos and photos to earn money!

## Features ✨

- 📹 **Video Upload** - Earn ₹10 per video upload
- 📸 **Photo Upload** - Earn ₹5 per photo upload
- 👥 **Social Features** - Like, comment, share, follow/unfollow
- 💬 **Messaging** - Real-time messaging using Socket.IO
- 💸 **Monetization** - Track earnings and request withdrawals
- 🏦 **Payment Integration** - Razorpay integration for withdrawal
- 📊 **Dashboard** - View earnings statistics
- 🎨 **Modern UI** - Built with Material-UI

## Tech Stack 🛠️

### Backend
- **Node.js & Express** - Server framework
- **MongoDB** - Database
- **Cloudinary** - Image/Video hosting
- **Socket.IO** - Real-time communication
- **Razorpay** - Payment gateway
- **JWT** - Authentication

### Frontend
- **React 18** - UI library
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates

## Installation 📦

### Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account
- Razorpay account

### Backend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your configurations in .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hk_insta_ering
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd client
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start React app
npm start
```

## API Endpoints 🔗

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `POST /api/posts/upload` - Upload video/photo
- `GET /api/posts/feed` - Get feed
- `PUT /api/posts/:postId/like` - Like/unlike post
- `POST /api/posts/:postId/comment` - Add comment

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile/update` - Update profile
- `PUT /api/users/:userId/follow` - Follow/unfollow user
- `GET /api/users/earnings/my-earnings` - Get earnings

### Payment
- `POST /api/payment/withdrawal/request` - Request withdrawal
- `GET /api/payment/wallet/balance` - Check balance
- `GET /api/payment/transactions/history` - Get transaction history

## Database Models 📋

### User
```javascript
{
  username: String,
  email: String,
  password: String,
  fullName: String,
  bio: String,
  avatar: String,
  followers: [ObjectId],
  following: [ObjectId],
  earnings: {
    totalEarnings: Number,
    videoEarnings: Number,
    photoEarnings: Number,
    totalVideos: Number,
    totalPhotos: Number
  },
  walletBalance: Number,
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String
  }
}
```

### Post
```javascript
{
  userId: ObjectId,
  content: String,
  media: {
    type: String (video/photo),
    url: String,
    publicId: String,
    duration: Number
  },
  earnings: {
    videoAmount: 10,
    photoAmount: 5,
    totalEarned: Number
  },
  likes: [ObjectId],
  comments: [{userId, text, createdAt}],
  shares: Number,
  views: Number,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage 🚀

1. **Register/Login** - Create your account
2. **Upload Content** - Upload videos (₹10) or photos (₹5)
3. **Interact** - Like, comment, and follow other users
4. **Earn Money** - Check your wallet balance
5. **Withdraw** - Request withdrawal (minimum ₹100)

## Earning System 💰

- **Video Upload**: ₹10 per video
- **Photo Upload**: ₹5 per photo
- **Minimum Withdrawal**: ₹100
- **Processing Time**: 24 hours

## Real-time Features 🔔

- Live notifications for likes, comments, and follows
- Real-time messaging between users
- Live feed updates

## Future Enhancements 🎯

- [ ] Stories feature
- [ ] Live streaming
- [ ] Video effects and filters
- [ ] Hashtags and trending
- [ ] Search functionality
- [ ] Notifications history
- [ ] User recommendations
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## Security 🔒

- Password hashing with bcryptjs
- JWT authentication
- Input validation
- CORS protection
- Secure file uploads

## Contributing 🤝

Contributions are welcome! Please create a pull request with your changes.

## License 📜

MIT License - feel free to use this project!

## Support 💬

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ by kumarheera311-stack**

Happy coding and earning! 🎉
````
