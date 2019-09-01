const fs = require('fs')
const path = require('path')
const express = require('express')
const fileUpload = require('express-fileupload')

const app = express();
const uploadsDir = __dirname + '/../client/public/uploads/'

app.use(fileUpload())

app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded.'} )
    }

    // Don't upload files with __version !
    const { file } = req.files;
    const ext = path.extname(file.name)
    const name = path.parse(file.name).name // without extension

    let filePath = uploadsDir + file.name
    fs.access(filePath, fs.constants.F_OK, err => {
        let newName = name
        if (!err) {
            const lastFileVer = parseInt(name.match(/__(\d+)$/, 10))
            
            if (isNaN(lastFileVer)) {
                newName = name + '__1'
            } else {
                newName = name.replace(/__\d+$/, `__${lastFileVer + 1}`)
            }
        }
        const newFilePath = uploadsDir + newName + ext
        file.mv(newFilePath, err => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            res.json({
                fileName: newName + ext,
                filePath: `/uploads/${file.name}`
            })
        })
    })
})

app.listen(3030, () => console.log('Server started...'))
