const mongoose = require('mongoose');
const News = require('./data/news');

mongoose.connect('mongodb://localhost:27017/WebCSKT', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const seedNews = [
    {
        title: "iPhone 13 sẽ không còn tuỳ chọn 64GB, bản Pro và Pro Max có bộ nhớ trong lên tới 1TB",
        image: "https://genk.mediacdn.vn/thumb_w/660/139269124445442048/2021/9/13/photo-1-1631488187952925878697.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    },
    {
        title: "Tất tần tật về NFT, trào lưu mới dựa trên công nghệ blockchain (Phần 1)",
        image: "https://genk.mediacdn.vn/thumb_w/660/139269124445442048/2021/9/11/3f27d35211c8342eced47e25e77f0e237d49de36095671ea537e22f285704034-1631338489559523747740.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    },
    {
        title: "Thiết bị hỗ trợ học tập online, làm việc, họp trực tuyến",
        image: "https://genk.mediacdn.vn/thumb_w/800/pr/2021/0anhdaidien-1-1631265534539974365668-1631265536221-0-0-375-600-crop-1631265543508-63767132980175.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    },
    {
        title: "Suy nghĩ quá nhanh gây đứt gãy DNA trong não bộ, hậu quả của nó là gì?",
        image: "https://genk.mediacdn.vn/thumb_w/660/139269124445442048/2021/9/10/photo-1-1631209647252578719939.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    },
]

News.insertMany(seedNews)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})
