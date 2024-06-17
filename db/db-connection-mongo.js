const mongoose = require('mongoose');
const getConnection = async () => {
    try {

        const url = "mongodb+srv://admin:1234@cluster0.vst6g9a.mongodb.net/db-2024?retryWrites=true&w=majority&appName=Cluster0"

        await mongoose.connect(url)

        console.log("conexion exitosa")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getConnection
}