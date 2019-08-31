import React, { useState } from 'react'

const FileUpload = () => {
    const [ file, setFile ] = useState('')
    const [ fileName, setFileName ] = useState('Choose File')

    const onFileChange = e => {
        const file = e.target.files[0]
        setFile(file)
        setFileName(file.name)
    }

    const onFormSubmit = e => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('file', file)

        const req = new XMLHttpRequest()
        req.open("POST", "/upload", true)
        req.onload = e => {
            if (req.status === 200) {
                console.log('File uploaded')
            } else {
                console.log("Error", req.status)
            }
        }
        req.send(formData)
    }

    return(
        <>
            <form onSubmit={onFormSubmit} encType="multipart/form-data" method="post">
                <input type="file" onChange={onFileChange} />
                <label htmlFor="file">
                    { fileName }
                </label>
                <input type="submit" value="Upload" />
            </form>
        </>
    )
}

export default FileUpload
