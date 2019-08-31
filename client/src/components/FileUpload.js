import React, { useState } from 'react'
import Message from './Message'
import Progress from './Progress'

const FileUpload = () => {
    const [ isUploading, setIsUploading ] = useState(false)
    const [ file, setFile ] = useState('')
    const [ fileName, setFileName ] = useState('Choose File')
    const [ uploadedFile, setUploadedFile ] = useState(null)
    const [ message, setMessage ] = useState('')
    const [ percentUploaded, setPercentUploaded ] = useState(0)

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
                try {
                    setUploadedFile(JSON.parse(req.responseText))
                    setMessage('File Uploaded.')
                } catch (err) {
                    console.log(err)
                }
            } else if (req.status === 400) {
                try {
                    const { msg } = JSON.parse(req.responseText)
                    setMessage(msg)
                } catch (err) {
                    console.log(err)
                }
            } else {
                setMessage('There was a problem with the server.')
            }
            setIsUploading(false)
        }

        req.upload.onerror = e => {
            setIsUploading(false)
        }

        req.upload.onabort = e => {
            setIsUploading(false)
        }

        req.upload.onprogress = e => {
            if (e.lengthComputable) {
                let percentComplete = e.loaded / e.total * 100
                setPercentUploaded(Math.round(percentComplete))
            }
        }

        req.send(formData)
        setIsUploading(true)
    }

    return(
        <>
            { message ? <Message msg={message} /> : '' }
            <form onSubmit={onFormSubmit} encType="multipart/form-data" method="post">
                <input type="file" onChange={onFileChange} />
                <label htmlFor="file">
                    { fileName }
                </label>
                <input type="submit" value="Upload" disabled={ isUploading ? true : false } />
            </form>
            <Progress percent={percentUploaded} />
            { uploadedFile ? <div>
                <h3>{ uploadedFile.fileName }</h3>
                <img src={ uploadedFile.filePath } alt="uploaded file" />
            </div> : '' }
        </>
    )
}

export default FileUpload
