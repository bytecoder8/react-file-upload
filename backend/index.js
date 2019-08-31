const fs = require('fs')
const path = require('path')
const express = require('express')
const fileUpload = require('express-fileupload')

const app = express();
const uploadsDir = __dirname + '/client/public/uploads/'

app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded.'} )
    }

    // Don't upload files with __version !
    const { file } = req.files;
    const ext = path.extname(file)
    const name = path.parse(file).name // without extension

    let filePath = uploadsDir + file.name
    fs.access(filePath, fs.constants.F_OK, err => {
        if (!err) {
            const lastFileVer = parseInteger(name.match(/__(\d+)$/, 10))
            let newName = ''
            if (isNaN(lastFileVer)) {
                newName = name + '__1'
            } else {
                newName = name.replace(/__\d+$/, `__${lastFileVer + 1}`)
            }
            const newFilePath = uploadsDir + newName

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
        }
    })
    
})

app.listen(3030, () => console.log('Server started...'))
