const aws_Profile = require('aws-sdk')
const multerProfile = require('multer')
const multer_profile_S3 = require('multer-s3');

aws_Profile.config.update({
    secretAccessKey: process.env.AWS_S3_ACCESS_SECRET,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
});

const BUCKET_Profile = process.env.AWS_S3_BUCKET
const folderName = 'market-place/';
const s3 = new aws_Profile.S3();
const params = {
    Bucket: BUCKET_Profile,
    Key: folderName
};

const storage_bucket_Profile = multer_profile_S3({
    s3: s3,
    acl: "public-read",
    bucket: BUCKET_Profile,
    contentType: multer_profile_S3.AUTO_CONTENT_TYPE,
    key: function (req: any, file: any, cb: any) {
        cb(null, `${folderName}${Date.now()}-${file.originalname.replaceAll(" ", "")}`)
    }
})

const uploadS3_Profile = multerProfile({ storage: storage_bucket_Profile })

module.exports = uploadS3_Profile
