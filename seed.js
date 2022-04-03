const mongoose = require('mongoose');
const Courses = require('./data/courses');

mongoose.connect('mongodb://localhost:27017/WebCSKT', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const seedCourses = [
    {
        duration: '44',
        section: '57',
        title: 'Truyền thông và Mạng máy tính',
        price: '0',
        image: "uploads/tt_va_mmt.png",
        video: "https://www.youtube.com/embed/videoseries?list=PLTb4KXKc98BYo88l-glRlPZBTvkc3Vvzg",
        category: 'Kiến thức cơ sở',
        authors: '617102b938269c5f6f943297'
    },
    {
        duration: '50',
        section: '60',
        title: 'Phần mềm máy tính',
        price: '0',
        image: "uploads/phanmem_mt.png",
        video: "https://www.youtube.com/embed/sO8eGL6SFsA",
        category: 'Kiến thức cơ sở',
        authors: '617102b938269c5f6f943297'
    },
    {
        duration: '12',
        section: '33',
        title: 'Phần cứng máy tính',
        price: '0',
        image: "uploads/phancung_mt.png",
        video: "https://www.youtube.com/embed/2eLe7uz-7CM",
        category: 'Kiến thức cơ sở',
        authors: '617102b938269c5f6f943297'
    },
    {
        duration: '21',
        section: '40',
        title: 'C cho người mới bắt đầu',
        price: '0',
        image: "uploads/C.jpg",
        video: "https://www.youtube.com/embed/videoseries?list=PLBlnK6fEyqRggZZgYpPMUxdY1CYkZtARR",
        language: "c",
        category: 'Lập trình cơ sở',
        authors: '617102b938269c5f6f943297'
    },
    {
        duration: '21',
        section: '37',
        title: 'C++ cho người mới bắt đầu',
        price: '0',
        image: "uploads/C++_beginners.jpg",
        video: "https://www.youtube.com/embed/vLnPwxZdW4Y",
        language: "c",
        category: 'Lập trình cơ sở',
        authors: '617102b938269c5f6f943297'
    },
    {
        duration: '10',
        section: '14',
        title: 'Làm quen với SQL',
        price: '0',
        image: "uploads/sql_intro.jpg",
        video: "https://www.youtube.com/embed/HXV3zeQKqGY",
        language: "sql",
        category: 'Lập trình cơ sở',
        authors: '617102b938269c5f6f943297'
    },
    {
        duration: '17',
        section: '27',
        title: 'JavaScript cơ bản',
        price: '0',
        image: "uploads/jvscript_basics.jpg",
        video: "https://www.youtube.com/embed/eIrMbAQSU34",
        language: "java",
        category: 'Lập trình cơ sở',
        authors: '617102b938269c5f6f943297'
    },
    {
        duration: '25',
        section: '30',
        title: 'Python cơ bản',
        price: '0',
        image: "uploads/python.jpg",
        video: "https://www.youtube.com/embed/videoseries?list=UU8butISFwT-Wl7EV0hUK0BQ",
        language: "python",
        category: 'Lập trình cơ sở',
        authors: '617102b938269c5f6f943297'
    },
    {
        duration: '30',
        section: '38',
        title: 'C# cơ bản',
        price: '0',
        image: "uploads/C_hash_basic.jpg",
        video: "https://www.youtube.com/embed/GhQdlIFylQ8",
        language: "c",
        category: 'Lập trình cơ sở',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '44',
        section: '60',
        title: 'Java cơ bản',
        price: '0',
        image: "uploads/java_basics.jpg",
        video: "https://www.youtube.com/embed/RRubcjpTkks",
        language: "java",
        category: 'Lập trình cơ sở',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '26',
        section: '33',
        title: 'Lập trình hướng đối tượng C++',
        price: '0',
        image: "uploads/C++.jpg",
        video: "https://www.youtube.com/embed/wN0x9eZLix4",
        language: "c",
        category: 'Lập trình nâng cao',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '10',
        section: '17',
        title: 'Thực hành với SQL',
        price: '0',
        image: "uploads/sql_working.jpg",
        video: "https://www.youtube.com/embed/kbKty5ZVKMY",
        language: "sql",
        category: 'Lập trình nâng cao',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '18',
        section: '26',
        title: 'Cấu trúc dữ liệu và giải thuật',
        price: '0',
        image: "uploads/data_structure.jpg",
        video: "https://www.youtube.com/embed/RBSGKlAvoiM",
        language: "c",
        category: 'Lập trình nâng cao',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '27',
        section: '37',
        title: 'Lập trình hướng đối tượng trong Java',
        price: '0',
        image: "uploads/java_OOP.jpg",
        video: "https://www.youtube.com/videoseries?list=PL33lvabfss1yGrOutFR03OZoqm91TSsvs",
        language: "java",
        category: 'Lập trình nâng cao',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '38',
        section: '48',
        title: 'C++ nâng cao',
        price: '0',
        image: "uploads/C++_advance.jpg",
        video: "https://www.youtube.com/embed/mUQZ1qmKlLY",
        language: "c",
        category: 'Lập trình nâng cao',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '33',
        section: '40',
        title: 'Thuật toán nâng cao',
        price: '0',
        image: "uploads/algorithm_advance.jpg",
        video: "https://www.youtube.com/embed/1Pdd37syf4E",
        language:  "python",
        category: 'Giải quyết vấn đề',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '22',
        section: '27',
        title: 'Thuật toán căn bản',
        price: '0',
        image: "uploads/algorithm_basic.jpg",
        video: "https://www.youtube.com/embed/nJA_NwVr5Ao",
        language: "python",
        category: 'Giải quyết vấn đề',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '8',
        section: '18',
        title: 'Thư viện chuẩn C++',
        price: '0',
        image: "uploads/C++_library.jpg",
        video: "https://www.youtube.com/embed/XCCW4tHydEo",
        language: "c",
        category: 'Giải quyết vấn đề',
        authors: '617102b838269c5f6f943295'
    },
    {
        duration: '14',
        section: '20',
        title: 'Điện toán đám mây',
        price: '0',
        image: "uploads/cloud_esentials.jpg",
        video: "https://www.youtube.com/embed/DGDtujmOBKc",
        category: 'Kỹ năng nâng cao',
        authors: '617102b838269c5f6f943295'
    },
]

Courses.insertMany(seedCourses)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})
