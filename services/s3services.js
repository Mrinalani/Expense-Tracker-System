const AWS = require('aws-sdk')

const  uploadToS3 = (data, filename)=> {
  return new Promise((resolve, reject) => {
    const BUCKET_NAME = 'appexpensetracking';
    const IAM_USER_KEY = 'AKIAUAALETZP2TNU4CHS';
    const IAM_SECRET_KEY = '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';

    const s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_SECRET_KEY,
    });

    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read'
    };

    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.error('Something went wrong:', err);
        reject(err);
      } else {
        console.log('Success:', s3response);
        console.log('###########3',s3response.Location)
        resolve(s3response.Location); // Resolve with the fileURL
      }
    });
  });
}

module.exports ={
    uploadToS3
}