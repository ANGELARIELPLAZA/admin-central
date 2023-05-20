import mongoose from 'mongoose'
const url = 'mongodb://admin:TghTvhROx1cH5@192.168.0.102:27017/'
mongoose.connect(url)

const db = mongoose.connection
db.on('open', ()=>{ console.log("¡Conectado a MongoDB!")} )
db.on('error', ()=>{ console.log("¡Error al conectar a MongoDB!")} )

export default db