import React, { useState } from 'react'
import Message from './Message'
import Progress from './Progress'

const FileUpload = () => {
    const [ isUploading, setIsUploading ] = useState(false)
    const [ file, setFile ] = useState('')
    const [ uploadedFile, setUploadedFile ] = useState(null)
    const [ message, setMessage ] = useState(null)
    const [ percentUploaded, setPercentUploaded ] = useState(0)

    const onFileChange = e => {
        const file = e.target.files[0]
        if (file) {
            setFile(file)
        } else {
            setFile('')
        }
        setPercentUploaded(0)
        setMessage(null)
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
                    setMessage({msg: 'File uploaded.', type: 'success'})
                } catch (err) {
                    console.log(err)
                }
            } else if (req.status === 400) {
                try {
                    const { msg } = JSON.parse(req.responseText)
                    setMessage({msg, type: 'warning'})
                } catch (err) {
                    console.log(err)
                }
            } else {
                setMessage({msg: 'There was a problem with the server.', type: 'danger'})
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
        setMessage(null)
        setIsUploading(true)
        setPercentUploaded(0.001)
    }

    return(
        <>
            <div className="row">
                <div className="col">
                    { message ? <Message {...message} /> : '' }
                </div>
            </div>
            <div className="row">
                <form onSubmit={onFormSubmit} encType="multipart/form-data" method="post" className="col">
                    <div className="form-group">
                        <label htmlFor="file1">
                            File 1
                        </label>
                        <input type="file" id="file1" className="form-control-file" onChange={onFileChange} />
                    </div>
                    <button type="submit" className="btn btn-primary mb-2" disabled={ isUploading ? true : false }>Upload</button>
                </form>
            </div>
            <div className="row">
                <div className="col">
                    { percentUploaded > 0 ? <Progress percent={percentUploaded} /> : '' }
                </div>
            </div>
            <div className="row">
                { uploadedFile ? <div className="col">
                    <h2>Last files:</h2>
                    <div>{ uploadedFile.fileName }</div>
                    <img src={ uploadedFile.filePath } alt="uploaded file" className="img-fluid" />
                </div> : '' }
            </div>
        </>
    )
}

export default FileUpload
